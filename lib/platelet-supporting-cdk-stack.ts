import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

export class PlateletSupportingCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getUserCommentsFunction = new lambda.Function(
      this,
      "GetUserComments",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        functionName: "platelet-get-user-comments",
        handler: "index.handler",
        code: lambda.Code.fromAsset("./lib/lambda/node/GetUserComments/dist"),
        timeout: cdk.Duration.seconds(180),
        memorySize: 1024,
        logRetention: RetentionDays.TWO_WEEKS,
      }
    );

    const getUserAssignmentsFunction = new lambda.Function(
      this,
      "GetUserAssignments",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        functionName: "platelet-get-user-assignments",
        handler: "index.handler",
        code: lambda.Code.fromAsset(
          "./lib/lambda/node/GetUserAssignments/dist"
        ),
        timeout: cdk.Duration.seconds(180),
        memorySize: 1024,
        logRetention: RetentionDays.TWO_WEEKS,
      }
    );

    const deleteCommentsFunction = new lambda.Function(this, "DeleteComments", {
      runtime: lambda.Runtime.NODEJS_22_X,
      functionName: "platelet-delete-comments",
      handler: "index.handler",
      code: lambda.Code.fromAsset("./lib/lambda/node/DeleteComments/dist"),
      timeout: cdk.Duration.seconds(180),
      memorySize: 1024,
      logRetention: RetentionDays.TWO_WEEKS,
    });

    const deleteAssignmentsFunction = new lambda.Function(
      this,
      "DeleteAssignments",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        functionName: "platelet-delete-assignments",
        handler: "index.handler",
        code: lambda.Code.fromAsset("./lib/lambda/node/DeleteAssignments/dist"),
        timeout: cdk.Duration.seconds(180),
        memorySize: 1024,
        logRetention: RetentionDays.TWO_WEEKS,
      }
    );
  }
}
