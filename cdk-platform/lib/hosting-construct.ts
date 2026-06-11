import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";

export interface HostingConstructProps {
    region: string;
}

export class HostingConstruct extends Construct {
    constructor(scope: Construct, id: string, props: HostingConstructProps) {
        super(scope, id);
        const landingBucket = new s3.Bucket(this, "PlateletLandingPage", {
            accessControl: s3.BucketAccessControl.PRIVATE,
        });
        new BucketDeployment(this, "BucketDeployment", {
            destinationBucket: landingBucket,
            sources: [Source.asset("./hosting/landing-page/build")],
        });
    }
}
