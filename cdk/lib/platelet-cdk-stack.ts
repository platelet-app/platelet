import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { DeleteUserStepFunction } from "./delete-user-step-function-construct";
import { RetryFunctionConstruct } from "./retry-function-construct";
import { UserTakeOutDataStepFunction } from "./user-take-out-data-step-function-construct";

export class PlateletCdkStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);
        const appsyncId = this.node.tryGetContext("appsyncId");
        const userPoolId = this.node.tryGetContext("userPoolId");
        const graphQLEndpoint = this.node.tryGetContext("graphQLEndpoint");
        const bucketName = this.node.tryGetContext("bucketName");
        const amplifyEnv = this.node.tryGetContext("amplifyEnv");

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
        });

        new UserTakeOutDataStepFunction(this, "UserTakeOutDataStepFunction", {
            appsyncId,
            graphQLEndpoint,
            bucketName,
            region: this.region,
            amplifyEnv,
        });
    }
}
