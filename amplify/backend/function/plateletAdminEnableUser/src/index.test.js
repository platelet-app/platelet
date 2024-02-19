const indexModule = require("./index");
const aws = require("aws-sdk");

const mockUser = {
    id: "userId",
    username: "username",
    tenantId: "tenantId",
    disabled: 1,
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
describe("plateletAdminEnableUser", () => {
    afterEach(() => jest.resetAllMocks());
    test("enable a user", async () => {
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
            .spyOn(cognitoIdentityServiceProvider, "adminEnableUser")
            .mockReturnValue({
                promise: () => Promise.resolve(),
            });
        await indexModule.handler({ arguments: { userId: "userId" } });
        expect(appsyncModule.request).toMatchSnapshot();
        expect(cognitoDisableUserSpy).toMatchSnapshot();
    });
    test("enable a user appsync failure", async () => {
        appsyncModule.request
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        getUser: mockUser,
                    },
                }),
            })
            .mockRejectedValueOnce(new Error("error"));
        const cognitoEnableUserSpy = jest
            .spyOn(cognitoIdentityServiceProvider, "adminEnableUser")
            .mockReturnValue({
                promise: () => Promise.resolve(),
            });
        const cognitoDisableUserSpy = jest
            .spyOn(cognitoIdentityServiceProvider, "adminDisableUser")
            .mockReturnValue({
                promise: () => Promise.resolve(),
            });
        await expect(
            indexModule.handler({ arguments: { userId: "userId" } })
        ).rejects.toThrow();
        expect(appsyncModule.request).toMatchSnapshot();
        expect(cognitoEnableUserSpy).toMatchSnapshot();
        expect(cognitoDisableUserSpy).toMatchSnapshot();
    });
});
