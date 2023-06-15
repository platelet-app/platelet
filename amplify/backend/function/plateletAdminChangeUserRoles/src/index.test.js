const indexModule = require("./index");
const aws = require("aws-sdk");

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

// mock CognitoIdentityServiceProvider class
//
const cognitoIdentityServiceProvider = Object.getPrototypeOf(
    new aws.CognitoIdentityServiceProvider()
);

const appsyncModule = require("/opt/appSyncRequest");

const userId = "userId";

describe("index.js", () => {
    afterEach(() => jest.resetAllMocks());
    test("changing a user's roles", async () => {
        appsyncModule.request
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        getUser: {
                            id: userId,
                            username: "username",
                            _version: 1,
                            roles: ["USER"],
                        },
                    },
                }),
            })
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        updateUser: {
                            id: userId,
                            username: "username",
                            _version: 2,
                            roles: [],
                        },
                    },
                }),
            })
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        updateUser: {
                            username: "username",
                            id: userId,
                            _version: 2,
                            roles: ["ADMIN", "RIDER", "USER"],
                        },
                    },
                }),
            });

        jest.spyOn(
            cognitoIdentityServiceProvider,
            "adminAddUserToGroup"
        ).mockReturnValue({
            promise: () => Promise.resolve(),
        });
        jest.spyOn(
            cognitoIdentityServiceProvider,
            "adminRemoveUserFromGroup"
        ).mockReturnValue({
            promise: () => Promise.resolve(),
        });
        jest.spyOn(
            cognitoIdentityServiceProvider,
            "adminListGroupsForUser"
        ).mockReturnValue({
            promise: () =>
                Promise.resolve({
                    Groups: [
                        { GroupName: "ADMIN" },
                        { GroupName: "RIDER" },
                        { GroupName: "USER" },
                    ],
                }),
        });

        await indexModule.handler({
            arguments: { userId, roles: ["ADMIN", "RIDER", "USER"] },
        });
        expect(appsyncModule.request).toMatchSnapshot();
    });
    test("changing a user's roles cognito failure and clean up", async () => {
        appsyncModule.request
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        getUser: {
                            id: userId,
                            username: "username",
                            _version: 1,
                            roles: ["USER"],
                        },
                    },
                }),
            })
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        updateUser: {
                            id: userId,
                            username: "username",
                            _version: 2,
                            roles: [],
                        },
                    },
                }),
            })
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        updateUser: {
                            username: "username",
                            id: userId,
                            _version: 2,
                            roles: ["ADMIN", "RIDER", "USER"],
                        },
                    },
                }),
            })
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        updateUser: {
                            id: userId,
                            username: "username",
                            _version: 2,
                            roles: [],
                        },
                    },
                }),
            })
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        updateUser: {
                            username: "username",
                            id: userId,
                            _version: 2,
                            roles: ["USER"],
                        },
                    },
                }),
            });

        const adminAddUserToGroupSpy = jest
            .spyOn(cognitoIdentityServiceProvider, "adminAddUserToGroup")
            .mockReturnValue({
                promise: () => Promise.resolve(),
            });
        const adminRemoveUserFromGroupSpy = jest
            .spyOn(cognitoIdentityServiceProvider, "adminRemoveUserFromGroup")
            .mockReturnValue({
                promise: () => Promise.resolve(),
            });
        const adminListGroupsForUserSpy = jest
            .spyOn(cognitoIdentityServiceProvider, "adminListGroupsForUser")
            .mockReturnValue({
                promise: () =>
                    Promise.resolve({
                        Groups: [{ GroupName: "RIDER" }, { GroupName: "USER" }],
                    }),
            })
            .mockReturnValue({
                promise: () =>
                    Promise.resolve({
                        Groups: [{ GroupName: "USER" }],
                    }),
            });

        await expect(
            indexModule.handler({
                arguments: { userId, roles: ["ADMIN", "RIDER", "USER"] },
            })
        ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"Roles not updated correctly on cognito"`
        );
        expect(appsyncModule.request).toMatchSnapshot();
        expect(adminAddUserToGroupSpy).toMatchSnapshot();
        expect(adminRemoveUserFromGroupSpy).toMatchSnapshot();
        expect(adminListGroupsForUserSpy).toMatchSnapshot();
    });
});
