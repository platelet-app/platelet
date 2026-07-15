import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as ssm from "aws-cdk-lib/aws-ssm";

export interface SSMParamsConstructProps {
    amplifyEnv: string;
    fromEmail: string;
    domainName: string;
}

export class SSMParamsConstruct extends Construct {
    public fromEmailArn: string;
    constructor(scope: Construct, id: string, props: SSMParamsConstructProps) {
        super(scope, id);

        const fromEmail = new ssm.StringParameter(this, "FromEmailSSMParam", {
            parameterName: `/platelet-supporting-cdk/${props.amplifyEnv}/FromEmail`,
            stringValue: props.fromEmail,
        });
        const domainName = new ssm.StringParameter(this, "DomainNameSSMParam", {
            parameterName: `/platelet-supporting-cdk/${props.amplifyEnv}/domainName`,
            stringValue: props.domainName,
        });

        this.fromEmailArn = fromEmail.parameterArn;

        // output values to be used in custom-policies.json files
        new cdk.CfnOutput(this, "FromEmailSSMParamArnOutput", {
            value: this.fromEmailArn,
        });
        new cdk.CfnOutput(this, "DomainNameSSMParamArnOutput", {
            value: domainName.parameterArn,
        });
    }
}
