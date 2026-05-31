/* Amplify Params - DO NOT EDIT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	API_PLATELET_LOCATIONTABLE_ARN
	API_PLATELET_LOCATIONTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { getSQSTrackingURL } from "@platelet-app/lambda";

const sqsClient = new SQSClient({});

const sendMessage = async (data, SQSName) => {
    const command = new SendMessageCommand({
        QueueUrl: SQSName,
        DelaySeconds: 10,
        MessageAttributes: {
            Operation: {
                DataType: "String",
                StringValue: "UPDATE_TRACKING",
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
    for (const record of event.Records) {
        console.log(record.eventID);
        console.log(record.eventName);
        console.log("DynamoDB Record: %j", record.dynamodb);

        const data = unmarshall(record?.dynamodb?.NewImage);
        await sendMessage(data, SQSName);
    }
    return Promise.resolve("Successfully processed DynamoDB record");
};
