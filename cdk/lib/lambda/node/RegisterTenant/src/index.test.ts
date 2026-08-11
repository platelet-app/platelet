import { jest, expect } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";
import {
    CognitoIdentityProviderClient,
    AdminAddUserToGroupCommand,
    AdminCreateUserCommand,
    AdminDeleteUserCommand,
    AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { mutations, queries } from "@platelet-app/graphql";

// Create the mock instance
const cognitoMock = mockClient(CognitoIdentityProviderClient);

jest.unstable_mockModule("@platelet-app/lambda", () => ({
    request: jest.fn(),
    errorCheck: jest.fn(),
    generateSecurePassword: jest.fn(() => "testGeneratedPassword"),
    sendTenantWelcomeEmail: jest.fn(),
}));

jest.unstable_mockModule("uuid", () => ({
    v4: jest.fn(() => "test-uuid"),
}));

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

const GRAPHQL_ENDPOINT = "https://api.example.com/graphql";

const fakeCreatedUser = {
    createUser: {
        id: "testUserId",
        displayName: "New User",
        name: "New User",
        tenantId: "test-uuid",
        cognitoId: "test-uuid",
        username: "testUsername",
        contact: {
            emailAddress: "test@test.com",
        },
        _version: 1,
    },
};

const fakeCreatedTenant = {
    createTenant: {
        id: "testTenantId",
        name: "test tenant",
    },
};

const fakeUpdatedUser = {
    updateUser: {
        id: "testUserId",
        displayName: "New User",
        name: "New User",
        tenantId: "testTenantId",
        cognitoId: "testSubId",
        username: "testUsername",
        contact: {
            emailAddress: "test@test.com",
        },
        _version: 2,
    },
};

const mockEvent = {
    name: "New User",
    emailAddress: "test@test.com",
    tenantName: "test tenant",
};

describe("RegisterTenant", () => {
    beforeEach(() => {
        cognitoMock.reset();
        jest.clearAllMocks();
    });

    test("register a new tenant", async () => {
        cognitoMock.on(AdminCreateUserCommand).resolves({
            User: {
                Attributes: [
                    {
                        Name: "sub",
                        Value: "testSubId",
                    },
                ],
            },
        });

        lambda.request
            .mockImplementationOnce(setupFetchStub(fakeCreatedUser))
            .mockImplementationOnce(setupFetchStub(fakeCreatedTenant))
            .mockImplementationOnce(setupFetchStub(fakeUpdatedUser));

        const result = await handler(mockEvent);

        expect(lambda.request).toHaveBeenCalledTimes(3);
        expect(lambda.request).toHaveBeenNthCalledWith(
            1,
            {
                query: mutations.createUser,
                variables: {
                    input: {
                        tenantId: "test-uuid",
                        disabled: 0,
                        isPrimaryAdmin: 1,
                        cognitoId: "test-uuid",
                        username: "test-uuid",
                        name: mockEvent.name,
                        displayName: mockEvent.name,
                        roles: ["USER", "ADMIN", "COORDINATOR"],
                        contact: { emailAddress: mockEvent.emailAddress },
                    },
                },
            },
            GRAPHQL_ENDPOINT
        );
        expect(lambda.request).toHaveBeenNthCalledWith(
            2,
            {
                query: mutations.createTenant,
                variables: {
                    input: {
                        name: mockEvent.tenantName,
                        tenantAdminId: "testUserId",
                        referenceIdentifier: "test",
                    },
                },
            },
            GRAPHQL_ENDPOINT
        );
        expect(lambda.request).toHaveBeenNthCalledWith(
            3,
            {
                query: mutations.updateUser,
                variables: {
                    input: {
                        id: "testUserId",
                        tenantId: "testTenantId",
                        cognitoId: "testSubId",
                        _version: 1,
                    },
                },
            },
            GRAPHQL_ENDPOINT
        );

        const createUserCalls = cognitoMock.commandCalls(
            AdminCreateUserCommand
        );
        expect(createUserCalls).toHaveLength(1);
        expect(createUserCalls[0].args[0].input).toEqual({
            DesiredDeliveryMediums: ["EMAIL"],
            ForceAliasCreation: false,
            UserAttributes: [
                {
                    Name: "email",
                    Value: mockEvent.emailAddress,
                },
                {
                    Name: "email_verified",
                    Value: "true",
                },
            ],
            TemporaryPassword: "testGeneratedPassword",
            UserPoolId: "some_pool",
            Username: "testUsername",
            MessageAction: "SUPPRESS",
        });

        const updateAttributesCalls = cognitoMock.commandCalls(
            AdminUpdateUserAttributesCommand
        );
        expect(updateAttributesCalls).toHaveLength(1);
        expect(updateAttributesCalls[0].args[0].input).toEqual({
            UserAttributes: [
                {
                    Name: "email",
                    Value: mockEvent.emailAddress,
                },
                {
                    Name: "email_verified",
                    Value: "true",
                },
            ],
            UserPoolId: "some_pool",
            Username: "testUsername",
        });

        const addToGroupCalls = cognitoMock.commandCalls(
            AdminAddUserToGroupCommand
        );
        expect(addToGroupCalls.map((call) => call.args[0].input)).toEqual(
            ["USER", "ADMIN", "COORDINATOR"].map((group) => ({
                GroupName: group,
                UserPoolId: "some_pool",
                Username: "test-uuid",
            }))
        );

        expect(lambda.sendTenantWelcomeEmail).toHaveBeenCalledWith(
            mockEvent.emailAddress,
            mockEvent.name,
            "testGeneratedPassword"
        );

        expect(result).toEqual({
            id: "testTenantId",
            name: mockEvent.tenantName,
            admin: fakeUpdatedUser.updateUser,
        });
    });

    test("clean up on failure", async () => {
        cognitoMock.on(AdminCreateUserCommand).resolves({
            User: {
                Attributes: [
                    {
                        Name: "sub",
                        Value: "testSubId",
                    },
                ],
            },
        });

        lambda.request
            .mockImplementationOnce(setupFetchStub(fakeCreatedUser))
            .mockImplementationOnce(setupFetchStub(fakeCreatedTenant))
            .mockImplementationOnce(() =>
                Promise.reject(new Error("test error"))
            )
            .mockImplementationOnce(
                setupFetchStub({
                    getUser: { id: "deleteUserId", _version: 5 },
                })
            )
            .mockImplementationOnce(setupFetchStub({}))
            .mockImplementationOnce(
                setupFetchStub({
                    getTenant: { id: "deleteTenantId", _version: 6 },
                })
            )
            .mockImplementation(setupFetchStub({}));

        await expect(handler(mockEvent)).rejects.toThrow("test error");

        const deleteUserCalls = cognitoMock.commandCalls(
            AdminDeleteUserCommand
        );
        expect(deleteUserCalls).toHaveLength(1);
        expect(deleteUserCalls[0].args[0].input).toEqual({
            UserPoolId: "some_pool",
            Username: "testUsername",
        });

        expect(lambda.request).toHaveBeenCalledWith(
            {
                query: queries.getUser,
                variables: { id: "testUserId" },
            },
            GRAPHQL_ENDPOINT
        );
        expect(lambda.request).toHaveBeenCalledWith(
            {
                query: mutations.deleteUser,
                variables: { input: { id: "deleteUserId", _version: 5 } },
            },
            GRAPHQL_ENDPOINT
        );
        expect(lambda.request).toHaveBeenCalledWith(
            {
                query: queries.getTenant,
                variables: { id: "testTenantId" },
            },
            GRAPHQL_ENDPOINT
        );
        expect(lambda.request).toHaveBeenCalledWith(
            {
                query: mutations.deleteTenant,
                variables: { input: { id: "deleteTenantId", _version: 6 } },
            },
            GRAPHQL_ENDPOINT
        );
    });

    test("clean up the user when the tenant name is too short", async () => {
        lambda.request
            .mockImplementationOnce(setupFetchStub(fakeCreatedUser))
            .mockImplementationOnce(
                setupFetchStub({
                    getUser: { id: "deleteUserId", _version: 5 },
                })
            )
            .mockImplementation(setupFetchStub({}));

        await expect(
            handler({ ...mockEvent, tenantName: "a b" })
        ).rejects.toThrow(
            "tenantName must be at least 4 characters without whitespace"
        );

        // the cognito user was never created so it should not be deleted
        expect(cognitoMock.commandCalls(AdminCreateUserCommand)).toHaveLength(
            0
        );
        expect(cognitoMock.commandCalls(AdminDeleteUserCommand)).toHaveLength(
            0
        );

        expect(lambda.request).toHaveBeenCalledWith(
            {
                query: mutations.deleteUser,
                variables: { input: { id: "deleteUserId", _version: 5 } },
            },
            GRAPHQL_ENDPOINT
        );
        // no tenant was created so there is nothing to look up or delete
        expect(lambda.request).not.toHaveBeenCalledWith(
            {
                query: queries.getTenant,
                variables: { id: expect.any(String) },
            },
            GRAPHQL_ENDPOINT
        );
    });
});
