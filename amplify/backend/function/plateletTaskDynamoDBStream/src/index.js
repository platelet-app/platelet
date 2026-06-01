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

import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import {
    getSQSTrackingURL,
    getTenantName,
    getTenantWebsite,
} from "@platelet-app/lambda";

const sqsClient = new SQSClient({});

const ENV_NAME = process.env.ENV;

const sendMessage = async (data, tenantName, tenantWebsite, SQSName) => {
    const trackingData = { task: data, tenantName, tenantWebsite };
    const command = new SendMessageCommand({
        QueueUrl: SQSName,
        DelaySeconds: 10,
        MessageAttributes: {
            Operation: {
                DataType: "String",
                StringValue: "UPDATE_TRACKING",
            },
        },
        MessageBody: JSON.stringify(trackingData),
    });

    const response = await sqsClient.send(command);
    console.log(response);
    return response;
};

const sendDeleteMessage = async (data, SQSName) => {
    const command = new SendMessageCommand({
        QueueUrl: SQSName,
        DelaySeconds: 10,
        MessageAttributes: {
            Operation: {
                DataType: "String",
                StringValue: "DELETE_TRACKING",
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
        if (!data?.isBeingTracked) {
            // if the task is not tracked, delete the old data
            await sendDeleteMessage(data, SQSName);
        } else if (data?.isBeingTracked) {
            // otherwise if the task is being tracked, send the data to the queue
            const tenantName = await getTenantName(ENV_NAME);
            const tenantWebsite = await getTenantWebsite(ENV_NAME);
            await sendMessage(data, tenantName, tenantWebsite, SQSName);
        }
    }
    return Promise.resolve("Successfully processed DynamoDB record");
};
