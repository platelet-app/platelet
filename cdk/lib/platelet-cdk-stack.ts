import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { DeleteUserStepFunction } from "./delete-user-step-function-construct";
import { RetryFunctionConstruct } from "./retry-function-construct";
import { UserTakeOutDataStepFunction } from "./user-take-out-data-step-function-construct";
import { CypressTestRole } from "./cypress-test-role-construct";

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

        const retryConstructInstance = new RetryFunctionConstruct(
            this,
            "RetryFunction"
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
        });

        if (this.node.tryGetContext("createCypressTestingRole") === "true") {
            new CypressTestRole(this, "CypressTestRole", {
                appsyncId,
                userPoolArn,
            });
        }
    }
}
