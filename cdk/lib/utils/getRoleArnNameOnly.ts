import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";

export const getRoleArnNameOnly = (functionObject: lambda.Function) => {
    const lambdaRole = functionObject.role;
    const cfnRole = lambdaRole?.node.defaultChild as iam.CfnRole;
    return cfnRole.attrArn;
};
