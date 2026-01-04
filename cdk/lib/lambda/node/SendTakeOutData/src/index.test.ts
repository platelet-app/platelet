import { jest, expect } from "@jest/globals";
import { PassThrough } from "node:stream";
import { mockClient } from "aws-sdk-client-mock";
import {
    S3Client,
    DeleteObjectCommand,
    ListObjectsV2Command,
    GetObjectCommand,
} from "@aws-sdk/client-s3";

import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

// Create the mock instance
const s3Mock = mockClient(S3Client);
const sesMock = mockClient(SESv2Client);

jest.unstable_mockModule("@platelet-app/lambda", async () => {
    return {
        getUserProfilePictures: jest.fn(),
        request: jest.fn(),
        errorCheck: jest.fn(),
    };
});

const lambda = await import("@platelet-app/lambda");

jest.unstable_mockModule("archiver", () => {
    const mockArchive = {
        pipe: jest.fn(),
        append: jest.fn(),
        finalize: jest.fn().mockResolvedValue(undefined),
        on: jest.fn(),
    };
    return {
        default: jest.fn(() => mockArchive),
    };
});

jest.unstable_mockModule("@aws-sdk/lib-storage", () => ({
    Upload: jest.fn().mockImplementation(() => ({
        done: jest.fn().mockResolvedValue({ Location: "mock-location" }),
    })),
}));

const archiver = (await import("archiver")).default;
const { Upload } = await import("@aws-sdk/lib-storage");

// import handler
const { handler } = await import("./index.js");

function setupFetchStub(data: any): () => Promise<Response> {
    return function fetchStub(): Promise<Response> {
        return new Promise((resolve) => {
            resolve({
                json: () =>
                    Promise.resolve({
                        data,
                    }),
            } as Response);
        });
    };
}

const fakeUser = {
    getUser: {
        id: "test-user-id",
        _version: 10,
        username: "some-username",
        name: "Some Name",
        contact: {
            emailAddress: "test@platelet.app",
        },
        profilePicture: {
            key: "public/some-key.jpg",
            bucket: "some-user-bucket",
        },
    },
};

describe("SendTakeOutData", () => {
    beforeEach(() => {
        s3Mock.reset();
        jest.clearAllMocks();
    });

    test("send take out data", async () => {
        const mockArchiveInstance = archiver();

        sesMock.on(SendEmailCommand).resolves({});

        s3Mock.on(DeleteObjectCommand).resolves({});
        lambda.request
            .mockImplementationOnce(setupFetchStub(fakeUser))
            .mockImplementation(setupFetchStub({}));

        lambda.getUserProfilePictures.mockImplementationOnce(() => ({
            Contents: [
                { Key: "public/some-key.jpg" },
                { Key: "public/some-key-128x128.jpg" },
            ],
        }));

        s3Mock.on(ListObjectsV2Command).resolves({
            Contents: [
                { Key: "test-user-id/public/some-key.jpg" },
                { Key: "test-user-id/public/some-key-128x128.jpg" },
                { Key: "test-user-id/user.json" },
            ],
        });

        s3Mock.on(GetObjectCommand).resolves({
            Body: new PassThrough(),
        });

        await handler({ userId: "test" });

        expect(archiver).toHaveBeenCalledWith("zip", { zlib: { level: 9 } });

        expect(mockArchiveInstance.append).toHaveBeenCalledTimes(3);

        expect(mockArchiveInstance.append).toHaveBeenCalledWith(
            expect.any(PassThrough),
            { name: "test-user-id/public/some-key.jpg" }
        );
        expect(mockArchiveInstance.append).toHaveBeenCalledWith(
            expect.any(PassThrough),
            { name: "test-user-id/public/some-key-128x128.jpg" }
        );
        expect(mockArchiveInstance.append).toHaveBeenCalledWith(
            expect.any(PassThrough),
            { name: "test-user-id/user.json" }
        );

        expect(mockArchiveInstance.finalize).toHaveBeenCalled();

        expect(Upload).toHaveBeenCalledWith(
            expect.objectContaining({
                params: expect.objectContaining({
                    Key: "test-user-id.zip",
                    ContentType: "application/zip",
                    Body: expect.any(PassThrough),
                }),
            })
        );

        expect(s3Mock.calls().map((i) => i.args[0])).toMatchSnapshot();
        console.log(sesMock.calls()[0].args[0].input);
        expect(sesMock.calls()[0].args[0].input).toEqual(
            expect.objectContaining({
                Destination: {
                    ToAddresses: ["test@platelet.app"],
                },
                FromEmailAddress: "noreply@platelet.app",
            })
        );
    });
});
