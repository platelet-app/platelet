import type { LambdaEvent, LambdaReturn } from "./interfaces.js";
import type { VehicleAssignment } from "@platelet-app/types";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { request, errorCheck } from "@platelet-app/lambda";
import { getUser } from "./queries.js";

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const TAKE_OUT_BUCKET = process.env.TAKE_OUT_BUCKET;
const REGION = process.env.REGION;

const getVehicleAssignments = async (
    userId: string,
    endpoint: string
): Promise<VehicleAssignment[]> => {
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
        if (body?.data?.getUser?.vehicleAssignments) {
            items.push(...body.data.getUser.vehicleAssignments.items);
            nextToken = body.data.getUser.vehicleAssignments.nextToken;
        } else {
            nextToken = null;
        }
    } while (nextToken);
    return items.flat();
};

const writeToBucket = async (data: VehicleAssignment[], key: string) => {
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
    console.log("clean vehicle assignments", event);
    const { userId, retryCount } = event;
    if (!GRAPHQL_ENDPOINT) {
        throw new Error("Missing env variables");
    }
    const vehicleAssignments = await getVehicleAssignments(
        userId,
        GRAPHQL_ENDPOINT
    );
    console.log("Found vehicle assignments", vehicleAssignments);
    await writeToBucket(
        vehicleAssignments,
        `${userId}/vehicle_assignments.json`
    );

    return { userId, retryCount };
};
