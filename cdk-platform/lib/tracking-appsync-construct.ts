import * as cdk from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface TrackingAppSyncConstructProps {
    region: string;
}

export class TrackingAppSyncConstruct extends Construct {
    constructor(
        scope: Construct,
        id: string,
        props: TrackingAppSyncConstructProps
    ) {
        super(scope, id);
        // makes a GraphQL API
        const api = new appsync.GraphqlApi(this, "tracking-api", {
            name: "external-users-tracking-api",
            schema: appsync.SchemaFile.fromAsset("schema/tracking.graphql"),
        });

        const trackingDdbTable = new dynamodb.Table(
            this,
            "tracking-info-table",
            {
                partitionKey: {
                    name: "pk",
                    type: dynamodb.AttributeType.STRING,
                },
            }
        );

        const getTrackingAppSyncFunction = new appsync.AppsyncFunction(
            this,
            "func-get-tracking",
            {
                name: "getTrackingFunction",
                api,
                dataSource: api.addDynamoDbDataSource(
                    "table-for-tracking",
                    trackingDdbTable
                ),
                code: appsync.Code.fromAsset(
                    "./lib/appsync/node/GetTracking/dist/index.js"
                ),
                runtime: appsync.FunctionRuntime.JS_1_0_0,
            }
        );

        const resolveTaskInfo = new appsync.AppsyncFunction(
            this,
            "func-resolve-task-info",
            {
                name: "resolveTaskInfo",
                api,
                dataSource: api.addDynamoDbDataSource(
                    "table-for-tracking-resolve",
                    trackingDdbTable
                ),
                code: appsync.Code.fromAsset(
                    "./lib/appsync/node/ResolveTaskInfo/dist/index.js"
                ),
                runtime: appsync.FunctionRuntime.JS_1_0_0,
            }
        );

        new appsync.Resolver(this, "pipeline-resolver-get-tracking-info", {
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

        // Prints out URL
        new cdk.CfnOutput(this, "GraphQLAPIURL", {
            value: api.graphqlUrl,
        });

        // Prints out the AppSync GraphQL API key to the terminal
        new cdk.CfnOutput(this, "GraphQLAPIKey", {
            value: api.apiKey || "",
        });

        // Prints out the stack region to the terminal
        new cdk.CfnOutput(this, "Stack Region", {
            value: props.region,
        });
    }
}
