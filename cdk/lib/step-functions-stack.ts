import * as cdk from "aws-cdk-lib";
import * as logs from "aws-cdk-lib/aws-logs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { NagSuppressions } from "cdk-nag";

const getRoleArnNameOnly = (functionObject: lambda.Function) => {
    const lambdaRole = functionObject.role;
    const cfnRole = lambdaRole?.node.defaultChild as iam.CfnRole;
    return cfnRole.attrArn;
};

export class StepFunctionsStack extends cdk.Stack {
    private appsyncId: string;
    private userPoolId: string;
    private bucketName: string;
    private graphQLEndpoint: string;

    private createLambdaRole = (
        name: string,
        functionName: string,
        appsyncFields?: { queries?: string[]; mutations?: string[] }
    ) => {
        const deployEnv = process.env.DEPLOY_ENV || "dev";
        const role = new iam.Role(this, name, {
            assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
            roleName: `${name}-role-${deployEnv}`,
        });
        const logGroupCreationPolicy = new iam.PolicyStatement({
            actions: ["logs:CreateLogGroup"],
            resources: [
                `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/lambda/${functionName}:*`,
            ],
        });
        role.addToPolicy(logGroupCreationPolicy);

        const logStreamAndEventsPolicy = new iam.PolicyStatement({
            actions: ["logs:CreateLogStream", "logs:PutLogEvents"],
            resources: [
                `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/lambda/${functionName}`,
            ],
        });
        role.addToPolicy(logStreamAndEventsPolicy);

        if (appsyncFields?.mutations || appsyncFields?.queries) {
            const queryResources = appsyncFields.queries?.map(
                (query) =>
                    `arn:aws:appsync:${this.region}:${this.account}:apis/${this.appsyncId}/types/Query/field/${query}`
            );

            const mutationResources = appsyncFields.mutations?.map(
                (query) =>
                    `arn:aws:appsync:${this.region}:${this.account}:apis/${this.appsyncId}/types/Mutation/field/${query}`
            );
            const appsyncResources = [
                ...(queryResources || []),
                ...(mutationResources || []),
            ];

            if (appsyncResources.length === 0) {
                throw new Error("No appsync resources found");
            }

            const appsyncPolicy = new iam.PolicyStatement({
                actions: ["appsync:GraphQL"],
                resources: appsyncResources,
            });
            role.addToPolicy(appsyncPolicy);
        }
        NagSuppressions.addResourceSuppressions(
            role,
            [
                {
                    id: "AwsSolutions-IAM5",
                    reason: 'Wildcard is required for the "logs:CreateLogGroup" action to allow the Lambda service to create its log group upon first invocation. The wildcard is scoped to the specific function log group ARN.',
                },
            ],
            true
        );
        return role;
    };

    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        const deployEnv = process.env.DEPLOY_ENV || "dev";

        this.appsyncId = this.node.tryGetContext("appsyncId");
        this.userPoolId = this.node.tryGetContext("userPoolId");
        this.graphQLEndpoint = this.node.tryGetContext("graphQLEndpoint");
        this.bucketName = this.node.tryGetContext("bucketName");

        console.log(
            "Got context",
            this.appsyncId,
            this.userPoolId,
            this.graphQLEndpoint,
            this.bucketName
        );

        if (
            !this.appsyncId ||
            !this.userPoolId ||
            !this.graphQLEndpoint ||
            !this.bucketName
        ) {
            throw new Error("You must pass in all the context values");
        }

        const getUserCommentsFunctionName = `platelet-sfn-get-user-comments-${deployEnv}`;

        const getUserCommentsFunction = new lambda.Function(
            this,
            "GetUserCommentsFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                functionName: getUserCommentsFunctionName,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/GetUserComments/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                memorySize: 1024,
                environment: {
                    REGION: this.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: this.createLambdaRole(
                    "GetUserCommentsRole",
                    getUserCommentsFunctionName,
                    { queries: ["getUser"] }
                ),
            }
        );

        const getUserAssignmentsFunctionName = `platelet-sfn-get-user-assignments-${deployEnv}`;

        const getUserAssignmentsFunction = new lambda.Function(
            this,
            "GetUserAssignmentsFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                functionName: getUserAssignmentsFunctionName,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/GetUserAssignments/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                memorySize: 1024,
                environment: {
                    REGION: this.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: this.createLambdaRole(
                    "GetUserAssignmentsRole",
                    getUserAssignmentsFunctionName,
                    { queries: ["getUser"] }
                ),
            }
        );

        const deleteCommentsFunctionName = `platelet-sfn-delete-comments-${deployEnv}`;

        const deleteCommentsFunction = new lambda.Function(
            this,
            "DeleteCommentsFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                functionName: deleteCommentsFunctionName,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/DeleteComments/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                memorySize: 1024,
                environment: {
                    REGION: this.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: this.createLambdaRole(
                    "DeleteCommentsRole",
                    deleteCommentsFunctionName,
                    { mutations: ["deleteComment"] }
                ),
            }
        );
        const deleteAssignmentsFunctionName = `platelet-sfn-delete-assignments-${deployEnv}`;

        const deleteAssignmentsFunction = new lambda.Function(
            this,
            "DeleteAssignmentsFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                functionName: deleteAssignmentsFunctionName,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/DeleteAssignments/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                memorySize: 1024,
                environment: {
                    REGION: this.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: this.createLambdaRole(
                    "DeleteAssignmentsRole",
                    deleteAssignmentsFunctionName,
                    { mutations: ["deleteTaskAssignee"] }
                ),
            }
        );

        const cleanVehicleAssignmentsFunctionName = `platelet-sfn-clean-vehicle-assignments-${deployEnv}`;

        const cleanVehicleAssignmentsFunction = new lambda.Function(
            this,
            "CleanVehicleAssignmentsFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                functionName: cleanVehicleAssignmentsFunctionName,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/CleanVehicleAssignments/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                memorySize: 1024,
                environment: {
                    REGION: this.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: this.createLambdaRole(
                    "CleanVehicleAssignmentsRole",
                    cleanVehicleAssignmentsFunctionName,
                    {
                        queries: ["getUser"],
                        mutations: ["deleteVehicleAssignment"],
                    }
                ),
            }
        );

        const cleanPossibleRiderResponsibilitiesFunctionName = `platelet-sfn-clean-possible-rider-responsibilities-${deployEnv}`;

        const cleanPossibleRiderResponsibilitiesFunction = new lambda.Function(
            this,
            "CleanPossibleRiderResponsibilitiesFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                functionName: cleanPossibleRiderResponsibilitiesFunctionName,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/CleanPossibleRiderResponsibilities/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                memorySize: 1024,
                environment: {
                    REGION: this.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                },
                role: this.createLambdaRole(
                    "CleanPossibleRiderResponsibilitiesRole",
                    cleanPossibleRiderResponsibilitiesFunctionName,
                    {
                        queries: ["getUser"],
                        mutations: ["deletePossibleRiderResponsibilities"],
                    }
                ),
            }
        );

        const deleteUserFunctionName = `platelet-sfn-delete-user-${deployEnv}`;

        const deleteUserFunctionRole = this.createLambdaRole(
            "DeleteUserRole",
            deleteUserFunctionName,
            {
                queries: ["getUser"],
                mutations: ["deleteUser"],
            }
        );
        deleteUserFunctionRole.attachInlinePolicy(
            new iam.Policy(this, "DeleteUserCognitoPolicy", {
                statements: [
                    new iam.PolicyStatement({
                        actions: [
                            "cognito-idp:AdminDeleteUser",
                            "cognito-idp:AdminDisableUser",
                            "cognito-idp:AdminGetUser",
                        ],
                        resources: [
                            `arn:aws:cognito-idp:${this.region}:${this.account}:userpool/${this.userPoolId}`,
                        ],
                    }),
                ],
            })
        );

        const deleteUserS3Policy = new iam.Policy(this, "DeleteUserS3Policy", {
            statements: [
                new iam.PolicyStatement({
                    actions: ["s3:DeleteObject"],
                    resources: [`arn:aws:s3:::${this.bucketName}/public/*`],
                }),
            ],
        });

        NagSuppressions.addResourceSuppressions(
            deleteUserS3Policy,
            [
                {
                    id: "AwsSolutions-IAM5",
                    reason: "Wildcard is required in S3 policy so any profile picture can be deleted",
                },
            ],
            true
        );

        deleteUserFunctionRole.attachInlinePolicy(deleteUserS3Policy);

        const deleteUserFunction = new lambda.Function(
            this,
            "DeleteUserFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                functionName: deleteUserFunctionName,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/DeleteUser/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                memorySize: 1024,
                environment: {
                    REGION: this.region,
                    GRAPHQL_ENDPOINT: this.graphQLEndpoint,
                    USER_POOL_ID: this.userPoolId,
                },
                role: deleteUserFunctionRole,
            }
        );

        const RETRY_LIMIT = 3;

        const retryCheckFunctionName = `platelet-delete-user-stepfunction-retry-checker-${deployEnv}`;

        const retryCheckFunction = new lambda.Function(
            this,
            "DeleteUserStepFunctionRetryChecker",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                functionName: retryCheckFunctionName,
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
                role: this.createLambdaRole(
                    "DeleteUserStepFunctionRetryCheckerRole",
                    retryCheckFunctionName
                ),
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
            `DeleteUserStateMachine-${deployEnv}`,
            {
                definition: definition,
                logs: {
                    destination: new logs.LogGroup(
                        this,
                        "DeleteUserSFLogGroup",
                        {
                            logGroupName: `/aws/stepfunctions/delete-user-sfn-${deployEnv}`,
                            removalPolicy: cdk.RemovalPolicy.DESTROY, // Adjust as needed
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
            parameterName: `/platelet-supporting-cdk/${deployEnv}/DeleteUserStateMachineArn`,
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
