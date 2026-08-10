import { jest, expect } from "@jest/globals";

jest.unstable_mockModule("@platelet-app/lambda", () => ({
    request: jest.fn(),
    errorCheck: jest.fn(),
    generateSecurePassword: jest.fn().mockReturnValue("some-password"),
    // @ts-ignore
    sendTenantWelcomeEmail: jest.fn().mockResolvedValue({}),
}));

jest.unstable_mockModule("@aws-sdk/client-cognito-identity-provider", () => {
    // @ts-ignore
    const mockSend = jest.fn().mockResolvedValue({});
    const MockCognitoIdentityProviderClient = jest.fn(() => ({
        send: mockSend,
    }));
    return {
        CognitoIdentityProviderClient: MockCognitoIdentityProviderClient,
        AdminAddUserToGroupCommand: jest.fn(),
        AdminCreateUserCommand: jest.fn(),
        AdminDeleteUserCommand: jest.fn(),
        AdminUpdateUserAttributesCommand: jest.fn(),
        DeliveryMediumType: { EMAIL: "EMAIL", SMS: "SMS" },
        MessageActionType: { RESEND: "RESEND", SUPPRESS: "SUPPRESS" },
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
