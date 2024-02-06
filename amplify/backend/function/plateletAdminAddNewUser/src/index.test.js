const handler = require("./index").handler;
const awssdk = require("aws-sdk");

const mockCognitoResponse = {
    User: {
        Attributes: [
            {
                Name: "sub",
                Value: "testSubId",
            },
        ],
    },
};

const mockUsers = {
    data: {
        listUsers: {
            items: [
                { displayName: "Someone Person" },
                { displayName: "Another Individual" },
                { displayName: "Another Individual-1" },
            ],
        },
    },
};

const mockNewUserResult = {
    data: {
        createUser: {
            id: "testUserId",
            displayName: "New User",
            name: "New User",
            tenantId: "testTenantId",
            cognitoId: "testCognitoId",
            contact: {
                emailAddress: "testEmailAddress@test.com",
            },
        },
    },
};

const mockEmailParams = {
    Destination: {
        ToAddresses: ["test@test.com"],
    },
    Message: {
        Body: {
            Html: {
                Charset: "UTF-8",
                Data: expect.any(String),
            },
            Text: {
                Charset: "UTF-8",
                Data: expect.any(String),
            },
        },
        Subject: {
            Charset: "UTF-8",
            Data: "Welcome to Platelet!",
        },
    },
    Source: "welcome@test.com",
    ReplyToAddresses: ["welcome@test.com"],
    ReturnPath: "welcome@test.com",
};

const errorCheck = (body) => {
    if (body?.errors) {
        console.error(body?.errors);
        throw new Error(body?.errors[0].message);
    }
};

jest.mock(
    "/opt/appSyncRequest",
    () => {
        return {
            request: jest.fn(),
            errorCheck,
        };
    },
    { virtual: true }
);
jest.mock(
    "/opt/graphql/mutations",
    () => {
        return {
            createUser: "createUserMutation",
        };
    },
    { virtual: true }
);
jest.mock(
    "/opt/graphql/queries",
    () => {
        return {
            listUsers: "listUsersQuery",
        };
    },
    { virtual: true }
);
jest.mock(
    "/opt/sendWelcomeEmail",
    () => {
        return {
            sendWelcomeEmail: jest.fn(),
        };
    },
    { virtual: true }
);

const username = "aa154086-8a21-4ff2-920e-c1c28052c8b8";

jest.mock("uuid", () => ({ v4: () => username }));

const appsyncModule = require("/opt/appSyncRequest");
const sendWelcomeEmail = require("/opt/sendWelcomeEmail");

jest.mock("aws-sdk", () => {
    return {
        CognitoIdentityServiceProvider: class {
            adminCreateUser() {
                return this;
            }
            adminAddUserToGroup() {
                return this;
            }
            adminDisableUser() {
                return this;
            }
            adminDeleteUser() {
                return this;
            }
            promise() {
                return Promise.resolve(mockCognitoResponse);
            }
        },
        SES: class {
            sendEmail() {
                return this;
            }
            promise() {
                return Promise.resolve();
            }
        },
    };
});

jest.mock("aws-appsync", () => {
    return {
        ...jest.requireActual("aws-appsync"),
        default: class {
            mutate() {
                return Promise.resolve(mockNewUserResult);
            }
            query() {
                return Promise.resolve(mockUsers);
            }
        },
    };
});

describe("plateletAdminAddNewUser", () => {
    beforeEach(() => {
        jest.resetModules();
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it("should return a function", () => {
        expect(typeof handler).toBe("function");
    });

    test("add a new user", async () => {
        const cognitoSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminCreateUser"
        );
        const cognitoGroupsSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminAddUserToGroup"
        );
        const mockEvent = {
            arguments: {
                name: "test user",
                email: "test@taaaest.com",
                roles: ["USER", "COORDINATOR", "ADMIN"],
                tenantId: "testTenantId",
            },
        };

        appsyncModule.request
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        listUsers: { items: [] },
                    },
                }),
            })
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        createUser: {
                            id: "testUserId",
                            username,
                            _version: 1,
                            roles: [],
                        },
                    },
                }),
            });

        await handler(mockEvent);
        expect(cognitoSpy).toHaveBeenCalledWith({
            ForceAliasCreation: false,
            UserAttributes: [
                {
                    Name: "email",
                    Value: mockEvent.arguments.email,
                },
                {
                    Name: "email_verified",
                    Value: "true",
                },
            ],
            UserPoolId: "testPoolId",
            TemporaryPassword: expect.stringMatching(/^[\w+]{8}$/),
            MessageAction: "SUPPRESS",
            Username: username,
        });
        expect(cognitoGroupsSpy).toHaveBeenCalledWith({
            UserPoolId: "testPoolId",
            Username: username,
            GroupName: "USER",
        });
        expect(cognitoGroupsSpy).toHaveBeenCalledWith({
            UserPoolId: "testPoolId",
            Username: username,
            GroupName: "COORDINATOR",
        });
        expect(appsyncModule.request).toMatchSnapshot();
    });
    test("add a new user with non-unique name", async () => {
        const cognitoSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminCreateUser"
        );
        const mockEvent = {
            arguments: {
                name: "Another Individual",
                email: "test@test.com",
                roles: ["USER"],
                tenantId: "testTenantId",
            },
        };
        appsyncModule.request
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        listUsers: {
                            items: [
                                {
                                    id: "someAlreadyId",
                                    displayName: "Another Individual",
                                },
                            ],
                        },
                    },
                }),
            })
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        createUser: {
                            id: "testUserId",
                            username,
                            _version: 1,
                            roles: [],
                        },
                    },
                }),
            });
        await handler(mockEvent);
        expect(cognitoSpy).toHaveBeenCalledWith({
            ForceAliasCreation: false,
            UserAttributes: [
                {
                    Name: "email",
                    Value: mockEvent.arguments.email,
                },
                {
                    Name: "email_verified",
                    Value: "true",
                },
            ],
            TemporaryPassword: expect.stringMatching(/^[\w+]{8}$/),
            MessageAction: "SUPPRESS",
            UserPoolId: "testPoolId",
            Username: username,
        });
        expect(appsyncModule.request).toMatchSnapshot();
    });

    test("clean up on appsync network failure", async () => {
        const cognitoSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminCreateUser"
        );
        const cognitoDisableSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminDisableUser"
        );
        const cognitoDeleteSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminDeleteUser"
        );
        const mockEvent = {
            arguments: {
                name: "Another Individual",
                email: "test@test.com",
                roles: ["USER"],
                tenantId: "testTenantId",
            },
        };
        appsyncModule.request
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        listUsers: {
                            items: [],
                        },
                    },
                }),
            })
            .mockRejectedValue("Some error");
        await expect(handler(mockEvent)).rejects.toEqual("Some error");
        expect(cognitoSpy).toHaveBeenCalledTimes(1);
        expect(cognitoDeleteSpy).toHaveBeenCalledWith({
            UserPoolId: "testPoolId",
            Username: username,
        });
        expect(cognitoDisableSpy).toHaveBeenCalledWith({
            UserPoolId: "testPoolId",
            Username: username,
        });
    });
    test("clean up on appsync failure", async () => {
        const cognitoSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminCreateUser"
        );
        const cognitoDisableSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminDisableUser"
        );
        const cognitoDeleteSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminDeleteUser"
        );
        const mockEvent = {
            arguments: {
                name: "Another Individual",
                email: "test@test.com",
                roles: ["USER"],
                tenantId: "testTenantId",
            },
        };
        appsyncModule.request
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        listUsers: {
                            items: [],
                        },
                    },
                }),
            })
            .mockResolvedValue({
                json: () => ({
                    data: null,
                    errors: [
                        {
                            errorType: "Unauthorized",
                            message: "Not Authorized",
                        },
                    ],
                }),
            });

        await expect(handler(mockEvent)).rejects.toEqual(
            new Error("Not Authorized")
        );
        expect(cognitoSpy).toHaveBeenCalledTimes(1);
        expect(cognitoDeleteSpy).toHaveBeenCalledWith({
            UserPoolId: "testPoolId",
            Username: username,
        });
        expect(cognitoDisableSpy).toHaveBeenCalledWith({
            UserPoolId: "testPoolId",
            Username: username,
        });
    });
    test("clean up on email failure", async () => {
        const cognitoSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminCreateUser"
        );
        const cognitoDisableSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminDisableUser"
        );
        const cognitoDeleteSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminDeleteUser"
        );
        sendWelcomeEmail.sendWelcomeEmail.mockRejectedValue("Some error");
        const mockEvent = {
            arguments: {
                name: "Another Individual",
                email: "test@test.com",
                roles: ["USER"],
                tenantId: "testTenantId",
            },
        };
        appsyncModule.request
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        listUsers: {
                            items: [],
                        },
                    },
                }),
            })
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        createUser: {
                            id: "testUserId",
                            username,
                            _version: 1,
                            roles: [],
                        },
                    },
                }),
            })
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        deleteUser: {
                            id: "testUserId",
                            username,
                            _version: 1,
                            roles: [],
                        },
                    },
                }),
            });
        await expect(handler(mockEvent)).rejects.toEqual("Some error");
        expect(cognitoSpy).toHaveBeenCalledTimes(1);
        expect(cognitoDeleteSpy).toHaveBeenCalledWith({
            UserPoolId: "testPoolId",
            Username: username,
        });
        expect(cognitoDisableSpy).toHaveBeenCalledWith({
            UserPoolId: "testPoolId",
            Username: username,
        });
        expect(appsyncModule.request).toMatchSnapshot();
    });
});
