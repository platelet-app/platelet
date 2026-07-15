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

        const fromEmailParam = new ssm.StringParameter(
            this,
            "FromEmailSSMParam",
            {
                parameterName: `/platelet-supporting-cdk/${props.amplifyEnv}/FromEmail`,
                stringValue: props.fromEmail,
            }
        );
        const domainNameParam = new ssm.StringParameter(
            this,
            "DomainNameSSMParam",
            {
                parameterName: `/platelet-supporting-cdk/${props.amplifyEnv}/DomainName`,
                stringValue: props.domainName,
            }
        );

        this.fromEmailArn = fromEmailParam.parameterArn;

        // output values to be used in custom-policies.json files
        new cdk.CfnOutput(this, "FromEmailSSMParamArnOutput", {
            value: this.fromEmailArn,
        });
        new cdk.CfnOutput(this, "DomainNameSSMParamArnOutput", {
            value: domainNameParam.parameterArn,
        });
        new cdk.CfnOutput(this, "FromEmailValueOutput", {
            value: props.fromEmail,
        });
    }
}
