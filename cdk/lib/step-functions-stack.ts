import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";

const getRoleArnNameOnly = (functionObject: lambda.Function) => {
    const lambdaRole = functionObject.role;
    const cfnRole = lambdaRole?.node.defaultChild as iam.CfnRole;
    return cfnRole.attrArn;
};

export class StepFunctionsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        const deployEnv = process.env.DEPLOY_ENV || "dev";

        const appsyncId = this.node.tryGetContext("appsyncId");
        const userPoolId = this.node.tryGetContext("userPoolId");
        const graphQLEndpoint = this.node.tryGetContext("graphQLEndpoint");
        const bucketName = this.node.tryGetContext("bucketName");

        console.log(
            "Got context",
            appsyncId,
            userPoolId,
            graphQLEndpoint,
            bucketName
        );

        if (!appsyncId || !userPoolId || !graphQLEndpoint || !bucketName) {
            throw new Error("You must pass in all the context values");
        }

        const getUserCommentsFunction = new lambda.Function(
            this,
            "GetUserCommentsFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                functionName: `platelet-sfn-get-user-comments-${deployEnv}`,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/GetUserComments/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                memorySize: 1024,
                environment: {
                    REGION: this.region,
                    GRAPHQL_ENDPOINT: graphQLEndpoint,
                },
            }
        );

        getUserCommentsFunction.role?.attachInlinePolicy(
            new iam.Policy(this, "GetUserCommentsFunctionPolicy", {
                statements: [
                    new iam.PolicyStatement({
                        actions: ["appsync:GraphQL"],
                        resources: [
                            `arn:aws:appsync:${this.region}:${this.account}:apis/${appsyncId}/types/Query/fields/getUser`,
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
                    REGION: this.region,
                    GRAPHQL_ENDPOINT: graphQLEndpoint,
                },
            }
        );

        getUserAssignmentsFunction.role?.attachInlinePolicy(
            new iam.Policy(this, "GetUserAssignmentsPolicy", {
                statements: [
                    new iam.PolicyStatement({
                        actions: ["appsync:GraphQL"],
                        resources: [
                            `arn:aws:appsync:${this.region}:${this.account}:apis/${appsyncId}/types/Query/fields/getUser`,
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
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/DeleteComments/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                memorySize: 1024,
                environment: {
                    REGION: this.region,
                    GRAPHQL_ENDPOINT: graphQLEndpoint,
                },
            }
        );

        deleteCommentsFunction.role?.attachInlinePolicy(
            new iam.Policy(this, "DeleteCommentsFunctionPolicy", {
                statements: [
                    new iam.PolicyStatement({
                        actions: ["appsync:GraphQL"],
                        resources: [
                            `arn:aws:appsync:${this.region}:${this.account}:apis/${appsyncId}/types/Mutation/fields/deleteComment`,
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
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/DeleteAssignments/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                memorySize: 1024,
                environment: {
                    REGION: this.region,
                    GRAPHQL_ENDPOINT: graphQLEndpoint,
                },
            }
        );

        deleteAssignmentsFunction.role?.attachInlinePolicy(
            new iam.Policy(this, "DeleteAssignmentsFunctionPolicy", {
                statements: [
                    new iam.PolicyStatement({
                        actions: ["appsync:GraphQL"],
                        resources: [
                            `arn:aws:appsync:${this.region}:${this.account}:apis/${appsyncId}/types/Mutation/fields/deleteTaskAssignee`,
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
                    REGION: this.region,
                    GRAPHQL_ENDPOINT: graphQLEndpoint,
                },
            }
        );

        cleanVehicleAssignmentsFunction.role?.attachInlinePolicy(
            new iam.Policy(this, "CleanVehicleAssignmentsFunctionPolicy", {
                statements: [
                    new iam.PolicyStatement({
                        actions: ["appsync:GraphQL"],
                        resources: [
                            `arn:aws:appsync:${this.region}:${this.account}:apis/${appsyncId}/types/Mutation/fields/deleteVehicleAssignment`,
                            `arn:aws:appsync:${this.region}:${this.account}:apis/${appsyncId}/types/Query/fields/getUser`,
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
                    REGION: this.region,
                    GRAPHQL_ENDPOINT: graphQLEndpoint,
                },
            }
        );

        cleanPossibleRiderResponsibilitiesFunction.role?.attachInlinePolicy(
            new iam.Policy(
                this,
                "CleanPossibleRiderResponsibilitiesFunctionPolicy",
                {
                    statements: [
                        new iam.PolicyStatement({
                            actions: ["appsync:GraphQL"],
                            resources: [
                                `arn:aws:appsync:${this.region}:${this.account}:apis/${appsyncId}/types/Mutation/fields/deletePossibleRiderResponsibilities`,
                                `arn:aws:appsync:${this.region}:${this.account}:apis/${appsyncId}/types/Query/fields/getUser`,
                            ],
                        }),
                    ],
                }
            )
        );

        const deleteUserFunction = new lambda.Function(
            this,
            "DeleteUserFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                functionName: `platelet-sfn-delete-user-${deployEnv}`,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/DeleteUser/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                memorySize: 1024,
                environment: {
                    REGION: this.region,
                    GRAPHQL_ENDPOINT: graphQLEndpoint,
                    USER_POOL_ID: userPoolId,
                },
            }
        );

        deleteUserFunction.role?.attachInlinePolicy(
            new iam.Policy(this, "DeleteUserFunctionPolicy", {
                statements: [
                    new iam.PolicyStatement({
                        actions: [
                            "appsync:GraphQL",
                            "cognito-idp:AdminDeleteUser",
                            "cognito-idp:AdminDisableUser",
                            "cognito-idp:AdminGetUser",
                            "s3:DeleteObject",
                        ],
                        resources: [
                            `arn:aws:appsync:${this.region}:${this.account}:apis/${appsyncId}/types/Mutation/fields/deleteUser`,
                            `arn:aws:appsync:${this.region}:${this.account}:apis/${appsyncId}/types/Query/fields/getUser`,
                            `arn:aws:cognito-idp:*:${this.account}:userpool/${userPoolId}`,
                            `arn:aws:s3:::${bucketName}/public/*`,
                        ],
                    }),
                ],
            })
        );

        const RETRY_LIMIT = 3;

        const retryCheckLambda = new lambda.Function(
            this,
            "DeleteUserStepFunctionRetryChecker",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                functionName: `platelet-delete-user-stepfunction-retry-checker-${deployEnv}`,
                handler: "index.handler",
                code: lambda.Code.fromInline(
                    `
          exports.handler = async function(event) {
              let { userId, graphQLEndpoint, userPoolId, retryCount } = event;
              console.log("Retry count:", retryCount)
              if (!retryCount) {
                  return {userId, graphQLEndpoint, userPoolId, retryCount: 1}
              }
              if (retryCount > ${RETRY_LIMIT}) {
                  throw new Error("Retries exceeded")
              }

              retryCount += 1

              return {userId, graphQLEndpoint, userPoolId, retryCount}
          };
          `
                ),
            }
        );

        const retryCheckLambdaTask = new tasks.LambdaInvoke(
            this,
            "RetryCheck",
            {
                lambdaFunction: retryCheckLambda,
                payload: sfn.TaskInput.fromJsonPathAt("$"),
                outputPath: "$.Payload",
            }
        );

        const waitBeforeRetry = new sfn.Wait(this, "RetryWait", {
            time: sfn.WaitTime.duration(cdk.Duration.seconds(30)),
        });

        const getUserCommentsTask = new tasks.LambdaInvoke(
            this,
            "GetUserComments",
            {
                lambdaFunction: getUserCommentsFunction,
                outputPath: "$.Payload",
            }
        );

        const deleteCommentsTask = new tasks.LambdaInvoke(
            this,
            "DeleteComments",
            {
                lambdaFunction: deleteCommentsFunction,
                outputPath: "$.Payload",
            }
        );

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
            outputPath: "$.Payload",
        });

        const catchOptions = {
            errors: ["AppsyncFailure"],
            resultPath: sfn.JsonPath.DISCARD,
        };

        getUserCommentsTask.addCatch(waitBeforeRetry, catchOptions);
        deleteCommentsTask.addCatch(waitBeforeRetry, catchOptions);
        getUserAssignmentsTask.addCatch(waitBeforeRetry, catchOptions);
        deleteAssignmentsTask.addCatch(waitBeforeRetry, catchOptions);
        cleanVehicleAssignmentsTask.addCatch(waitBeforeRetry, catchOptions);
        cleanPossibleRiderResponsibilitiesTask.addCatch(
            waitBeforeRetry,
            catchOptions
        );
        deleteUserTask.addCatch(waitBeforeRetry, catchOptions);

        const successState = new sfn.Succeed(this, "User deleted");

        const mainChain = sfn.Chain.start(getUserCommentsTask)
            .next(deleteCommentsTask)
            .next(getUserAssignmentsTask)
            .next(deleteAssignmentsTask)
            .next(cleanVehicleAssignmentsTask)
            .next(cleanPossibleRiderResponsibilitiesTask)
            .next(deleteUserTask)
            .next(successState);

        waitBeforeRetry.next(retryCheckLambdaTask);
        retryCheckLambdaTask.next(mainChain);
        const definition = sfn.Chain.start(retryCheckLambdaTask);

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

        // output role names needed for custom-roles.json
        new cdk.CfnOutput(this, "GetUserCommentsRole", {
            value: getRoleArnNameOnly(getUserCommentsFunction),
        });
        new cdk.CfnOutput(this, "DeleteCommentsRole", {
            value: getRoleArnNameOnly(deleteCommentsFunction),
        });
        new cdk.CfnOutput(this, "GetUserAssignmentsRole", {
            value: getRoleArnNameOnly(getUserAssignmentsFunction),
        });
        new cdk.CfnOutput(this, "DeleteAssignmentsRole", {
            value: getRoleArnNameOnly(deleteAssignmentsFunction),
        });
        new cdk.CfnOutput(this, "CleanVehicleAssignmentsRole", {
            value: getRoleArnNameOnly(cleanVehicleAssignmentsFunction),
        });
        new cdk.CfnOutput(this, "CleanPossibleRiderResponsibilitiesRole", {
            value: getRoleArnNameOnly(
                cleanPossibleRiderResponsibilitiesFunction
            ),
        });
        new cdk.CfnOutput(this, "DeleteUserRole", {
            value: getRoleArnNameOnly(deleteUserFunction),
        });
    }
}
