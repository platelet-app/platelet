import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as ssm from "aws-cdk-lib/aws-ssm";

export interface TenantNameWebsiteConstructProps {
    region: string;
    amplifyEnv: string;
    tenantName: string;
    tenantWebsite: string;
}

export class TenantNameWebsiteConstruct extends Construct {
    constructor(
        scope: Construct,
        id: string,
        props: TenantNameWebsiteConstructProps
    ) {
        super(scope, id);

        const tenantNameSSMParam = new ssm.StringParameter(
            this,
            "TenantNameSSM",
            {
                parameterName: `/platelet-supporting-cdk/${props.amplifyEnv}/TenantName`,
                stringValue: props.tenantName,
            }
        );
        const tenantWebsiteSSMParam = new ssm.StringParameter(
            this,
            "TenantWebsiteSSM",
            {
                parameterName: `/platelet-supporting-cdk/${props.amplifyEnv}/TenantWebsite`,
                stringValue: props.tenantWebsite,
            }
        );

        new cdk.CfnOutput(this, "TenantNameSSMParamNameOutput", {
            value: tenantNameSSMParam.parameterName,
        });
        new cdk.CfnOutput(this, "TenantWebsiteSSMParamNameOutput", {
            value: tenantWebsiteSSMParam.parameterName,
        });
    }
}
