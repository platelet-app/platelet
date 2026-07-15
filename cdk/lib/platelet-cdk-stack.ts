import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { DeleteUserStepFunction } from "./delete-user-step-function-construct";
import { RetryFunctionConstruct } from "./retry-function-construct";
import { UserTakeOutDataStepFunction } from "./user-take-out-data-step-function-construct";
import { CypressTestRole } from "./cypress-test-role-construct";
import { TenantNameWebsiteConstruct } from "./tenant-name-website-construct";
import { SSMParamsConstruct } from "./ssm-params-construct";

export class PlateletCdkStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);
        const appsyncId = this.node.tryGetContext("appsyncId");
        const userPoolId = this.node.tryGetContext("userPoolId");
        const userPoolArn = this.node.tryGetContext("userPoolArn");
        const graphQLEndpoint = this.node.tryGetContext("graphQLEndpoint");
        const bucketName = this.node.tryGetContext("bucketName");
        const amplifyEnv = this.node.tryGetContext("amplifyEnv");
        const alertEmail = this.node.tryGetContext("alertEmail");
        const tenantWebsite = this.node.tryGetContext("tenantWebsite");
        const tenantName = this.node.tryGetContext("tenantName");
        const fromEmail = this.node.tryGetContext("fromEmail");
        const domainName = this.node.tryGetContext("domainName");

        const retryConstructInstance = new RetryFunctionConstruct(
            this,
            "RetryFunction"
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

        new UserTakeOutDataStepFunction(this, "UserTakeOutDataStepFunction", {
            appsyncId,
            graphQLEndpoint,
            bucketName,
            region: this.region,
            amplifyEnv,
            alertEmail,
            fromEmailParameterArn: SSMParamsConstructInstance.fromEmailArn,
        });

        new TenantNameWebsiteConstruct(this, "TenantNameWebsite", {
            region: this.region,
            tenantName,
            tenantWebsite,
            amplifyEnv,
            account: this.account,
        });

        new SSMParamsConstruct(this, "SSMParams", {
            amplifyEnv,
            fromEmail,
            domainName,
        });

        if (this.node.tryGetContext("createCypressTestingRole") === "true") {
            new CypressTestRole(this, "CypressTestRole", {
                appsyncId,
                userPoolArn,
            });
        }
    }
}
