import _ from "lodash";
import { mockClient } from "aws-sdk-client-mock";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { jest, expect } from "@jest/globals";

const s3Mock = mockClient(S3Client);
jest.unstable_mockModule("@platelet-app/lambda", () => ({
    request: jest.fn(),
    errorCheck: jest.fn(),
}));

// must be imported before the handler
const lambda = await import("@platelet-app/lambda");
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

const fakeComments = _.range(0, 5).map((i) => ({
    id: i,
    _version: 2,
}));
const fakeComments2 = _.range(5, 10).map((i) => ({
    id: i,
    _version: 1,
}));

const fakeData = {
    getUser: {
        comments: {
            items: fakeComments,
            nextToken: "something",
        },
    },
};
const fakeData2 = {
    getUser: {
        comments: {
            items: fakeComments2,
            nextToken: null,
        },
    },
};

describe("TakeOutGetUserComments", () => {
    test("take out get user comments", async () => {
        lambda.request
            .mockImplementationOnce(setupFetchStub(fakeData))
            .mockImplementationOnce(setupFetchStub(fakeData2))
            .mockImplementation(setupFetchStub({}));
        await handler({ userId: "test-user-id", retryCount: 1 });
        expect(lambda.request.mock.calls).toMatchSnapshot();
        expect(s3Mock.calls()[0].args[0].input).toEqual(
            expect.objectContaining({
                Body: JSON.stringify([...fakeComments, ...fakeComments2]),
                Bucket: "some-takeout-bucket",
                Key: "test-user-id/comments.json",
            })
        );
    });
});
