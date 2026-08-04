#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { PlateletCdkStack } from "../lib/platelet-cdk-stack";

const app = new cdk.App();

const deployEnv = process.env.DEPLOY_ENV || "dev";

const region = process.env.AWS_REGION || "eu-west-1";

const stackName = deployEnv.replace(/[^A-Za-z0-9-]/g, "-");

new PlateletCdkStack(app, `PlateletCdkStack-${stackName}`, {
    env: { region },
});

cdk.Aspects.of(app).add(new AwsSolutionsChecks());
