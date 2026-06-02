import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as ssm from "aws-cdk-lib/aws-ssm";

export interface TenantNameWebsiteConstructProps {
    region: string;
    amplifyEnv: string;
    tenantName: string;
    tenantWebsite: string;
    account: string;
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

        const queueSSM = ssm.StringParameter.fromStringParameterName(
            this,
            "SQSTrackingQueueSSMParam",
            "/platelet-platform-cdk/TrackingQueueURL"
        );

        new cdk.CfnOutput(this, "TenantNameSSMParamARNOutput", {
            value: tenantNameSSMParam.parameterArn,
        });
        new cdk.CfnOutput(this, "TenantWebsiteSSMParamARNOutput", {
            value: tenantWebsiteSSMParam.parameterArn,
        });
        new cdk.CfnOutput(this, "SQSQueueURLSSMParamARNOutput", {
            value: queueSSM.parameterArn,
        });

        // we can't get the SQS itself from the name only
        // put together the ARN with account and region
        new cdk.CfnOutput(this, "TrackingSQSARNOutput", {
            value: `arn:aws:sqs:${props.region}:${props.account}:platelet-tracking-queue`,
        });
    }
}
