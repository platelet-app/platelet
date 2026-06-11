import { Construct } from "constructs";
import { Distribution, OriginAccessIdentity } from "@aws-cdk/aws-cloudfront";
import { S3Origin } from "@aws-cdk/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { RemovalPolicy } from "aws-cdk-lib";

export interface HostingConstructProps {
    region: string;
}

export class HostingConstruct extends Construct {
    constructor(scope: Construct, id: string, props: HostingConstructProps) {
        super(scope, id);
        const landingBucket = new s3.Bucket(this, "PlateletLandingPage", {
            accessControl: s3.BucketAccessControl.PRIVATE,
            removalPolicy: RemovalPolicy.DESTROY,
        });
        new BucketDeployment(this, "BucketDeployment", {
            destinationBucket: landingBucket,
            sources: [Source.asset("./lib/hosting/landing-page/build")],
        });

        const originAccessIdentity = new OriginAccessIdentity(
            this,
            "LandingOriginAccessIdentity"
        );
        landingBucket.grantRead(originAccessIdentity);

        new Distribution(this, "Platelet.AppDistribution", {
            defaultRootObject: "index.html",
            defaultBehavior: {
                origin: new S3Origin(landingBucket, { originAccessIdentity }),
            },
        });
    }
}
