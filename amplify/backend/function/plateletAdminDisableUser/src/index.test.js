const indexModule = require("./index");
const aws = require("aws-sdk");

const mockUser = {
    id: "userId",
    username: "username",
    tenantId: "tenantId",
    disabled: 0,
    _version: 1,
    _deleted: null,
    _lastChangedAt: 1620000000000,
};

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
            updateUser: "updateUserMutation",
        };
    },
    { virtual: true }
);
jest.mock(
    "/opt/graphql/queries",
    () => {
        return {
            getUser: "getUserQuery",
        };
    },
    { virtual: true }
);

const appsyncModule = require("/opt/appSyncRequest");

// mock CognitoIdentityServiceProvider class
//
const cognitoIdentityServiceProvider = Object.getPrototypeOf(
    new aws.CognitoIdentityServiceProvider()
);
describe("plateletAdminDisableUser", () => {
    afterEach(() => jest.resetAllMocks());
    test("disable a user", async () => {
        appsyncModule.request
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        getUser: mockUser,
                    },
                }),
            })
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        updateUser: { ...mockUser, disabled: 1 },
                    },
                }),
            });
        const cognitoDisableUserSpy = jest
            .spyOn(cognitoIdentityServiceProvider, "adminDisableUser")
            .mockReturnValue({
                promise: () => Promise.resolve(),
            });
        const cognitoSignOutUserSpy = jest
            .spyOn(cognitoIdentityServiceProvider, "adminUserGlobalSignOut")
            .mockReturnValue({
                promise: () => Promise.resolve(),
            });
        await indexModule.handler({ arguments: { userId: "userId" } });
        expect(appsyncModule.request).toMatchSnapshot();
        expect(cognitoDisableUserSpy).toHaveBeenCalledWith({
            UserPoolId: "somePoolId",
            Username: "username",
        });
        expect(cognitoSignOutUserSpy).toHaveBeenCalledWith({
            UserPoolId: "somePoolId",
            Username: "username",
        });
    });
    test("disable a user appsync failure", async () => {
        appsyncModule.request
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        getUser: mockUser,
                    },
                }),
            })
            .mockRejectedValueOnce(new Error("error"));
        jest.spyOn(
            cognitoIdentityServiceProvider,
            "adminDisableUser"
        ).mockReturnValue({
            promise: () => Promise.resolve(),
        });
        const cognitoEnableUserSpy = jest
            .spyOn(cognitoIdentityServiceProvider, "adminEnableUser")
            .mockReturnValue({
                promise: () => Promise.resolve(),
            });
        jest.spyOn(
            cognitoIdentityServiceProvider,
            "adminUserGlobalSignOut"
        ).mockReturnValue({
            promise: () => Promise.resolve(),
        });
        await expect(
            indexModule.handler({ arguments: { userId: "userId" } })
        ).rejects.toThrow();
        expect(appsyncModule.request).toMatchSnapshot();
        expect(cognitoEnableUserSpy).toHaveBeenCalledWith({
            UserPoolId: "somePoolId",
            Username: "username",
        });
    });
});
