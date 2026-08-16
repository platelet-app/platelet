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

const fakeUser = {
    getUser: {
        id: "test",
        _version: 10,
        username: "some-username",
        profilePicture: {
            key: "some-key",
            bucket: "some-bucket",
        },
    },
};

describe("DeleteUserOnFailure", () => {
    test("delete a user clean up", async () => {
        lambda.request
            .mockImplementationOnce(setupFetchStub(fakeUser))
            .mockImplementation(setupFetchStub({}));
        await handler({
            userId: "test",
            retryCount: 1,
        });
        expect(lambda.request.mock.calls).toMatchSnapshot();
    });
});
