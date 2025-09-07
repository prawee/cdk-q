import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";

export class QStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dlq = new sqs.Queue(this, "QdeadLetterQueue", {
      retentionPeriod: cdk.Duration.days(7),
    });

    const queue = new sqs.Queue(this, "iQueue", {
      visibilityTimeout: cdk.Duration.seconds(120),
      deadLetterQueue: { 
        queue: dlq, 
        maxReceiveCount: 3
      },
    });

    new cdk.CfnOutput(this, "QueueUrl", { value: queue.queueUrl });
  }
}
