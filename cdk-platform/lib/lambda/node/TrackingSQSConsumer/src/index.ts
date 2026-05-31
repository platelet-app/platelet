import type { SQSEvent, SQSBatchResponse } from "aws-lambda";
import pAll from "p-all";
import type { Task } from "@platelet-app/types";
import type {
    TaskDdbRecord,
    TokenDdbRecord,
} from "@platelet-app/tracking-types";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { sendPlateletEmail } from "@platelet-app/lambda";
import { generateEmailTemplate } from "./generateEmailTemplate.js";

type TrackingLinkData = {
    recipientEmail: string;
    recipientName: string;
    name: string;
    taskId: string;
};

const client = new DynamoDBClient({
    region: process.env.REGION || "eu-west-1",
});
const docClient = DynamoDBDocumentClient.from(client);

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
const generateToken = () => {
    const randomSegment = () => {
        const bytes = crypto.getRandomValues(new Uint8Array(4));
        return Array.from(bytes, (b) => chars[b % chars.length]).join("");
    };
    return Array.from({ length: 3 }, randomSegment).join("-");
};

const writeRecord = async (data: Task) => {
    let expires = new Date();
    // expires in one year
    expires.setDate(expires.getDate() + 365);

    const ExpiresAt = Math.floor(expires.getTime() / 1000); // DynamoDB TTL expects seconds

    const record: TaskDdbRecord = {
        pk: `task#${data.id}`,
        PickUpTime: data.timePickedUp || null,
        DropOffTime: data.timeDroppedOff || null,
        ExpiresAt,
    };

    console.log("table:", process.env.TABLE_NAME);
    const command = new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: record,
    });

    const response = await docClient.send(command);
    console.log(response);
    return response;
};

const writeTrackingRecord = async (taskId: string, token: string) => {
    let expires = new Date();
    // expires in 30 days
    expires.setDate(expires.getDate() + 30);

    const ExpiresAt = Math.floor(expires.getTime() / 1000); // DynamoDB TTL expects seconds

    const record: TokenDdbRecord = {
        pk: `token#${token}`,
        TaskId: `task#${taskId}`,
        ExpiresAt,
    };

    console.log("table:", process.env.TABLE_NAME);
    const command = new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: record,
    });

    const response = await docClient.send(command);
    console.log(response);
    return response;
};

const sendTrackingLink = async (data: TrackingLinkData) => {
    const { recipientEmail, recipientName, taskId } = data;
    const token = generateToken();
    if (taskId) {
        await writeTrackingRecord(taskId, token);
    } else {
        throw new Error("No task ID!");
    }
    if (recipientEmail) {
        console.log("sending to email", recipientEmail);
        const result = await sendPlateletEmail(
            recipientEmail,
            generateEmailTemplate(
                recipientName,
                "test",
                "test.com",
                "test.img",
                "https://www.platelet.app/static/media/platelet.bdc5bd61.png",
                token
            ),
            "quack",
            "Tracking information"
        );
        console.log("AAA", result);
    }
};

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
    const batchItemFailures: SQSBatchResponse["batchItemFailures"] = [];

    const actions = event.Records.map((record) => async () => {
        try {
            const body = JSON.parse(record.body);
            console.log("BODY", record?.body);
            console.log("ATTR", record.messageAttributes);
            const operation = record.messageAttributes?.Operation?.stringValue;
            switch (operation) {
                case "UPDATE_TRACKING":
                    console.log(
                        "start UPDATE_TRACKING operation for:",
                        body?.id
                    );
                    await writeRecord(body as Task);
                    break;
                case "SEND_TRACKING_LINK":
                    console.log("send tracking link:", body);
                    await sendTrackingLink(body);
                    break;
                default:
                    throw new Error("Operation not supported");
            }
        } catch (err) {
            console.error(
                `Failed to process message ${record.messageId}:`,
                err
            );
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    });

    await pAll(actions, { concurrency: 10 });

    return { batchItemFailures };
};
