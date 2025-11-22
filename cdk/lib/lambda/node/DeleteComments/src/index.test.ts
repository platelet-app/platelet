import _ from "lodash";
import { jest, expect } from "@jest/globals";
import type { Comment } from "@platelet-app/types";

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
    _deleted: false,
}));

fakeComments.push({
    id: 1000,
    _version: 2,
    _deleted: true,
});

const fakeUpdatedComments = fakeComments.map((c) => ({
    updateComment: {
        ...c,
        _version: c._version + 1,
    },
}));

describe("DeleteComments", () => {
    test("delete some comments", async () => {
        lambda.request
            .mockImplementationOnce(setupFetchStub(fakeUpdatedComments[0]))
            .mockImplementationOnce(setupFetchStub(fakeUpdatedComments[1]))
            .mockImplementationOnce(setupFetchStub(fakeUpdatedComments[2]))
            .mockImplementationOnce(setupFetchStub(fakeUpdatedComments[3]))
            .mockImplementationOnce(setupFetchStub(fakeUpdatedComments[4]))
            .mockImplementation(setupFetchStub({}));
        await handler({
            userId: "test",
            retryCount: 1,
            comments: fakeComments as unknown as Comment[],
        });
        expect(lambda.request.mock.calls).toMatchSnapshot();
    });
});
