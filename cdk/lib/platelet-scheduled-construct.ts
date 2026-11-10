import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { createLambdaStatement, getRoleArnNameOnly } from "./utils";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";

export interface ScheduledConstructProps {
    region: string;
    graphQLEndpoint: string;
    graphqlAppSync: cdk.aws_appsync.IGraphqlApi;
}

export class ScheduledConstruct extends Construct {
    constructor(scope: Construct, id: string, props: ScheduledConstructProps) {
        super(scope, id);

        const role = new iam.Role(this, "CreateScheduledTasksRole", {
            assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        });

        const createScheduledTasksFunction = new lambda.Function(
            this,
            "CreateScheduledTasks",
            {
                runtime: lambda.Runtime.NODEJS_22_X,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/CreateScheduledTasks/dist"
                ),
                environment: {
                    REGION: props.region,
                    GRAPHQL_ENDPOINT: props.graphQLEndpoint,
                },
                role,
            }
        );

        const rule = new events.Rule(this, "Schedule Rule", {
            schedule: events.Schedule.cron({ minute: "0", hour: "0" }),
        });
        rule.addTarget(
            new targets.LambdaFunction(createScheduledTasksFunction)
        );

        createLambdaStatement(
            createScheduledTasksFunction,
            props.graphqlAppSync.arn,
            {
                queries: ["listScheduledTasks"],
                mutations: [
                    "createTask",
                    "createLocation",
                    "createDeliverable",
                ],
            }
        );
        new cdk.CfnOutput(this, "AdminRoleNamesCreateScheduledTasks", {
            value: getRoleArnNameOnly(createScheduledTasksFunction),
        });
    }
}
