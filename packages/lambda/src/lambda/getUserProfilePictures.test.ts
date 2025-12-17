import { mockClient } from "aws-sdk-client-mock";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getUserProfilePictures } from "./getUserProfilePictures.js"; // Update this path

const s3Mock = mockClient(S3Client);

describe("getUserProfilePictures", () => {
    beforeEach(() => {
        s3Mock.reset();
        process.env.REGION = "us-east-1";
    });

    it("should return a list of objects when valid input is provided", async () => {
        const mockItem = { bucket: "my-bucket", key: "public/something.jpg" };
        const mockResponse = {
            Contents: [
                { Key: "public/something.jpg" },
                { Key: "public/something-another.jpg" },
            ],
            IsTruncated: false,
        };

        s3Mock.on(ListObjectsV2Command).resolves(mockResponse);

        const result = await getUserProfilePictures(mockItem as any);

        expect(result).toEqual(mockResponse);
        expect(s3Mock.calls()).toHaveLength(1);

        expect(s3Mock.call(0).args[0].input).toMatchObject({
            Bucket: "my-bucket",
            Prefix: "public/something",
        });
    });

    it("should throw an error if the prefix is missing or empty", async () => {
        const mockItem = { bucket: "my-bucket", key: "." };

        await expect(getUserProfilePictures(mockItem as any)).rejects.toThrow(
            "Prefix is missing!"
        );
    });

    it("should throw an error if trying to list the entire public directory", async () => {
        const mockItem = { bucket: "my-bucket", key: "public/." };

        await expect(getUserProfilePictures(mockItem as any)).rejects.toThrow(
            "Incorrect prefix!"
        );
    });

    it("should bubble up S3 client errors", async () => {
        s3Mock.on(ListObjectsV2Command).rejects(new Error("S3 Network Error"));

        const mockItem = { bucket: "my-bucket", key: "public/user123.jpg" };

        await expect(getUserProfilePictures(mockItem as any)).rejects.toThrow(
            "S3 Network Error"
        );
    });
});
