#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { PlateletCdkStack } from "../lib/platelet-cdk-stack";

const app = new cdk.App();

const deployEnv = process.env.DEPLOY_ENV || "dev";

const awsAccountNumber = process.env.AWS_ACCOUNT_NUMBER;

const stackName = deployEnv.replace(/[^A-Za-z0-9-]/g, "-");

new PlateletCdkStack(app, `PlateletCdkStack-${stackName}`, {
    env: { account: awsAccountNumber, region: "eu-west-1" },
});

cdk.Aspects.of(app).add(new AwsSolutionsChecks());
