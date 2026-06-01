/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import {
    getSQSTrackingURL,
    getTenantName,
    getTenantWebsite,
} from "@platelet-app/lambda";

const ENV_NAME = process.env.ENV;

const sqsClient = new SQSClient({});

const sendMessage = async (data, SQSName) => {
    const command = new SendMessageCommand({
        QueueUrl: SQSName,
        DelaySeconds: 10,
        MessageAttributes: {
            Operation: {
                DataType: "String",
                StringValue: "SEND_TRACKING_LINK",
            },
        },
        MessageBody: JSON.stringify(data),
    });

    const response = await sqsClient.send(command);
    console.log(response);
    return response;
};

export const handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const SQSName = await getSQSTrackingURL();
    const tenantName = await getTenantName(ENV_NAME);
    const tenantWebsite = await getTenantWebsite(ENV_NAME);
    await sendMessage(
        { ...event.arguments, tenantName, tenantWebsite },
        SQSName
    );
    return true;
};
