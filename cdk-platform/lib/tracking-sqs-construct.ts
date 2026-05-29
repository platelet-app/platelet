import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as cloudwatch_actions from "aws-cdk-lib/aws-cloudwatch-actions";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import { Alias } from "aws-cdk-lib/aws-kms";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export interface TrackingSQSConstructProps {
    region: string;
    ddbTableName: string;
    alertsEmail?: string;
}

export class TrackingSQSConstruct extends Construct {
    constructor(
        scope: Construct,
        id: string,
        props: TrackingSQSConstructProps
    ) {
        super(scope, id);
        // ====================================================================
        // 1. Standard Queue + Dead Letter Queue
        // ====================================================================

        // DLQ for the main standard queue (catches messages that fail 5 times)
        const standardDlq = new sqs.Queue(this, "TrackingDLQ", {
            queueName: "platelet-tracking-dlq",
            retentionPeriod: Duration.days(14), // Keep failed messages for 2 weeks
            removalPolicy: RemovalPolicy.DESTROY, // Delete when stack is destroyed
        });

        // Main Standard Queue
        const standardQueue = new sqs.Queue(this, "TrackingQueue", {
            queueName: "platelet-tracking-queue",
            visibilityTimeout: Duration.minutes(5), // Consumer has 5 min to process
            receiveMessageWaitTime: Duration.seconds(20),
            deadLetterQueue: {
                queue: standardDlq,
                maxReceiveCount: 5, // After 5 failures → go to DLQ
            },
            encryption: sqs.QueueEncryption.KMS_MANAGED, // Server-side encryption
        });

        // ====================================================================
        // 3. SNS Topic to get notified when messages land in DLQ
        // ====================================================================

        const snsKey = Alias.fromAliasName(
            this,
            "TrackingSQSTopic",
            "alias/aws/sns"
        );

        const alertTopic = new sns.Topic(this, "SqsFailureAlertTopic", {
            topicName: "sqs-failure-alerts",
            enforceSSL: true,
            masterKey: snsKey,
        });

        if (props.alertsEmail) {
            alertTopic.addSubscription(
                new subscriptions.EmailSubscription(props.alertsEmail)
            );
        }

        // ====================================================================
        // 4. CloudWatch Alarm → Send email when DLQ has messages
        // ====================================================================

        const dlqAlarm = new cloudwatch.Alarm(this, "StandardDLQAlarm", {
            metric: standardDlq.metricApproximateNumberOfMessagesVisible({
                period: Duration.minutes(1),
            }),
            threshold: 1,
            evaluationPeriods: 1,
            alarmDescription: "Alert when any message lands in Standard DLQ",
            treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        });

        dlqAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(alertTopic));

        const lambdaRole = new iam.Role(this, "LambdaExecutionRole", {
            assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        });

        // Grant consume permission
        standardQueue.grantConsumeMessages(lambdaRole);

        const lambdaSQSConsumer = new lambda.Function(
            this,
            "TrackingSQSConsumer",
            {
                runtime: lambda.Runtime.NODEJS_24_X,
                handler: "index.handler",
                code: lambda.Code.fromAsset(
                    "./lib/lambda/node/TrackingSQSConsumer/dist"
                ),
                environment: {
                    REGION: props.region,
                    DYNAMODB_TABLE: props.ddbTableName,
                },
                role: lambdaRole,
            }
        );
        lambdaSQSConsumer.addEventSource(
            new SqsEventSource(standardQueue, {
                batchSize: 10,
            })
        );
    }
}
