#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { PlateletCdkStack } from "../lib/platelet-cdk-stack";

const app = new cdk.App();

new PlateletCdkStack(app, "PlateletCdkStack", {
    env: { account: "130063560692", region: "eu-west-1" },
});

cdk.Aspects.of(app).add(new AwsSolutionsChecks());
