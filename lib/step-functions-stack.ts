import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";

export class StepFunctionsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const deployEnv = process.env.DEPLOY_ENV || "dev";
    const REGION = process.env.REGION || "eu-west-1";

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
          REGION,
        },
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
          REGION,
        },
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
          REGION,
        },
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
          REGION,
        },
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

    const cleanVehicleAssignmentsFunction = new lambda.Function(
      this,
      "CleanVehicleAssignmentsFunction",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        functionName: `platelet-sfn-clean-vehicle-assignments-${deployEnv}`,
        handler: "index.handler",
        code: lambda.Code.fromAsset(
          "./lib/lambda/node/CleanVehicleAssignments/dist"
        ),
        timeout: cdk.Duration.seconds(180),
        memorySize: 1024,
        environment: {
          REGION,
        },
      }
    );

    cleanVehicleAssignmentsFunction.role?.attachInlinePolicy(
      new iam.Policy(this, "CleanVehicleAssignmentsFunctionPolicy", {
        statements: [
          new iam.PolicyStatement({
            actions: ["appsync:GraphQL"],
            resources: [
              "arn:aws:appsync:eu-west-1:130063560692:apis/*/types/Mutation/fields/deleteVehicleAssignment",
              "arn:aws:appsync:eu-west-1:130063560692:apis/*/types/Query/fields/getUser",
            ],
          }),
        ],
      })
    );

    const cleanPossibleRiderResponsibilitiesFunction = new lambda.Function(
      this,
      "CleanPossibleRiderResponsibilitiesFunction",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        functionName: `platelet-sfn-clean-possible-rider-responsibilities-${deployEnv}`,
        handler: "index.handler",
        code: lambda.Code.fromAsset(
          "./lib/lambda/node/CleanPossibleRiderResponsibilities/dist"
        ),
        timeout: cdk.Duration.seconds(180),
        memorySize: 1024,
        environment: {
          REGION,
        },
      }
    );

    cleanPossibleRiderResponsibilitiesFunction.role?.attachInlinePolicy(
      new iam.Policy(this, "CleanPossibleRiderResponsibilitiesFunctionPolicy", {
        statements: [
          new iam.PolicyStatement({
            actions: ["appsync:GraphQL"],
            resources: [
              "arn:aws:appsync:eu-west-1:130063560692:apis/*/types/Mutation/fields/deletePossibleRiderResponsibilities",
              "arn:aws:appsync:eu-west-1:130063560692:apis/*/types/Query/fields/getUser",
            ],
          }),
        ],
      })
    );

    const deleteUserFunction = new lambda.Function(this, "DeleteUserFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      functionName: `platelet-sfn-delete-user-${deployEnv}`,
      handler: "index.handler",
      code: lambda.Code.fromAsset("./lib/lambda/node/DeleteUser/dist"),
      timeout: cdk.Duration.seconds(180),
      memorySize: 1024,
      environment: {
        REGION,
      },
    });

    deleteUserFunction.role?.attachInlinePolicy(
      new iam.Policy(this, "DeleteUserFunctionPolicy", {
        statements: [
          new iam.PolicyStatement({
            actions: [
              "appsync:GraphQL",
              "cognito-idp:AdminDeleteUser",
              "cognito-idp:AdminDisableUser",
              "cognito-idp:AdminGetUser",
            ],
            resources: [
              "arn:aws:appsync:eu-west-1:130063560692:apis/*/types/Mutation/fields/deleteUser",
              "arn:aws:appsync:eu-west-1:130063560692:apis/*/types/Query/fields/getUser",
              "arn:aws:cognito-idp:*:130063560692:userpool/*",
            ],
          }),
        ],
      })
    );

    const getUserCommentsTask = new tasks.LambdaInvoke(
      this,
      "GetUserComments",
      {
        payload: sfn.TaskInput.fromObject({
          userId: sfn.JsonPath.stringAt("$.userId"),
          graphQLEndpoint: sfn.JsonPath.stringAt("$.graphQLEndpoint"),
          userPoolId: sfn.JsonPath.stringAt("$.userPoolId"),
        }),
        lambdaFunction: getUserCommentsFunction,
        outputPath: "$.Payload",
      }
    );

    const deleteCommentsTask = new tasks.LambdaInvoke(this, "DeleteComments", {
      lambdaFunction: deleteCommentsFunction,
      outputPath: "$.Payload",
    });

    const getUserAssignmentsTask = new tasks.LambdaInvoke(
      this,
      "GetUserAssignments",
      {
        lambdaFunction: getUserAssignmentsFunction,
        outputPath: "$.Payload",
      }
    );

    // Define the DeleteAssignments task and configure it to retry the whole flow
    const deleteAssignmentsTask = new tasks.LambdaInvoke(
      this,
      "DeleteAssignments",
      {
        lambdaFunction: deleteAssignmentsFunction,
        outputPath: "$.Payload",
      }
    );
    const cleanVehicleAssignmentsTask = new tasks.LambdaInvoke(
      this,
      "CleanVehicleAssignments",
      {
        lambdaFunction: cleanVehicleAssignmentsFunction,
        outputPath: "$.Payload",
      }
    );

    const cleanPossibleRiderResponsibilitiesTask = new tasks.LambdaInvoke(
      this,
      "CleanPossibleRiderResponsibilities",
      {
        lambdaFunction: cleanPossibleRiderResponsibilitiesFunction,
        outputPath: "$.Payload",
      }
    );

    const deleteUserTask = new tasks.LambdaInvoke(this, "DeleteUser", {
      lambdaFunction: deleteUserFunction,
    });

    const successState = new sfn.Succeed(this, "User deleted");

    const definition = sfn.Chain.start(getUserCommentsTask)
      .next(deleteCommentsTask)
      .next(getUserAssignmentsTask)
      .next(deleteAssignmentsTask)
      .next(cleanVehicleAssignmentsTask)
      .next(cleanPossibleRiderResponsibilitiesTask)
      .next(deleteUserTask)
      .next(successState);

    const deleteUserStateMachine = new sfn.StateMachine(
      this,
      `DeleteUserStateMachine-${deployEnv}`,
      {
        definition: definition,
      }
    );

    // save the state machine name to SSM to be accessed by plateletAdminDeleteUser lambda
    new ssm.StringParameter(this, "DeleteUserStateMachineArnSSMParam", {
      parameterName: `/platelet-supporting-cdk/${deployEnv}/DeleteUserStateMachineArn`,
      stringValue: deleteUserStateMachine.stateMachineArn,
    });
  }
}
