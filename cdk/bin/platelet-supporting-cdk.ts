#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { PlateletCdkStack } from "../lib/platelet-cdk-stack";

const app = new cdk.App();

const deployEnv = process.env.DEPLOY_ENV || "dev";

new PlateletCdkStack(app, `PlateletCdkStack-${deployEnv}`, {
    env: { account: "130063560692", region: "eu-west-1" },
});

cdk.Aspects.of(app).add(new AwsSolutionsChecks());
