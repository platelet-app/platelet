import type { LambdaEvent, LambdaReturn } from "./interfaces.js";
import { request, errorCheck } from "@platelet-app/lambda";
import { getUser } from "./queries.js";
import type { S3Object, User } from "@platelet-app/types";
import {
    S3Client,
    DeleteObjectCommand,
    PutObjectCommand,
    ListObjectsV2Command,
    type ListObjectsV2CommandOutput,
    CopyObjectCommand,
} from "@aws-sdk/client-s3";

const TAKE_OUT_BUCKET = process.env.TAKE_OUT_BUCKET;
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const REGION = process.env.REGION;

const writeToBucket = async (data: User, key: string) => {
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

const getProfilePictures = async (item: S3Object) => {
    const s3Client = new S3Client({ region: REGION || "eu-west-1" });

    const input = {
        Bucket: item.bucket,
        Prefix: item.key,
    };
    if (!input.Prefix || input.Prefix.length === 0) {
        throw new Error("Prefix is missing!");
    }
    const command = new ListObjectsV2Command(input);
    return await s3Client.send(command);
};

const writeProfilePictures = async (
    pictures: ListObjectsV2CommandOutput,
    sourceBucket: string,
    userId: string
) => {
    const s3Client = new S3Client({ region: REGION || "eu-west-1" });
    for (const pic of pictures.Contents || []) {
        const command = new CopyObjectCommand({
            CopySource: `/${sourceBucket}/${pic.Key}`,
            Bucket: TAKE_OUT_BUCKET,
            Key: `${userId}/${pic.Key}`,
        });
        await s3Client.send(command);
    }
};

const deleteTakeOutFile = async (item: S3Object) => {
    const config = {};
    const client = new S3Client(config);
    const input = {
        Bucket: item.bucket,
        Key: item.key,
    };
    const command = new DeleteObjectCommand(input);
    await client.send(command);
};

const getUserFunction = async (userId: string, endpoint: string) => {
    const variables = {
        id: userId,
    };
    const response = await request({ query: getUser, variables }, endpoint);
    const body = await response.json();
    errorCheck(body);
    return body?.data?.getUser;
};

export const handler = async (event: LambdaEvent): Promise<LambdaReturn> => {
    console.log("send take out data", event);
    const { userId, retryCount } = event;
    if (!GRAPHQL_ENDPOINT) {
        throw new Error("Missing env variables");
    }
    const user = await getUserFunction(userId, GRAPHQL_ENDPOINT);
    writeToBucket(user, `${userId}/user.json`);
    if (user?.profilePicture) {
        const pictures = await getProfilePictures(user.profilePicture);
        await writeProfilePictures(
            pictures,
            user.profilePicture.bucket,
            userId
        );
    }
    return { retryCount, userId };
};
