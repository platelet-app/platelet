import { jest, expect } from "@jest/globals";

jest.unstable_mockModule("@platelet-app/lambda", () => ({
    request: jest.fn(),
    errorCheck: jest.fn(),
    getUserProfilePictures: jest.fn().mockResolvedValue({
        Contents: [{ Key: "test-key" }, { Key: "test-key2" }],
    }),
}));

jest.unstable_mockModule("@aws-sdk/client-cognito-identity-provider", () => {
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

jest.unstable_mockModule("@aws-sdk/client-s3", () => {
    const mockSend = jest.fn().mockResolvedValueOnce({});
    const MockS3Client = jest.fn(() => ({
        send: mockSend,
    }));
    return {
        DeleteObjectCommand: jest.fn(),
        S3Client: MockS3Client,
        mockSend, // Export mockSend to assert on tests
    };
});

// must be imported before the handler
const cognito = await import("@aws-sdk/client-cognito-identity-provider");
const s3 = await import("@aws-sdk/client-s3");
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

describe("DeleteUser", () => {
    test("delete a user", async () => {
        lambda.request
            .mockImplementationOnce(setupFetchStub(fakeUser))
            .mockImplementation(setupFetchStub({}));
        await handler({
            userId: "test",
            retryCount: 1,
        });
        expect(lambda.request.mock.calls).toMatchSnapshot();
        expect(cognito.mockSend).toHaveBeenCalledTimes(2);
        expect(cognito.AdminDisableUserCommand.mock.calls)
            .toMatchInlineSnapshot(`
            [
              [
                {
                  "UserPoolId": "some_pool",
                  "Username": "some-username",
                },
              ],
            ]
        `);
        expect(cognito.AdminDeleteUserCommand.mock.calls)
            .toMatchInlineSnapshot(`
            [
              [
                {
                  "UserPoolId": "some_pool",
                  "Username": "some-username",
                },
              ],
            ]
        `);
        expect(s3.mockSend).toHaveBeenCalledTimes(2);
        expect(s3.DeleteObjectCommand.mock.calls).toMatchInlineSnapshot(`
            [
              [
                {
                  "Bucket": "some-bucket",
                  "Key": "test-key",
                },
              ],
              [
                {
                  "Bucket": "some-bucket",
                  "Key": "test-key2",
                },
              ],
            ]
        `);
    });
});
