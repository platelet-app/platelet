const handler = require("./index").handler;
const awssdk = require("aws-sdk");

jest.mock(
    "/opt/appSyncRequest",
    () => {
        return {
            request: jest.fn(),
            errorCheck: jest.fn(),
        };
    },
    { virtual: true }
);
jest.mock(
    "/opt/graphql/mutations",
    () => {
        return {
            createUser: "createUserMutation",
            createTenant: "createTenantMutation",
            updateUser: "updateUserMutation",
        };
    },
    { virtual: true }
);
jest.mock(
    "/opt/graphql/queries",
    () => {
        return {
            listUsers: "listUsersQuery",
            listTenants: "listTenantsQuery",
        };
    },
    { virtual: true }
);

const appsyncModule = require("/opt/appSyncRequest");

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

const mockUpdateUserResult = {
    data: {
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
            _version: 1,
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
            cognitoId: "someCognitoId",
            username: "testUsername",
            contact: {
                emailAddress: "test@test.com",
            },
            _version: 1,
        },
    },
};

const mockTenantResult = {
    data: {
        createTenant: {
            id: "testTenantId",
            name: "test tenant",
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
            adminUpdateUserAttributes() {
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

describe("plateletAddNewTenant", () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV }; // Make a copy
    });

    afterEach(() => jest.clearAllMocks());

    it("should return a function", () => {
        expect(typeof handler).toBe("function");
    });

    test("add a new tenant", async () => {
        jest.spyOn(appsyncModule, "request")
            .mockResolvedValueOnce({ json: () => mockNewUserResult })
            .mockResolvedValueOnce({ json: () => mockTenantResult })
            .mockResolvedValueOnce({ json: () => mockUpdateUserResult });
        const cognitoSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminCreateUser"
        );
        const cognitoAdminUpdateUserAttributesSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminUpdateUserAttributes"
        );
        const cognitoGroupsSpy = jest.spyOn(
            awssdk.CognitoIdentityServiceProvider.prototype,
            "adminAddUserToGroup"
        );
        const requestSpy = jest.spyOn(appsyncModule, "request");
        const SESSpy = jest.spyOn(awssdk.SES.prototype, "sendEmail");
        const mockEvent = {
            arguments: {
                name: "New User",
                emailAddress: "test@test.com",
                tenantName: "test tenant",
            },
        };
        const result = await handler(mockEvent);
        expect(cognitoSpy).toHaveBeenCalledWith({
            DesiredDeliveryMediums: ["EMAIL"],
            ForceAliasCreation: false,
            UserAttributes: [
                {
                    Name: "email",
                    Value: mockEvent.arguments.emailAddress,
                },
                {
                    Name: "email_verified",
                    Value: "true",
                },
            ],
            UserPoolId: "testPoolId",
            TemporaryPassword: expect.stringMatching(/^[\w+]{8}$/),
            MessageAction: "SUPPRESS",
            Username: expect.any(String),
        });
        const createUserInput = {
            cognitoId: expect.any(String),
            name: mockEvent.arguments.name,
            displayName: mockEvent.arguments.name,
            roles: ["USER", "ADMIN", "COORDINATOR"],
            isPrimaryAdmin: 1,
            disabled: 0,
            contact: { emailAddress: mockEvent.arguments.emailAddress },
            username: expect.any(String),
            tenantId: expect.any(String),
        };
        const createTenantInput = {
            name: mockEvent.arguments.tenantName,
            referenceIdentifier: "test",
            tenantAdminId: "testUserId",
        };
        const updateUserInput = {
            id: "testUserId",
            cognitoId: "testSubId",
            _version: 1,
            tenantId: "testTenantId",
        };

        expect(requestSpy).toHaveBeenCalledWith(
            {
                query: "createUserMutation",
                variables: { input: createUserInput },
            },
            "testEndpoint"
        );
        expect(requestSpy).toHaveBeenCalledWith(
            {
                query: "createTenantMutation",
                variables: { input: createTenantInput },
            },
            "testEndpoint"
        );
        expect(requestSpy).toHaveBeenNthCalledWith(
            3,
            {
                query: "updateUserMutation",
                variables: { input: updateUserInput },
            },
            "testEndpoint"
        );
        for (const group of ["USER", "ADMIN", "COORDINATOR"]) {
            expect(cognitoGroupsSpy).toHaveBeenCalledWith({
                GroupName: group,
                UserPoolId: "testPoolId",
                Username: expect.any(String),
            });
        }
        expect(cognitoAdminUpdateUserAttributesSpy).toHaveBeenCalledWith({
            UserAttributes: [
                {
                    Name: "email",
                    Value: mockEvent.arguments.emailAddress,
                },
                {
                    Name: "email_verified",
                    Value: "true",
                },
            ],
            UserPoolId: "testPoolId",
            Username: "testUsername",
        });
        expect(SESSpy).toHaveBeenCalledWith(mockEmailParams);
        expect(result).toEqual({
            id: "testTenantId",
            name: mockEvent.arguments.tenantName,
            admin: {
                id: "testUserId",
                name: mockEvent.arguments.name,
                displayName: mockEvent.arguments.name,
                tenantId: "testTenantId",
                cognitoId: "testSubId",
                username: expect.any(String),
                contact: {
                    emailAddress: mockEvent.arguments.emailAddress,
                },
                _version: 1,
            },
        });
    });
});
