import * as cdk from "aws-cdk-lib";
import * as logs from "aws-cdk-lib/aws-logs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { NagSuppressions } from "cdk-nag";
import { createLambdaStatement, getRoleArnNameOnly } from "./utils";

export interface DeleteUserStepFunctionProps {
    userPoolId: string;
    region: string;
    appsyncId: string;
    bucketName: string;
    graphQLEndpoint: string;
    amplifyEnv: string;
    retryFunction: lambda.Function;
}

export class DeleteUserStepFunction extends Construct {
    private userPool: cdk.aws_cognito.IUserPool;
    private bucket: cdk.aws_s3.IBucket;
    private appsync: cdk.aws_appsync.IGraphqlApi;
    private amplifyEnv: string;
    private graphQLEndpoint: string;

    constructor(
        scope: Construct,
        id: string,
        props: DeleteUserStepFunctionProps
    ) {
        super(scope, id);

        this.userPool = cognito.UserPool.fromUserPoolId(
            this,
            "AmplifyUserPool",
            props.userPoolId
        );
        this.bucket = s3.Bucket.fromBucketName(
            this,
            "AmplifyBucket",
            props.bucketName
        );
        this.appsync = appsync.GraphqlApi.fromGraphqlApiAttributes(
            this,
            "ExitingAppsync",
            { graphqlApiId: props.appsyncId }
        );
        this.graphQLEndpoint = props.graphQLEndpoint;

        this.amplifyEnv = props.amplifyEnv;

        console.log(
            "Got context",
            props.appsyncId,
            props.graphQLEndpoint,
            props.bucketName,
            props.amplifyEnv,
            props.region,
            props.userPoolId
        );

        if (
            !props.appsyncId ||
            !props.graphQLEndpoint ||
            !props.bucketName ||
            !props.amplifyEnv ||
            !props.region ||
            !props.userPoolId
        ) {
            throw new Error("You must pass in all the context values");
        }

        const getUserCommentsFunction = new lambda.Function(
            this,
            "GetUserCommentsFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/GetUserComments/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: new iam.Role(this, "GetUserCommentsFunctionRole", {
                    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
                }),
            }
        );

        createLambdaStatement(getUserCommentsFunction, this.appsync.arn, {
            queries: ["getUser"],
        });

        const getUserAssignmentsFunction = new lambda.Function(
            this,
            "GetUserAssignmentsFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/GetUserAssignments/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: new iam.Role(this, "GetUserAssignmentsFunctionRole", {
                    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
                }),
            }
        );
        createLambdaStatement(getUserAssignmentsFunction, this.appsync.arn, {
            queries: ["getUser"],
        });

        const deleteCommentsFunction = new lambda.Function(
            this,
            "DeleteCommentsFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/DeleteComments/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: new iam.Role(this, "DeleteCommentsFunctionRole", {
                    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
                }),
            }
        );

        createLambdaStatement(deleteCommentsFunction, this.appsync.arn, {
            mutations: ["deleteComment", "updateComment"],
        });

        const deleteAssignmentsFunction = new lambda.Function(
            this,
            "DeleteAssignmentsFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/DeleteAssignments/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: new iam.Role(this, "DeleteAssignmentsFunctionRole", {
                    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
                }),
            }
        );
        createLambdaStatement(deleteAssignmentsFunction, this.appsync.arn, {
            mutations: ["deleteTaskAssignee"],
        });

        const cleanVehicleAssignmentsFunction = new lambda.Function(
            this,
            "CleanVehicleAssignmentsFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/CleanVehicleAssignments/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: new iam.Role(
                    this,
                    "CleanVehicleAssignmentsFunctionRole",
                    {
                        assumedBy: new iam.ServicePrincipal(
                            "lambda.amazonaws.com"
                        ),
                    }
                ),
            }
        );
        createLambdaStatement(
            cleanVehicleAssignmentsFunction,
            this.appsync.arn,
            {
                queries: ["getUser"],
                mutations: ["deleteVehicleAssignment"],
            }
        );

        const cleanPossibleRiderResponsibilitiesFunction = new lambda.Function(
            this,
            "CleanPossibleRiderResponsibilitiesFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/CleanPossibleRiderResponsibilities/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: new iam.Role(
                    this,
                    "CleanPossibleRiderResponsibilitiesFunctionRole",
                    {
                        assumedBy: new iam.ServicePrincipal(
                            "lambda.amazonaws.com"
                        ),
                    }
                ),
            }
        );

        createLambdaStatement(
            cleanPossibleRiderResponsibilitiesFunction,
            this.appsync.arn,
            {
                queries: ["getUser"],
                mutations: ["deletePossibleRiderResponsibilities"],
            }
        );

        const onUserDeleteFailureFunction = new lambda.Function(
            this,
            "DeleteUserOnFailure",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/DeleteUserOnFailure/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                environment: {
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: new iam.Role(this, "DeleteUserOnFailureFunctionRole", {
                    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
                }),
            }
        );

        createLambdaStatement(onUserDeleteFailureFunction, this.appsync.arn, {
            queries: ["getUser"],
            mutations: ["updateUser"],
        });

        const deleteUserFunction = new lambda.Function(
            this,
            "DeleteUserFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/DeleteUser/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                    USER_POOL_ID: this.userPool.userPoolId,
                },
                role: new iam.Role(this, "DeleteUserFunctionRole", {
                    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
                }),
            }
        );

        createLambdaStatement(deleteUserFunction, this.appsync.arn, {
            queries: ["getUser"],
            mutations: ["deleteUser"],
        });
        deleteUserFunction.role?.attachInlinePolicy(
            new iam.Policy(this, "DeleteUserCognitoPolicy", {
                statements: [
                    new iam.PolicyStatement({
                        actions: [
                            "cognito-idp:AdminDeleteUser",
                            "cognito-idp:AdminDisableUser",
                            "cognito-idp:AdminGetUser",
                        ],
                        resources: [this.userPool.userPoolArn],
                    }),
                ],
            })
        );

        deleteUserFunction.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ["s3:DeleteObject"],
                resources: [`${this.bucket.bucketArn}/public/*`],
            })
        );
        deleteUserFunction.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ["s3:ListBucket"],
                resources: [this.bucket.bucketArn],
            })
        );
        deleteUserFunction.addToRolePolicy(
            new iam.PolicyStatement({
                effect: iam.Effect.DENY,
                actions: ["s3:ListBucket"],
                resources: [this.bucket.bucketArn],
                conditions: {
                    StringEquals: {
                        "s3:prefix": "public/",
                    },
                },
            })
        );
        if (deleteUserFunction.role) {
            NagSuppressions.addResourceSuppressions(
                deleteUserFunction.role,
                [
                    {
                        id: "AwsSolutions-IAM5",
                        reason: "Wildcard is required in S3 policy so any profile picture can be deleted",
                    },
                ],
                true
            );
        }

        const retryCheckLambdaTask = new tasks.LambdaInvoke(
            this,
            "RetryCheck",
            {
                lambdaFunction: props.retryFunction,
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
            `DeleteUserStateMachine`,
            {
                definition: definition,
                logs: {
                    destination: new logs.LogGroup(
                        this,
                        "DeleteUserSFLogGroup",
                        {
                            removalPolicy: cdk.RemovalPolicy.DESTROY,
                        }
                    ),
                    level: sfn.LogLevel.ALL,
                },
                tracingEnabled: true,
            }
        );

        NagSuppressions.addResourceSuppressions(
            deleteUserStateMachine.role,
            [
                {
                    id: "AwsSolutions-IAM5",
                    reason: "The Step Function Role must be allowed to invoke Lambda functions. The wildcard is automatically added by the tasks.LambdaInvoke construct and is scoped to the function ARN for invocation.",
                },
            ],
            true
        );

        // save the state machine name to SSM to be accessed by plateletAdminDeleteUser lambda
        const deleteUserStateMachineArnSSMParam = new ssm.StringParameter(
            this,
            "DeleteUserStateMachineArnSSMParam",
            {
                parameterName: `/platelet-supporting-cdk/${this.amplifyEnv}/DeleteUserStateMachineArn`,
                stringValue: deleteUserStateMachine.stateMachineArn,
            }
        );

        // output role names needed for custom-roles.json
        new cdk.CfnOutput(this, "AdminRoleNamesGetUserCommentsRoleOutput", {
            value: getRoleArnNameOnly(getUserCommentsFunction),
        });
        new cdk.CfnOutput(this, "AdminRoleNamesDeleteCommentsRoleOutput", {
            value: getRoleArnNameOnly(deleteCommentsFunction),
        });
        new cdk.CfnOutput(this, "AdminRoleNamesGetUserAssignmentsRoleOutput", {
            value: getRoleArnNameOnly(getUserAssignmentsFunction),
        });
        new cdk.CfnOutput(this, "AdminRoleNamesDeleteAssignmentsRoleOutput", {
            value: getRoleArnNameOnly(deleteAssignmentsFunction),
        });
        new cdk.CfnOutput(
            this,
            "AdminRoleNamesCleanVehicleAssignmentsRoleOutput",
            {
                value: getRoleArnNameOnly(cleanVehicleAssignmentsFunction),
            }
        );
        new cdk.CfnOutput(
            this,
            "AdminRoleNamesCleanPossibleRiderResponsibilitiesRoleOutput",
            {
                value: getRoleArnNameOnly(
                    cleanPossibleRiderResponsibilitiesFunction
                ),
            }
        );
        new cdk.CfnOutput(this, "AdminRoleNamesDeleteUserRoleOutput", {
            value: getRoleArnNameOnly(deleteUserFunction),
        });

        new cdk.CfnOutput(this, "DeleteUserStateMachineArnOutput", {
            value: deleteUserStateMachine.stateMachineArn,
        });
        new cdk.CfnOutput(this, "DeleteUserStateMachineArnSSMParamArnOutput", {
            value: deleteUserStateMachineArnSSMParam.parameterArn,
        });
    }
}
