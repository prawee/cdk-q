import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import path from "path";

export class QStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dlq = new sqs.Queue(this, "QdeadLetterQueue", {
      retentionPeriod: cdk.Duration.days(7),
    });

    const queue = new sqs.Queue(this, "Qfunc", {
      visibilityTimeout: cdk.Duration.seconds(120),
      deadLetterQueue: { 
        queue: dlq, 
        maxReceiveCount: 3
      },
    });

    const triggerFn = new NodejsFunction(this, "Qtrigger", {
      entry: path.join(__dirname, "../src/lambda.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      bundling: {
        minify: true,
        externalModules: ["aws-sdk"],
        nodeModules: ["@aws-sdk/client-sqs", "hono"],
      },
      environment: {
        SQS_QUEUE_URL: queue.queueUrl,
      },
    });

    queue.grantSendMessages(triggerFn);

    new cdk.CfnOutput(this, "QueueUrl", { value: queue.queueUrl });
  }
}
