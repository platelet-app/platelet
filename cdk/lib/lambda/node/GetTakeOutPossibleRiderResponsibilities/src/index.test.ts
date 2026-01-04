import _ from "lodash";
import { jest, expect } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

jest.unstable_mockModule("@platelet-app/lambda", () => ({
    request: jest.fn(),
    errorCheck: jest.fn(),
}));

const s3Mock = mockClient(S3Client);
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

const fakeRiderResps1 = _.range(0, 5).map((i) => ({
    id: i,
    _version: 2,
}));
const fakeRiderResps2 = _.range(5, 10).map((i) => ({
    id: i,
    _version: 1,
}));

const fakeData = {
    getUser: {
        possibleRiderResponsibilities: {
            items: fakeRiderResps1,
            nextToken: "something",
        },
    },
};
const fakeData2 = {
    getUser: {
        possibleRiderResponsibilities: {
            items: fakeRiderResps2,
            nextToken: null,
        },
    },
};

describe("TakeOutGetPossibleRiderResponsibilities", () => {
    test("get rider responsibilities", async () => {
        s3Mock.on(PutObjectCommand).resolves({});
        lambda.request
            .mockImplementationOnce(setupFetchStub(fakeData))
            .mockImplementationOnce(setupFetchStub(fakeData2))
            .mockImplementation(setupFetchStub({}));
        await handler({ userId: "test" });
        expect(lambda.request.mock.calls).toMatchSnapshot();
        expect(s3Mock.calls()[0].args[0].input).toEqual(
            expect.objectContaining({
                Body: JSON.stringify([...fakeRiderResps1, ...fakeRiderResps2]),
                Bucket: "some-takeout-bucket",
                Key: "test/possible_rider_responsibilities.json",
            })
        );
    });
});
