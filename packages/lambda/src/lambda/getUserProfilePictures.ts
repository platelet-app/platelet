import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { S3Object } from "@platelet-app/types";

const REGION = process.env.REGION;

export const getUserProfilePictures = async (item: S3Object) => {
    const s3Client = new S3Client({ region: REGION || "eu-west-1" });
    const Prefix = item.key.split(".")[0];
    const input = {
        Bucket: item.bucket,
        Prefix,
    };
    if (!input.Prefix || input.Prefix.length === 0) {
        throw new Error("Prefix is missing!");
    }
    if (input.Prefix === "public/" || !input.Prefix.startsWith("public/")) {
        throw new Error("Incorrect prefix!");
    }
    const command = new ListObjectsV2Command(input);
    return await s3Client.send(command);
};
