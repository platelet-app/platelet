/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { getSQSTrackingURL } from "@platelet-app/lambda";

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
    const SQSName = await getSQSTrackingURL();
    await sendMessage(event.arguments, SQSName);

    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
    };
};
