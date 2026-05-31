import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import { TrackingAppSyncConstruct } from "./tracking-appsync-construct";
import { TrackingSQSConstruct } from "./tracking-sqs-construct";

export class PlateletCdkPlatformStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const alertsEmail = this.node.tryGetContext("alertsEmail");
        const trackingAppSync = new TrackingAppSyncConstruct(
            this,
            "TrackingAppSync",
            {
                region: "eu-west-1",
            }
        );
        const sqs = new TrackingSQSConstruct(this, "TrackingSQS", {
            region: "eu-west-1",
            ddbTable: trackingAppSync.trackingTable,
            alertsEmail,
        });
    }
}
