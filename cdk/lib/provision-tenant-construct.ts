import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { createLambdaStatement, getRoleArnNameOnly } from "./utils";

export interface ProvisionTenantProps {
    userPoolId: string;
    region: string;
    appsyncId: string;
    graphQLEndpoint: string;
    amplifyEnv: string;
    fromEmailParameterArn: string;
    domainNameParameterArn: string;
    sesIdentity: cdk.aws_ses.IEmailIdentity;
}

// Provisions the first tenant and its primary admin user on brand new
// deployments. The function is invoked by the provision_tenant.yml workflow
// after a deploy completes, because its role is only authorized for the
// AppSync API once custom-roles.json has been applied by the Amplify rebuild
// that follows cdk deploy. The function is idempotent and does nothing when a
// tenant already exists.
export class ProvisionTenantConstruct extends Construct {
    public provisionTenantFunction: lambda.Function;

    constructor(scope: Construct, id: string, props: ProvisionTenantProps) {
        super(scope, id);

        const userPool = cognito.UserPool.fromUserPoolId(
            this,
            "AmplifyUserPool",
            props.userPoolId
        );
        const appsyncApi = appsync.GraphqlApi.fromGraphqlApiAttributes(
            this,
            "ExistingAppsync",
            { graphqlApiId: props.appsyncId }
        );

        this.provisionTenantFunction = new lambda.Function(
            this,
            "ProvisionTenantFunction",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/ProvisionTenant/dist"
                ),
                timeout: cdk.Duration.seconds(180),
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: props.graphQLEndpoint,
                    USER_POOL_ID: props.userPoolId,
                    ENV: props.amplifyEnv,
                },
                role: new iam.Role(this, "ProvisionTenantFunctionRole", {
                    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
                }),
            }
        );

        createLambdaStatement(this.provisionTenantFunction, appsyncApi.arn, {
            queries: ["listTenants", "getUser", "getTenant"],
            mutations: [
                "createTenant",
                "createUser",
                "updateUser",
                "deleteUser",
                "deleteTenant",
            ],
        });

        this.provisionTenantFunction.addToRolePolicy(
            new iam.PolicyStatement({
                actions: [
                    "cognito-idp:AdminCreateUser",
                    "cognito-idp:AdminSetUserPassword",
                    "cognito-idp:AdminAddUserToGroup",
                    "cognito-idp:AdminDeleteUser",
                ],
                resources: [userPool.userPoolArn],
            })
        );
        this.provisionTenantFunction.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ["ssm:GetParameter"],
                resources: [
                    props.fromEmailParameterArn,
                    props.domainNameParameterArn,
                ],
            })
        );
        this.provisionTenantFunction.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ["ses:SendEmail"],
                resources: [props.sesIdentity.emailIdentityArn],
            })
        );

        // output the role name for custom-roles.json
        new cdk.CfnOutput(this, "AdminRoleNamesProvisionTenantRoleOutput", {
            value: getRoleArnNameOnly(this.provisionTenantFunction),
        });
        // output the function name so the provisioning workflow can invoke it
        new cdk.CfnOutput(this, "ProvisionTenantFunctionNameOutput", {
            value: this.provisionTenantFunction.functionName,
        });
    }
}
