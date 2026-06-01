import * as cdk from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface TrackingAppSyncConstructProps {
    region: string;
}

export class TrackingAppSyncConstruct extends Construct {
    public trackingTable: cdk.aws_dynamodb.Table;
    constructor(
        scope: Construct,
        id: string,
        props: TrackingAppSyncConstructProps
    ) {
        super(scope, id);
        const api = new appsync.GraphqlApi(this, "TrackingApi", {
            name: "ExternalUsersTrackingApi",
            schema: appsync.SchemaFile.fromAsset("schema/tracking.graphql"),
        });

        this.trackingTable = new dynamodb.Table(this, "TrackingInfoTable", {
            partitionKey: {
                name: "pk",
                type: dynamodb.AttributeType.STRING,
            },
            sortKey: {
                name: "sk",
                type: dynamodb.AttributeType.STRING,
            },
            timeToLiveAttribute: "ExpiresAt",
        });

        this.trackingTable.addGlobalSecondaryIndex({
            indexName: "TokenIndex",
            partitionKey: { name: "sk", type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.KEYS_ONLY,
        });

        const getTrackingAppSyncFunction = new appsync.AppsyncFunction(
            this,
            "func-get-tracking",
            {
                name: "getTrackingFunction",
                api,
                dataSource: api.addDynamoDbDataSource(
                    "TableForTracking",
                    this.trackingTable
                ),
                code: appsync.Code.fromAsset(
                    "./lib/appsync/node/GetTracking/dist/index.js"
                ),
                runtime: appsync.FunctionRuntime.JS_1_0_0,
            }
        );

        const resolveTaskInfo = new appsync.AppsyncFunction(
            this,
            "FuncResolveTaskInfo",
            {
                name: "ResolveTaskInfo",
                api,
                dataSource: api.addDynamoDbDataSource(
                    "TableForTrackingResolver",
                    this.trackingTable
                ),
                code: appsync.Code.fromAsset(
                    "./lib/appsync/node/ResolveTaskInfo/dist/index.js"
                ),
                runtime: appsync.FunctionRuntime.JS_1_0_0,
            }
        );

        new appsync.Resolver(this, "PipelineResolverGetTrackingInfo", {
            api,
            typeName: "Query",
            fieldName: "getTracking",
            code: appsync.Code.fromInline(`
              export function request(ctx) {
                  return {};
              }

              export function response(ctx) {
                  return ctx.prev.result;
              }
       `),
            runtime: appsync.FunctionRuntime.JS_1_0_0,
            pipelineConfig: [getTrackingAppSyncFunction, resolveTaskInfo],
        });

        new cdk.CfnOutput(this, "GraphQLAPIURL", {
            value: api.graphqlUrl,
        });

        new cdk.CfnOutput(this, "GraphQLAPIKey", {
            value: api.apiKey || "",
        });

        new cdk.CfnOutput(this, "Stack Region", {
            value: props.region,
        });
    }
}
