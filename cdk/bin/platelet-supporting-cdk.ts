#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { StepFunctionsStack } from "../lib/step-functions-stack";
import { AwsSolutionsChecks } from "cdk-nag";

const app = new cdk.App();

const deployEnv = process.env.DEPLOY_ENV || "dev";

new StepFunctionsStack(app, `StepFunctionsStack-${deployEnv}`, {
    env: { account: "130063560692", region: "eu-west-1" },
});

cdk.Aspects.of(app).add(new AwsSolutionsChecks());
