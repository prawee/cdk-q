
import { SQSEvent, SQSRecord } from "aws-lambda";

export const handler = async (event: SQSEvent) => {
    console.log("Worker triggered", event);

    const failures: { itemIdentifier: string }[] = [];

    for (const record of event.Records) {
        console.log("Processing record", record);

        try {
            const body = JSON.parse(record.body!);
            console.log("SQS triggred. It it time!", {
                receivedAt: new Date().toISOString(),
                body,
            });
        } catch (error) {
            console.error("Failed to process record", record.messageId, error);
            failures.push({ itemIdentifier: record.messageId });
        }
    }

    return { batchItemFailures: failures };
};
