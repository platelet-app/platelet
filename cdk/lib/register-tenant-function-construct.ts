import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { createLambdaStatement, getRoleArnNameOnly } from "./utils";

export interface RegisterTenantFunctionConstructProps {
    region: string;
    graphQLEndpoint: string;
    userPoolId: string;
    graphqlAppSync: cdk.aws_appsync.IGraphqlApi;
    userPoolArn: string;
}

export class RegisterTenantFunctionConstruct extends Construct {
    constructor(
        scope: Construct,
        id: string,
        props: RegisterTenantFunctionConstructProps
    ) {
        super(scope, id);

        const role = new iam.Role(this, "RegisterTenantFunctionRole", {
            assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        });

        const registerTenantFunction = new lambda.Function(
            this,
            "RegisterTenantFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/RegisterTenant/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: props.graphQLEndpoint,
                    USER_POOL_ID: props.userPoolId,
                },
                role,
            }
        );
        new cdk.CfnOutput(this, "AdminRoleNamesRegisterTenant", {
            value: getRoleArnNameOnly(registerTenantFunction),
        });
        createLambdaStatement(
            registerTenantFunction,
            props.graphqlAppSync.arn,
            {
                queries: ["getTenant"],
                mutations: [
                    "createUser",
                    "updateUser",
                    "createTenant",
                    "deleteTenant",
                ],
            }
        );
        role.addToPolicy(
            new iam.PolicyStatement({
                actions: [
                    "cognito-idp:AdminCreateUser",
                    "cognito-idp:AdminDeleteUser",
                    "cognito-idp:AdminAddUserToGroup",
                    "cognito-idp:AdminUpdateUserAttributes",
                ],
                resources: [props.userPoolArn],
            })
        );
    }
}
