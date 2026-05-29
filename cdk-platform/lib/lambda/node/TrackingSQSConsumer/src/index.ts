import type { SQSHandler, SQSEvent } from "aws-lambda";
import pAll from "p-all";
import type { Task } from "@platelet-app/types";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import type { TaskDdbRecord } from "@platelet-app/tracking-types";

const client = new DynamoDBClient({
    region: process.env.REGION || "eu-west-1",
});
const docClient = DynamoDBDocumentClient.from(client);

const writeRecord = async (data: Task) => {
    let expires = new Date();
    // expires in 30 days
    expires.setDate(expires.getDate() + 30);

    const ExpiresAt = Math.floor(expires.getTime() / 1000); // DynamoDB TTL expects seconds

    const record: TaskDdbRecord = {
        pk: data.id,
        PickUpTime: data.timePickedUp || null,
        DropOffTime: data.timeDroppedOff || null,
        ExpiresAt,
    };

    const command = new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: record,
    });

    const response = await docClient.send(command);
    console.log(response);
    return response;
};

export const handler: SQSHandler = async (event: SQSEvent) => {
    const actions = event.Records.map((record) => async () => {
        const body = JSON.parse(record?.body) as Task;
        await writeRecord(body);
    });

    await pAll(actions, { concurrency: 10 });
};
