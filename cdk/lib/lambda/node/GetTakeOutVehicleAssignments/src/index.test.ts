import _ from "lodash";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { jest, expect } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";

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

const fakeVehicleAssignments1 = _.range(0, 5).map((i) => ({
    id: i,
    _version: 2,
}));
const fakeVehicleAssignments2 = _.range(5, 10).map((i) => ({
    id: i,
    _version: 1,
}));

const fakeData = {
    getUser: {
        vehicleAssignments: {
            items: fakeVehicleAssignments1,
            nextToken: "something",
        },
    },
};
const fakeData2 = {
    getUser: {
        vehicleAssignments: {
            items: fakeVehicleAssignments2,
            nextToken: null,
        },
    },
};

describe("GetTakeOutVehicleAssignments", () => {
    test("take out some vehicle assignments", async () => {
        s3Mock.on(PutObjectCommand).resolves({});
        lambda.request
            .mockImplementationOnce(setupFetchStub(fakeData))
            .mockImplementationOnce(setupFetchStub(fakeData2))
            .mockImplementation(setupFetchStub({}));
        await handler({ userId: "test-user-id" });
        expect(lambda.request.mock.calls).toMatchSnapshot();
        expect(s3Mock.calls()[0].args[0].input).toEqual(
            expect.objectContaining({
                Body: JSON.stringify([
                    ...fakeVehicleAssignments1,
                    ...fakeVehicleAssignments2,
                ]),
                Bucket: "some-takeout-bucket",
                Key: "test-user-id/vehicle_assignments.json",
            })
        );
    });
});
