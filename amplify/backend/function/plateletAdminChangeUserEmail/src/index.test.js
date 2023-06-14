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

describe("plateletAdminChangeUserEmail", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("change the user's email", async () => {
        const user = {
            id: userId,
            _version: 1,
            contact: {
                emailAddress: "originalEmail@example.com",
            },
            username: "username",
        };
        const emailAddress = "some@email.com";
        const appsyncResponse = {
            id: userId,
            _version: 2,
            username: "username",
            contact: {
                emailAddress,
            },
        };
        const cognitoSpy = jest
            .spyOn(cognitoIdentityServiceProvider, "adminUpdateUserAttributes")
            .mockReturnValue({
                promise: () => Promise.resolve(),
            });
        const cognitoListUsersSpy = jest
            .spyOn(cognitoIdentityServiceProvider, "listUsers")
            .mockReturnValue({
                promise: () => Promise.resolve({ Users: [] }),
            });
        appsyncModule.request
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        getUser: user,
                    },
                }),
            })
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        updateUser: {
                            id: userId,
                            username: "username",
                            contact: {
                                emailAddress,
                            },
                            _version: 2,
                        },
                    },
                }),
            });
        const result = await indexModule.handler({
            arguments: { userId, emailAddress },
        });
        expect(result).toEqual(appsyncResponse);
        expect(appsyncModule.request).toMatchSnapshot();
        expect(cognitoSpy).toMatchSnapshot();
        expect(cognitoListUsersSpy).toMatchSnapshot();
    });
    test("change the user's email appsync failure", async () => {
        const user = {
            id: userId,
            _version: 1,
            contact: {
                emailAddress: "originalEmail@example.com",
            },
            username: "username",
        };
        const emailAddress = "some@email.com";
        const cognitoSpy = jest
            .spyOn(cognitoIdentityServiceProvider, "adminUpdateUserAttributes")
            .mockReturnValue({
                promise: () => Promise.resolve(),
            });
        jest.spyOn(cognitoIdentityServiceProvider, "listUsers").mockReturnValue(
            {
                promise: () => Promise.resolve({ Users: [] }),
            }
        );
        appsyncModule.request
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        getUser: user,
                    },
                }),
            })
            .mockRejectedValueOnce(new Error("appsync failure"));
        await expect(
            indexModule.handler({
                arguments: { userId, emailAddress },
            })
        ).rejects.toThrow("appsync failure");
        expect(appsyncModule.request).toMatchSnapshot();
        expect(cognitoSpy).toMatchSnapshot();
    });
    test("fail changing the user's email to an existing email", async () => {
        const emailAddress = "some@email.com";
        const cognitoListUsersSpy = jest
            .spyOn(cognitoIdentityServiceProvider, "listUsers")
            .mockReturnValue({
                promise: () =>
                    Promise.resolve({ Users: [{ Username: "username" }] }),
            });
        await expect(
            indexModule.handler({
                arguments: { userId, emailAddress },
            })
        ).rejects.toThrow("Email address already in use");
        expect(cognitoListUsersSpy).toMatchSnapshot();
    });
});
