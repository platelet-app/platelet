import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as ses from "aws-cdk-lib/aws-ses";
import { Construct } from "constructs";
import { DeleteUserStepFunction } from "./delete-user-step-function-construct";
import { RetryFunctionConstruct } from "./retry-function-construct";
import { UserTakeOutDataStepFunction } from "./user-take-out-data-step-function-construct";
import { CypressTestRole } from "./cypress-test-role-construct";
import { SSMParamsConstruct } from "./ssm-params-construct";
import { ProvisionTenantConstruct } from "./provision-tenant-construct";

export class PlateletCdkStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);
        const appsyncId = this.node.tryGetContext("appsyncId");
        const userPoolId = this.node.tryGetContext("userPoolId");
        const graphQLEndpoint = this.node.tryGetContext("graphQLEndpoint");
        const bucketName = this.node.tryGetContext("bucketName");
        const amplifyEnv = this.node.tryGetContext("amplifyEnv");
        const alertEmail = this.node.tryGetContext("alertEmail");
        const fromEmail = this.node.tryGetContext("fromEmail");
        const domainName = this.node.tryGetContext("domainName");

        if (typeof fromEmail !== "string" || fromEmail.trim() === "") {
            throw new Error('Missing required CDK context: "fromEmail"');
        }
        if (typeof domainName !== "string" || domainName.trim() === "") {
            throw new Error('Missing required CDK context: "domainName"');
        }
        const retryConstructInstance = new RetryFunctionConstruct(
            this,
            "RetryFunction"
        );

        // get the SES identity from the fromEmail
        const domainSplit = fromEmail.split("@")[1];
        const SES = ses.EmailIdentity.fromEmailIdentityName(
            this,
            "SESEmailIdentity",
            domainSplit
        );

        const userPool = cognito.UserPool.fromUserPoolId(
            this,
            "AmplifyUserPool",
            userPoolId
        );

        const SSMParamsConstructInstance = new SSMParamsConstruct(
            this,
            "SSMParams",
            {
                amplifyEnv,
                fromEmail,
                domainName,
            }
        );

        new DeleteUserStepFunction(this, "DeleteUserStepFunction", {
            appsyncId,
            userPoolId,
            graphQLEndpoint,
            bucketName,
            region: this.region,
            amplifyEnv,
            retryFunction: retryConstructInstance.retryFunction,
            alertEmail,
        });

        new ProvisionTenantConstruct(this, "ProvisionTenant", {
            appsyncId,
            userPoolId,
            graphQLEndpoint,
            region: this.region,
            amplifyEnv,
            fromEmailParameterArn: SSMParamsConstructInstance.fromEmailArn,
            domainNameParameterArn: SSMParamsConstructInstance.domainNameArn,
            sesIdentity: SES,
        });

        new UserTakeOutDataStepFunction(this, "UserTakeOutDataStepFunction", {
            appsyncId,
            graphQLEndpoint,
            bucketName,
            region: this.region,
            amplifyEnv,
            alertEmail,
            fromEmailParameterArn: SSMParamsConstructInstance.fromEmailArn,
            sesIdentity: SES,
        });

        if (this.node.tryGetContext("createCypressTestingRole") === "true") {
            new CypressTestRole(this, "CypressTestRole", {
                appsyncId,
                userPoolArn: userPool.userPoolArn,
            });
        }

        // output the SES identity ARN
        // this is needed for custom-policies.json in lambda functions
        new cdk.CfnOutput(this, "SESEmailIdentityArn", {
            value: SES.emailIdentityArn,
        });
    }
}
