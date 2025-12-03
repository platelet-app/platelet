import type { LambdaEvent, LambdaReturn } from "./interfaces.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { Comment } from "@platelet-app/types";
import { request, errorCheck } from "@platelet-app/lambda";
import { getUser } from "./queries.js";

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const TAKE_OUT_BUCKET = process.env.TAKE_OUT_BUCKET;
const REGION = process.env.REGION;

const getUserComments = async (
    userId: string,
    endpoint: string
): Promise<Comment[]> => {
    const items = [];
    let nextToken = null;
    do {
        const variables = {
            id: userId,
            nextToken,
        };
        const response = await request({ query: getUser, variables }, endpoint);
        const body = await response.json();
        errorCheck(body);
        if (body?.data?.getUser?.comments) {
            items.push(...body.data.getUser.comments.items);
            nextToken = body.data.getUser.comments.nextToken;
        } else {
            nextToken = null;
        }
    } while (nextToken);
    return items.flat();
};

const writeToBucket = async (data: Comment[], key: string) => {
    const json = JSON.stringify(data);
    const s3Client = new S3Client({ region: REGION || "eu-west-1" });
    await s3Client.send(
        new PutObjectCommand({
            Bucket: TAKE_OUT_BUCKET,
            Body: json,
            Key: key,
        })
    );
};

export const handler = async (event: LambdaEvent): Promise<LambdaReturn> => {
    console.log("get user comments", event);
    const { userId, retryCount } = event;
    if (!GRAPHQL_ENDPOINT) {
        throw new Error("Missing env variables");
    }
    const comments = await getUserComments(userId, GRAPHQL_ENDPOINT);
    console.log("Found comments", comments);
    await writeToBucket(comments, `${userId}/comments.json`);
    return { userId, retryCount };
};
