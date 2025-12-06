import * as cdk from "aws-cdk-lib";
import * as logs from "aws-cdk-lib/aws-logs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { createLambdaStatement, getRoleArnNameOnly } from "./utils";
import { NagSuppressions } from "cdk-nag";

export interface UserTakeOutDataStepFunctionProps {
    region: string;
    appsyncId: string;
    bucketName: string;
    graphQLEndpoint: string;
    amplifyEnv: string;
}

export class UserTakeOutDataStepFunction extends Construct {
    private bucket: cdk.aws_s3.IBucket;
    private appsync: cdk.aws_appsync.IGraphqlApi;
    private amplifyEnv: string;
    private graphQLEndpoint: string;

    constructor(
        scope: Construct,
        id: string,
        props: UserTakeOutDataStepFunctionProps
    ) {
        super(scope, id);

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
            props.region
        );

        const takeOutBucket = new s3.Bucket(this, "TakeOutBucket", {
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: s3.BucketEncryption.S3_MANAGED,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            enforceSSL: true,
            serverAccessLogsPrefix: "takeOutBucketLog",
            lifecycleRules: [{ expiration: cdk.Duration.days(1) }],
        });

        const getUserCommentsFunction = new lambda.Function(
            this,
            "GetUserCommentsTakeOutFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/GetTakeOutUserComments/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                    TAKE_OUT_BUCKET: takeOutBucket.bucketName,
                },
                role: new iam.Role(this, "GetUserCommentsTakeOutFunctionRole", {
                    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
                }),
            }
        );

        createLambdaStatement(getUserCommentsFunction, this.appsync.arn, {
            queries: ["getUser"],
        });

        const getUserAssignmentsFunction = new lambda.Function(
            this,
            "GetUserAssignmentsTakeOutFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/GetTakeOutUserAssignments/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                    TAKE_OUT_BUCKET: takeOutBucket.bucketName,
                },
                role: new iam.Role(
                    this,
                    "GetUserAssignmentsTakeOutFunctionRole",
                    {
                        assumedBy: new iam.ServicePrincipal(
                            "lambda.amazonaws.com"
                        ),
                    }
                ),
            }
        );

        createLambdaStatement(getUserAssignmentsFunction, this.appsync.arn, {
            queries: ["getUser"],
        });

        const getUserVehicleAssignmentsFunction = new lambda.Function(
            this,
            "GetUserVehicleAssignmentsTakeOutFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/GetTakeOutVehicleAssignments/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                    TAKE_OUT_BUCKET: takeOutBucket.bucketName,
                },
                role: new iam.Role(
                    this,
                    "GetUserVehicleAssignmentsTakeOutFunctionRole",
                    {
                        assumedBy: new iam.ServicePrincipal(
                            "lambda.amazonaws.com"
                        ),
                    }
                ),
            }
        );

        createLambdaStatement(
            getUserVehicleAssignmentsFunction,
            this.appsync.arn,
            {
                queries: ["getUser"],
            }
        );

        const getUserPossibleRiderResponsibilitiesFunction =
            new lambda.Function(
                this,
                "GetUserPossibleRiderResponsibilitiesTakeOutFunction",
                {
                    runtime: lambda.Runtime.NODEJS_22_X,
                    handler: "index.handler",
                    code: lambda.Code.fromAsset(
                        "./lib/lambda/node/GetTakeOutPossibleRiderResponsibilities/dist"
                    ),
                    timeout: cdk.Duration.seconds(180),
                    environment: {
                        REGION: props.region,
                        GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                        TAKE_OUT_BUCKET: takeOutBucket.bucketName,
                    },
                    role: new iam.Role(
                        this,
                        "GetUserPossibleRiderResponsibilitiesTakeOutFunctionRole",
                        {
                            assumedBy: new iam.ServicePrincipal(
                                "lambda.amazonaws.com"
                            ),
                        }
                    ),
                }
            );

        createLambdaStatement(
            getUserPossibleRiderResponsibilitiesFunction,
            this.appsync.arn,
            {
                queries: ["getUser"],
            }
        );

        const finishAndSendUserDataFunction = new lambda.Function(
            this,
            "FinishAndSendUserTakeOutDataFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/SendTakeOutData/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                    TAKE_OUT_BUCKET: takeOutBucket.bucketName,
                },
                role: new iam.Role(
                    this,
                    "FinishAndSendUserTakeOutDataFunctionRole",
                    {
                        assumedBy: new iam.ServicePrincipal(
                            "lambda.amazonaws.com"
                        ),
                    }
                ),
            }
        );

        createLambdaStatement(finishAndSendUserDataFunction, this.appsync.arn, {
            queries: ["getUser"],
        });

        finishAndSendUserDataFunction.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ["s3:GetObject"],
                resources: [`${this.bucket.bucketArn}/public/*`],
            })
        );
        finishAndSendUserDataFunction.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ["s3:ListBucket"],
                resources: [`${this.bucket.bucketArn}`],
            })
        );
        getUserPossibleRiderResponsibilitiesFunction.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ["s3:PutObject"],
                resources: [`${takeOutBucket.bucketArn}/*`],
            })
        );

        getUserCommentsFunction.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ["s3:PutObject"],
                resources: [`${takeOutBucket.bucketArn}/*`],
            })
        );
        getUserAssignmentsFunction.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ["s3:PutObject"],
                resources: [`${takeOutBucket.bucketArn}/*`],
            })
        );
        getUserVehicleAssignmentsFunction.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ["s3:PutObject"],
                resources: [`${takeOutBucket.bucketArn}/*`],
            })
        );

        finishAndSendUserDataFunction.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ["s3:PutObject"],
                resources: [`${takeOutBucket.bucketArn}/*`],
            })
        );

        if (finishAndSendUserDataFunction.role) {
            NagSuppressions.addResourceSuppressions(
                finishAndSendUserDataFunction.role,
                [
                    {
                        id: "AwsSolutions-IAM5",
                        reason: "Wildcard is required in S3 policy so any profile picture can be queried",
                    },
                ],
                true
            );
        }

        const retryConfig = {
            errors: ["AppsyncFailure"],
            maxAttempts: 3,
            interval: cdk.Duration.seconds(10),
            backoffRate: 2,
        };

        const getUserCommentsTask = new tasks.LambdaInvoke(
            this,
            "GetUserCommentsTakeOutTask",
            {
                lambdaFunction: getUserCommentsFunction,
                outputPath: "$.Payload",
            }
        );

        const getUserVehicleAssignmentsTask = new tasks.LambdaInvoke(
            this,
            "GetUserVehicleAssignmentsTakeOutTask",
            {
                lambdaFunction: getUserVehicleAssignmentsFunction,
                outputPath: "$.Payload",
            }
        );

        const getUserPossibleRiderResponsibilitiesTask = new tasks.LambdaInvoke(
            this,
            "GetUserPossibleRiderResponsibilitiesTakeOutTask",
            {
                lambdaFunction: getUserPossibleRiderResponsibilitiesFunction,
                outputPath: "$.Payload",
            }
        );
        const getUserAssignmentsTask = new tasks.LambdaInvoke(
            this,
            "GetUserAssignmentsTakeOutTask",
            {
                lambdaFunction: getUserAssignmentsFunction,
                outputPath: "$.Payload",
            }
        );

        const finishAndSendUserDataTask = new tasks.LambdaInvoke(
            this,
            "FinishAndSendUserDataTakeOutTask",
            {
                lambdaFunction: finishAndSendUserDataFunction,
                outputPath: "$.Payload",
            }
        );

        getUserCommentsTask.addRetry(retryConfig);
        getUserAssignmentsTask.addRetry(retryConfig);
        getUserVehicleAssignmentsTask.addRetry(retryConfig);
        getUserPossibleRiderResponsibilitiesTask.addRetry(retryConfig);
        finishAndSendUserDataTask.addRetry(retryConfig);

        const successState = new sfn.Succeed(this, "Takeout completed");

        const mainChain = sfn.Chain.start(getUserCommentsTask)
            .next(getUserVehicleAssignmentsTask)
            .next(getUserPossibleRiderResponsibilitiesTask)
            .next(getUserAssignmentsTask)
            .next(finishAndSendUserDataTask)
            .next(successState);

        const definition = sfn.Chain.start(mainChain);

        const userTakeOutDataStateMachine = new sfn.StateMachine(
            this,
            `UserTakeOutDataStateMachine`,
            {
                definition: definition,
                logs: {
                    destination: new logs.LogGroup(
                        this,
                        "TakeOutDataSFLogGroup",
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
            userTakeOutDataStateMachine.role,
            [
                {
                    id: "AwsSolutions-IAM5",
                    reason: "The Step Function Role must be allowed to invoke Lambda functions. The wildcard is automatically added by the tasks.LambdaInvoke construct and is scoped to the function ARN for invocation.",
                },
            ],
            true
        );

        // save the state machine name to SSM to be accessed by plateletUserTakeOutData lambda
        const userTakeOutDataMachineArnSSMParam = new ssm.StringParameter(
            this,
            "UserTakeOutDataMachineArnSSMParam",
            {
                parameterName: `/platelet-supporting-cdk/${this.amplifyEnv}/UserTakeOutDataStateMachineArn`,
                stringValue: userTakeOutDataStateMachine.stateMachineArn,
            }
        );

        // output role names needed for custom-roles.json
        new cdk.CfnOutput(
            this,
            "AdminRoleNamesGetUserCommentsTakeOutRoleOutput",
            {
                value: getRoleArnNameOnly(getUserCommentsFunction),
            }
        );
        new cdk.CfnOutput(
            this,
            "AdminRoleNamesGetUserPossibleRiderResponsibilitiesTakeOutRoleOutput",
            {
                value: getRoleArnNameOnly(
                    getUserPossibleRiderResponsibilitiesFunction
                ),
            }
        );
        new cdk.CfnOutput(
            this,
            "AdminRoleNamesGetUserAssignmentsTakeOutRoleOutput",
            {
                value: getRoleArnNameOnly(getUserAssignmentsFunction),
            }
        );
        new cdk.CfnOutput(
            this,
            "AdminRoleNamesGetUserVehicleAssignmentsTakeOutRoleOutput",
            {
                value: getRoleArnNameOnly(getUserVehicleAssignmentsFunction),
            }
        );
        new cdk.CfnOutput(
            this,
            "AdminRoleNamesFinishAndSendUserTakeOutDataFunctionRole",
            {
                value: getRoleArnNameOnly(finishAndSendUserDataFunction),
            }
        );

        new cdk.CfnOutput(this, "TakeOutUserDataStateMachineArnOutput", {
            value: userTakeOutDataStateMachine.stateMachineArn,
        });
        new cdk.CfnOutput(
            this,
            "TakeOutUserDataStateMachineArnSSMParamArnOutput",
            {
                value: userTakeOutDataMachineArnSSMParam.parameterArn,
            }
        );
    }
}
