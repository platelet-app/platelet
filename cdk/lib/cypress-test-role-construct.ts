import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { Construct } from "constructs";

export interface CypressTestRoleProps {
    appsyncId: string;
}

/**
 * IAM role assumed by Cypress E2E tests when they need to call AppSync with
 * IAM auth. Cognito-authenticated users cannot write isBeingDeleted on the
 * User type (the schema has no IAM write rule for it); only IAM callers added
 * to custom-roles.json can. This role grants exactly that one mutation.
 *
 * The CfnOutput key starts with "AdminRoleNames" so project tooling
 * automatically adds the role to custom-roles.json on each CDK deploy.
 */
export class CypressTestRole extends Construct {
    private readonly role: iam.Role;

    constructor(scope: Construct, id: string, props: CypressTestRoleProps) {
        super(scope, id);

        const api = appsync.GraphqlApi.fromGraphqlApiAttributes(
            this,
            "AppSyncApi",
            { graphqlApiId: props.appsyncId }
        );

        this.role = new iam.Role(this, "Role", {
            description:
                "Assumed by Cypress E2E tests to set isBeingDeleted on User records via AppSync IAM auth.",
            assumedBy: new iam.AccountPrincipal(cdk.Stack.of(this).account),
        });

        // Scoped to the single AppSync mutation the tests require.
        this.role.addToPolicy(
            new iam.PolicyStatement({
                actions: ["appsync:GraphQL"],
                resources: [`${api.arn}/types/Mutation/fields/updateUser`],
            })
        );

        const cfnRole = this.role.node.defaultChild as iam.CfnRole;
        new cdk.CfnOutput(this, "AdminRoleNamesCypressTestRoleOutput", {
            value: cfnRole.attrArn,
            description: "Cypress test role ARN.",
        });
    }
}
