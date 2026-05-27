import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as cloudwatch_actions from "aws-cdk-lib/aws-cloudwatch-actions";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";

export interface TrackingSQSConstructProps {
    region: string;
    alertsEmail: string;
}

export class TrackingSQSConstruct extends Construct {
    public readonly standardQueue: sqs.Queue;
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
        this.standardQueue = new sqs.Queue(this, "TrackingQueue", {
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

        const alertTopic = new sns.Topic(this, "SqsFailureAlertTopic", {
            topicName: "sqs-failure-alerts",
        });

        // Subscribe your email (replace with yours!)
        alertTopic.addSubscription(
            new subscriptions.EmailSubscription(props.alertsEmail)
        );

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

        // ====================================================================
        // 5. Example IAM Policy (if a Lambda wants to send/receive)
        // ====================================================================

        const lambdaRoleExample = new iam.Role(
            this,
            "LambdaExecutionRoleExample",
            {
                assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
            }
        );

        // Grant send permission to both queues
        this.standardQueue.grantSendMessages(lambdaRoleExample);

        // Grant consume permission
        this.standardQueue.grantConsumeMessages(lambdaRoleExample);

        // Also allow reading DLQ (for debugging)
        standardDlq.grantConsumeMessages(lambdaRoleExample);
    }
}
