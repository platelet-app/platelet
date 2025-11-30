import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { NagSuppressions } from "cdk-nag";

export const createLambdaStatement = (
    lambdaFunction: cdk.aws_lambda.IFunction,
    appsyncArn: string,
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
            (query) => `${appsyncArn}/types/Query/fields/${query}`
        );

        const mutationResources = appsyncFields.mutations?.map(
            (mutation) => `${appsyncArn}/types/Mutation/fields/${mutation}`
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
