import _ from "lodash";
import { jest, expect } from "@jest/globals";

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

describe("CleanVehicleAssignments", () => {
    test("clean some vehicle assignments", async () => {
        lambda.request
            .mockImplementationOnce(setupFetchStub(fakeData))
            .mockImplementationOnce(setupFetchStub(fakeData2))
            .mockImplementation(setupFetchStub({}));
        await handler({ userId: "test", retryCount: 1 });
        expect(lambda.request.mock.calls).toMatchSnapshot();
    });
});
