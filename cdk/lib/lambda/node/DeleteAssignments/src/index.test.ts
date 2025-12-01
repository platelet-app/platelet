import _ from "lodash";
import { jest, expect } from "@jest/globals";
import type { TaskAssignee } from "@platelet-app/types";

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

const fakeAssignments = _.range(0, 5).map((i) => ({
    id: i,
    _version: 2,
    _deleted: false,
}));

fakeAssignments.push({
    id: 1000,
    _version: 2,
    _deleted: true,
});

describe("DeleteAssignments", () => {
    test("delete some assignments", async () => {
        lambda.request.mockImplementation(setupFetchStub({}));
        await handler({
            userId: "test",
            retryCount: 1,
            assignments: fakeAssignments as unknown as TaskAssignee[],
        });
        expect(lambda.request.mock.calls).toMatchSnapshot();
    });
});
