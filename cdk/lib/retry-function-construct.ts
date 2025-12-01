import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";

export class RetryFunctionConstruct extends Construct {
    public retryFunction: lambda.Function;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        const RETRY_LIMIT = 3;

        this.retryFunction = new lambda.Function(
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
    }
}
