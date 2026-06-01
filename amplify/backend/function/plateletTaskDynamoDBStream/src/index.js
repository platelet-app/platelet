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
import { getSQSTrackingURL } from "@platelet-app/lambda";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const sqsClient = new SQSClient({});

const getTenantName = async (envName) => {
    const client = new SSMClient();
    const parameterName = `/platelet-supporting-cdk/${envName}/TenantName`;
    const params = {
        Name: parameterName,
    };
    const command = new GetParameterCommand(params);
    try {
        const response = await client.send(command);

        // The value is nested under Parameter.Value
        return response.Parameter?.Value;
    } catch (error) {
        if (error.name === "ParameterNotFound") {
            console.error(`Parameter not found: ${parameterName}`);
            return undefined;
        }
        console.error("Error retrieving SSM parameter:", error);
        throw error;
    }
};

const getTenantWebsite = async (envName) => {
    const client = new SSMClient();
    const parameterName = `/platelet-supporting-cdk/${envName}/TenantWebsite`;
    const params = {
        Name: parameterName,
    };
    const command = new GetParameterCommand(params);
    try {
        const response = await client.send(command);

        // The value is nested under Parameter.Value
        return response.Parameter?.Value;
    } catch (error) {
        if (error.name === "ParameterNotFound") {
            console.error(`Parameter not found: ${parameterName}`);
            return undefined;
        }
        console.error("Error retrieving SSM parameter:", error);
        throw error;
    }
};

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
    const tenantName = await getTenantName();
    const tenantWebsite = await getTenantWebsite();
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
            await sendMessage(data, SQSName);
        }
    }
    return Promise.resolve("Successfully processed DynamoDB record");
};
