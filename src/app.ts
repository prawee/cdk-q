import { Hono } from "hono";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const app = new Hono();
const sqs = new SQSClient();

app.get("/", (c) => c.text("Hello World"));

app.post("/q/trigger", async (c) => {
    console.log(`Triggered at ${new Date().toISOString()}`);
    const body = await c.req.json();
    const message = body?.message ?? "Trigger default message";
    const delaySeconds = Number(process.env.SQS_DELAY_SECONDS ?? 60);

    const payload = {
        message,
        requestedAt: new Date().toISOString(),
    };

    await sqs.send(new SendMessageCommand({
        QueueUrl: process.env.SQS_QUEUE_URL!,
        MessageBody: JSON.stringify(payload),
        DelaySeconds: delaySeconds,
    }));

    return c.json({ 
        message: "Triggered",
        ok: true,
        scheduledInSeconds: delaySeconds,
        payload,
    });
});

export default app;
