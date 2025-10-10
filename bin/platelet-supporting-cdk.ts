#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { PlateletSupportingCdkStack } from "../lib/platelet-supporting-cdk-stack";

const app = new cdk.App();
new PlateletSupportingCdkStack(app, "PlateletSupportingCdkStack", {
  env: { account: "130063560692", region: "eu-west-1" },
});
