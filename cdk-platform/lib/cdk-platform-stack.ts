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
                region: this.region,
            }
        );
        const sqs = new TrackingSQSConstruct(this, "TrackingSQS", {
            region: this.region,
            account: this.account,
            ddbTable: trackingAppSync.trackingTable,
            alertsEmail,
        });
    }
}
