const handler = require("./index").handler;
const appSyncClient = require("aws-appsync");
const awssdk = require("aws-sdk");
const createUser = require("./createUser").createUser;
const deleteUser = require("./deleteUser").deleteUser;
const listUsers = require("./listUsers").listUsers;

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

jest.mock("aws-sdk", () => {
    return {
        CognitoIdentityServiceProvider: class {
            adminCreateUser() {
                return this;
            }
            adminAddUserToGroup() {
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
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV }; // Make a copy
    });

    afterEach(() => jest.clearAllMocks());

    it("should return a function", () => {
        expect(typeof handler).toBe("function");
    });

    test("add a new user", async () => {
        process.env.NODE_ENV = "dev";
        process.env.AUTH_PLATELET61A0AC07_USERPOOLID = "testPoolId";
        process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT = "testEndpoint";
        process.env.PLATELET_WELCOME_EMAIL = "welcome@test.com";
        process.env.PLATELET_DOMAIN_NAME = "test.com";
        const cognitoSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminCreateUser"
        );
        const cognitoGroupsSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminAddUserToGroup"
        );
        const appSyncMutateSpy = jest.spyOn(
            appSyncClient.default.prototype,
            "mutate"
        );
        const appSyncQuerySpy = jest.spyOn(
            appSyncClient.default.prototype,
            "query"
        );
        const SESSpy = jest.spyOn(awssdk.SES.prototype, "sendEmail");
        const mockEvent = {
            arguments: {
                name: "test user",
                email: "test@test.com",
                roles: ["USER", "COORDINATOR"],
                tenantId: "testTenantId",
            },
        };
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
                {
                    Name: "custom:tenantId",
                    Value: mockEvent.arguments.tenantId,
                },
            ],
            UserPoolId: "testPoolId",
            TemporaryPassword: expect.stringMatching(/^[\w+]{8}$/),
            MessageAction: "SUPPRESS",
            Username: expect.any(String),
        });
        const createUserInput = {
            tenantId: mockEvent.arguments.tenantId,
            active: 1,
            cognitoId: "testSubId",
            name: mockEvent.arguments.name,
            displayName: mockEvent.arguments.name,
            roles: ["USER", "COORDINATOR"],
            contact: { emailAddress: mockEvent.arguments.email },
            username: expect.any(String),
        };
        expect(appSyncMutateSpy).toHaveBeenCalledWith({
            mutation: createUser,
            variables: { input: createUserInput },
        });
        expect(appSyncQuerySpy).toHaveBeenCalledWith({
            query: listUsers,
            variables: { tenantId: mockEvent.arguments.tenantId },
        });
        expect(cognitoGroupsSpy).toHaveBeenCalledWith({
            UserPoolId: "testPoolId",
            Username: expect.any(String),
            GroupName: "USER",
        });
        expect(cognitoGroupsSpy).toHaveBeenCalledWith({
            UserPoolId: "testPoolId",
            Username: expect.any(String),
            GroupName: "COORDINATOR",
        });
        expect(SESSpy).toHaveBeenCalledWith(mockEmailParams);
    });
    test("add a new user with non-unique name", async () => {
        process.env.NODE_ENV = "dev";
        process.env.AUTH_PLATELET61A0AC07_USERPOOLID = "testPoolId";
        process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT = "testEndpoint";
        process.env.PLATELET_WELCOME_EMAIL = "welcome@test.com";
        process.env.PLATELET_DOMAIN_NAME = "test.com";
        const cognitoSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminCreateUser"
        );
        const appSyncMutateSpy = jest.spyOn(
            appSyncClient.default.prototype,
            "mutate"
        );
        const appSyncQuerySpy = jest.spyOn(
            appSyncClient.default.prototype,
            "query"
        );
        const SESSpy = jest.spyOn(awssdk.SES.prototype, "sendEmail");
        const mockEvent = {
            arguments: {
                name: "Another Individual",
                email: "test@test.com",
                roles: ["USER"],
                tenantId: "testTenantId",
            },
        };
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
                {
                    Name: "custom:tenantId",
                    Value: mockEvent.arguments.tenantId,
                },
            ],
            TemporaryPassword: expect.stringMatching(/^[\w+]{8}$/),
            MessageAction: "SUPPRESS",
            UserPoolId: "testPoolId",
            Username: expect.any(String),
        });
        const createUserInput = {
            tenantId: mockEvent.arguments.tenantId,
            active: 1,
            cognitoId: "testSubId",
            name: mockEvent.arguments.name,
            displayName: `${mockEvent.arguments.name}-2`,
            roles: ["USER"],
            contact: { emailAddress: mockEvent.arguments.email },
            username: expect.any(String),
        };
        expect(appSyncMutateSpy).toHaveBeenCalledWith({
            mutation: createUser,
            variables: { input: createUserInput },
        });
        expect(appSyncQuerySpy).toHaveBeenCalledWith({
            query: listUsers,
            variables: { tenantId: mockEvent.arguments.tenantId },
        });
        expect(SESSpy).toHaveBeenCalledWith(mockEmailParams);
        expect(appSyncMutateSpy).toHaveBeenCalledTimes(1);
        expect(appSyncQuerySpy).toHaveBeenCalledTimes(1);
        expect(SESSpy).toHaveBeenCalledTimes(1);
    });

    // throw an error in index.js in the send email function
    // and remove throw e from the catch block
    // can't get this to automate properly, but it verifies it works
    test.skip("clean up on failure", async () => {
        process.env.NODE_ENV = "dev";
        process.env.AUTH_PLATELET61A0AC07_USERPOOLID = "testPoolId";
        process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT = "testEndpoint";
        process.env.PLATELET_WELCOME_EMAIL = "welcome@test.com";
        process.env.PLATELET_DOMAIN_NAME = "test.com";
        const cognitoSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminCreateUser"
        );
        const cognitoDeleteSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminDeleteUser"
        );
        const appSyncMutateSpy = jest.spyOn(
            appSyncClient.default.prototype,
            "mutate"
        );
        const mockEvent = {
            arguments: {
                name: "Another Individual",
                email: "test@test.com",
                roles: ["USER"],
                tenantId: "testTenantId",
            },
        };
        await handler(mockEvent);
        expect(appSyncMutateSpy).toHaveBeenCalledTimes(2);
        expect(appSyncMutateSpy).toHaveBeenCalledWith({
            mutation: deleteUser,
            variables: {
                input: {
                    id: expect.any(String),
                    _version: 1,
                },
            },
        });
        expect(cognitoSpy).toHaveBeenCalledTimes(1);
        expect(cognitoDeleteSpy).toHaveBeenCalledTimes(1);
    });
});
