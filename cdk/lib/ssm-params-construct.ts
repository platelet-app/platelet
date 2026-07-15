import { Construct } from "constructs";
import * as ssm from "aws-cdk-lib/aws-ssm";

export interface SSMParamsConstructProps {
    amplifyEnv: string;
    fromEmail: string;
    domainName: string;
}

export class SSMParamsConstruct extends Construct {
    constructor(scope: Construct, id: string, props: SSMParamsConstructProps) {
        super(scope, id);
        new ssm.StringParameter(this, "FromEmailSSMParam", {
            parameterName: `/platelet-supporting-cdk/${props.amplifyEnv}/FromEmail`,
            stringValue: props.fromEmail,
        });
        new ssm.StringParameter(this, "DomainNameSSMParam", {
            parameterName: `/platelet-supporting-cdk/${props.amplifyEnv}/domainName`,
            stringValue: props.domainName,
        });
    }
}
