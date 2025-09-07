#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { QStack } from "../lib/q-stack";

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();
new QStack(app, "QStack", { env });
