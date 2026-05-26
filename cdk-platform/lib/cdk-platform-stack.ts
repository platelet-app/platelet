import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { TrackingAppSyncConstruct } from "./tracking-appsync-construct";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkPlatformStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const trackingAppSync = new TrackingAppSyncConstruct(
            this,
            "TrackingAppSync",
            {
                region: "eu-west-1",
            }
        );
    }
}
