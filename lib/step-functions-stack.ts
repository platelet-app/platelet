import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as iam from "aws-cdk-lib/aws-iam";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

interface StepFunctionsStackProps extends cdk.StackProps {
  deployEnv: string;
}

export class StepFunctionsStack extends cdk.Stack {
  public readonly deleteUserStateMachine: sfn.StateMachine;
  constructor(scope: Construct, id: string, props: StepFunctionsStackProps) {
    super(scope, id, props);

    const { deployEnv } = props;

    const getUserCommentsFunction = new lambda.Function(
      this,
      "GetUserCommentsFunction",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        functionName: `platelet-sfn-get-user-comments-${deployEnv}`,
        handler: "index.handler",
        code: lambda.Code.fromAsset("./lib/lambda/node/GetUserComments/dist"),
        timeout: cdk.Duration.seconds(180),
        memorySize: 1024,
        environment: {
          REGION: "eu-west-1",
        },
        logRetention: RetentionDays.TWO_WEEKS,
      }
    );

    getUserCommentsFunction.role?.attachInlinePolicy(
      new iam.Policy(this, "GetUserCommentsFunctionPolicy", {
        statements: [
          new iam.PolicyStatement({
            actions: ["appsync:GraphQL"],
            resources: [
              "arn:aws:appsync:eu-west-1:130063560692:apis/*/types/Query/fields/getUser",
            ],
          }),
        ],
      })
    );

    const getUserAssignmentsFunction = new lambda.Function(
      this,
      "GetUserAssignmentsFunction",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        functionName: `platelet-sfn-get-user-assignments-${deployEnv}`,
        handler: "index.handler",
        code: lambda.Code.fromAsset(
          "./lib/lambda/node/GetUserAssignments/dist"
        ),
        timeout: cdk.Duration.seconds(180),
        memorySize: 1024,
        environment: {
          REGION: "eu-west-1",
        },
        logRetention: RetentionDays.TWO_WEEKS,
      }
    );

    getUserAssignmentsFunction.role?.attachInlinePolicy(
      new iam.Policy(this, "GetUserAssignmentsPolicy", {
        statements: [
          new iam.PolicyStatement({
            actions: ["appsync:GraphQL"],
            resources: [
              "arn:aws:appsync:eu-west-1:130063560692:apis/*/types/Query/fields/getUser",
            ],
          }),
        ],
      })
    );

    const deleteCommentsFunction = new lambda.Function(
      this,
      "DeleteCommentsFunction",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        functionName: `platelet-sfn-delete-comments-${deployEnv}`,
        handler: "index.handler",
        code: lambda.Code.fromAsset("./lib/lambda/node/DeleteComments/dist"),
        timeout: cdk.Duration.seconds(180),
        memorySize: 1024,
        environment: {
          REGION: "eu-west-1",
        },
        logRetention: RetentionDays.TWO_WEEKS,
      }
    );

    deleteCommentsFunction.role?.attachInlinePolicy(
      new iam.Policy(this, "DeleteCommentsFunctionPolicy", {
        statements: [
          new iam.PolicyStatement({
            actions: ["appsync:GraphQL"],
            resources: [
              "arn:aws:appsync:eu-west-1:130063560692:apis/*/types/Mutation/fields/deleteComment",
            ],
          }),
        ],
      })
    );

    const deleteAssignmentsFunction = new lambda.Function(
      this,
      "DeleteAssignmentsFunction",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        functionName: `platelet-sfn-delete-assignments-${deployEnv}`,
        handler: "index.handler",
        code: lambda.Code.fromAsset("./lib/lambda/node/DeleteAssignments/dist"),
        timeout: cdk.Duration.seconds(180),
        memorySize: 1024,
        environment: {
          REGION: "eu-west-1",
        },
        logRetention: RetentionDays.TWO_WEEKS,
      }
    );

    deleteAssignmentsFunction.role?.attachInlinePolicy(
      new iam.Policy(this, "DeleteAssignmentsFunctionPolicy", {
        statements: [
          new iam.PolicyStatement({
            actions: ["appsync:GraphQL"],
            resources: [
              "arn:aws:appsync:eu-west-1:130063560692:apis/*/types/Mutation/fields/deleteTaskAssignee",
            ],
          }),
        ],
      })
    );

    this.deleteUserStateMachine = new sfn.StateMachine(
      this,
      `DeleteUserStateMachine-${deployEnv}`,
      {
        definition: new tasks.LambdaInvoke(this, "GetUserComments", {
          payload: sfn.TaskInput.fromObject({
            userId: sfn.JsonPath.stringAt("$.userId"),
            graphQLEndpoint: sfn.JsonPath.stringAt("$.graphQLEndpoint"),
          }),
          lambdaFunction: getUserCommentsFunction,
          outputPath: "$.Payload",
        })
          .next(
            new tasks.LambdaInvoke(this, "DeleteComments", {
              lambdaFunction: deleteCommentsFunction,
              outputPath: "$.Payload",
            })
          )
          .next(
            new tasks.LambdaInvoke(this, "GetUserAssignments", {
              lambdaFunction: getUserAssignmentsFunction,
              outputPath: "$.Payload",
            })
          )
          .next(
            new tasks.LambdaInvoke(this, "DeleteAssignments", {
              lambdaFunction: deleteAssignmentsFunction,
            })
          )
          .next(new sfn.Succeed(this, "User deleted")),
      }
    );
  }
}
