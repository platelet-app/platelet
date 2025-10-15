#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { StepFunctionsStack } from "../lib/step-functions-stack";

const app = new cdk.App();

const deployEnv = process.env.DEPLOY_ENV || "dev";

new StepFunctionsStack(app, `StepFunctionsStack-${deployEnv}`, {
  env: { account: "130063560692", region: "eu-west-1" },
});
