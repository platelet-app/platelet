import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { StepFunctionsStack } from "./step-functions-stack";

export class PlateletSupportingCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const deployEnv = process.env.DEPLOY_ENV || "dev";

    const stepFunctionsStack = new StepFunctionsStack(
      scope,
      `StepFunctionsStack-${deployEnv}`,
      { deployEnv }
    );
  }
}
