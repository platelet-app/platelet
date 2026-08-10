import { jest, expect } from "@jest/globals";

jest.unstable_mockModule("@platelet-app/lambda", () => ({
    request: jest.fn(),
    errorCheck: jest.fn(),
    // @ts-ignore
    getUserProfilePictures: jest.fn().mockResolvedValue({
        Contents: [{ Key: "test-key" }, { Key: "test-key2" }],
    }),
}));

jest.unstable_mockModule("@aws-sdk/client-cognito-identity-provider", () => {
    // @ts-ignore
    const mockSend = jest.fn().mockResolvedValue({});
    const MockCognitoIdentityProviderClient = jest.fn(() => ({
        send: mockSend,
    }));
    return {
        CognitoIdentityProviderClient: MockCognitoIdentityProviderClient,
        AdminDisableUserCommand: jest.fn(),
        AdminDeleteUserCommand: jest.fn(),
        mockSend, // Export mockSend to assert on tests
    };
});

// must be imported before the handler
const cognito = await import("@aws-sdk/client-cognito-identity-provider");
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

describe("RegisterTenant", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("empty test", () => {
        expect(true).toBe(true);
    });
});
