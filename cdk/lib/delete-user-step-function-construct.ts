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

export interface DeleteUserStepFunctionProps {
    userPoolId: string;
    region: string;
    appsyncId: string;
    bucketName: string;
    graphQLEndpoint: string;
    amplifyEnv: string;
}

const getRoleArnNameOnly = (functionObject: lambda.Function) => {
    const lambdaRole = functionObject.role;
    const cfnRole = lambdaRole?.node.defaultChild as iam.CfnRole;
    return cfnRole.attrArn;
};

export class DeleteUserStepFunction extends Construct {
    private userPool: cdk.aws_cognito.IUserPool;
    private bucket: cdk.aws_s3.IBucket;
    private appsync: cdk.aws_appsync.IGraphqlApi;
    private amplifyEnv: string;
    private graphQLEndpoint: string;

    private createLambdaStatement = (
        lambdaFunction: cdk.aws_lambda.IFunction,
        appsyncFields?: {
            queries?: string[];
            mutations?: string[];
        }
    ) => {
        const loggingStatement = new iam.PolicyStatement({
            actions: [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
            ],
            resources: ["*"],
        });

        let appsyncStatement;

        if (appsyncFields?.mutations || appsyncFields?.queries) {
            const queryResources = appsyncFields.queries?.map(
                (query) => `${this.appsync.arn}/types/Query/fields/${query}`
            );

            const mutationResources = appsyncFields.mutations?.map(
                (mutation) =>
                    `${this.appsync.arn}/types/Mutation/fields/${mutation}`
            );
            const appsyncResources = [
                ...(queryResources || []),
                ...(mutationResources || []),
            ];

            if (appsyncResources.length === 0) {
                throw new Error("No appsync resources found");
            }

            appsyncStatement = new iam.PolicyStatement();
            appsyncStatement.addActions("appsync:GraphQL");
            for (const resource of appsyncResources) {
                appsyncStatement.addResources(resource);
            }
        }
        lambdaFunction.addToRolePolicy(loggingStatement);
        if (appsyncStatement) {
            lambdaFunction.addToRolePolicy(appsyncStatement);
        }
        if (lambdaFunction.role) {
            NagSuppressions.addResourceSuppressions(
                lambdaFunction.role,
                [
                    {
                        id: "AwsSolutions-IAM5",
                        reason: 'Wildcard is required for the "logs:CreateLogGroup" action to allow the Lambda service to create its log group upon first invocation. The wildcard is scoped to the specific function log group ARN.',
                    },
                ],
                true
            );
        }
    };

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
                memorySize: 1024,
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: new iam.Role(this, "GetUserCommentsFunctionRole", {
                    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
                }),
            }
        );

        this.createLambdaStatement(getUserCommentsFunction, {
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
                memorySize: 1024,
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: new iam.Role(this, "GetUserAssignmentsFunctionRole", {
                    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
                }),
            }
        );
        this.createLambdaStatement(getUserAssignmentsFunction, {
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
                memorySize: 1024,
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: new iam.Role(this, "DeleteCommentsFunctionRole", {
                    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
                }),
            }
        );

        this.createLambdaStatement(deleteCommentsFunction, {
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
                memorySize: 1024,
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: new iam.Role(this, "DeleteAssignmentsFunctionRole", {
                    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
                }),
            }
        );
        this.createLambdaStatement(deleteAssignmentsFunction, {
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
                memorySize: 1024,
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
        this.createLambdaStatement(cleanVehicleAssignmentsFunction, {
            queries: ["getUser"],
            mutations: ["deleteVehicleAssignment"],
        });

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
                memorySize: 1024,
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
        this.createLambdaStatement(cleanPossibleRiderResponsibilitiesFunction, {
            queries: ["getUser"],
            mutations: ["deletePossibleRiderResponsibilities"],
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
                memorySize: 1024,
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

        this.createLambdaStatement(deleteUserFunction, {
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

        const RETRY_LIMIT = 3;

        const retryCheckFunction = new lambda.Function(
            this,
            "DeleteUserStepFunctionRetryChecker",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
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
                role: new iam.Role(this, "RetriesRole", {
                    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
                }),
            }
        );

        const retryCheckLambdaTask = new tasks.LambdaInvoke(
            this,
            "RetryCheck",
            {
                lambdaFunction: retryCheckFunction,
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
        new ssm.StringParameter(this, "DeleteUserStateMachineArnSSMParam", {
            parameterName: `/platelet-supporting-cdk/${this.amplifyEnv}/DeleteUserStateMachineArn`,
            stringValue: deleteUserStateMachine.stateMachineArn,
        });

        // output role names needed for custom-roles.json
        new cdk.CfnOutput(this, "GetUserCommentsRoleOutput", {
            value: getRoleArnNameOnly(getUserCommentsFunction),
        });
        new cdk.CfnOutput(this, "DeleteCommentsRoleOutput", {
            value: getRoleArnNameOnly(deleteCommentsFunction),
        });
        new cdk.CfnOutput(this, "GetUserAssignmentsRoleOutput", {
            value: getRoleArnNameOnly(getUserAssignmentsFunction),
        });
        new cdk.CfnOutput(this, "DeleteAssignmentsRoleOutput", {
            value: getRoleArnNameOnly(deleteAssignmentsFunction),
        });
        new cdk.CfnOutput(this, "CleanVehicleAssignmentsRoleOutput", {
            value: getRoleArnNameOnly(cleanVehicleAssignmentsFunction),
        });
        new cdk.CfnOutput(
            this,
            "CleanPossibleRiderResponsibilitiesRoleOutput",
            {
                value: getRoleArnNameOnly(
                    cleanPossibleRiderResponsibilitiesFunction
                ),
            }
        );
        new cdk.CfnOutput(this, "DeleteUserRoleOutput", {
            value: getRoleArnNameOnly(deleteUserFunction),
        });
    }
}
