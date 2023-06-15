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
    "/opt/graphql/queries",
    () => {
        return {
            getUser: "getUser",
        };
    },
    { virtual: true }
);

const appsyncModule = require("/opt/appSyncRequest");

jest.mock(
    "/opt/sendWelcomeEmail",
    () => {
        return {
            sendWelcomeEmail: jest.fn(),
        };
    },
    { virtual: true }
);

const sendWelcomeModule = require("/opt/sendWelcomeEmail");
// mock CognitoIdentityServiceProvider class
//
const cognitoIdentityServiceProvider = Object.getPrototypeOf(
    new aws.CognitoIdentityServiceProvider()
);

describe("plateletAdminResetUserPassword", () => {
    const originalRandom = global.Math.random;
    afterEach(() => {
        global.Math.random = originalRandom;
    });
    beforeEach(() => {
        global.Math.random = () => 0.5;
    });
    test("reset the user's password", async () => {
        const event = {
            arguments: {
                userId: "user-id",
            },
        };
        appsyncModule.request.mockReturnValueOnce({
            json: () => ({
                data: {
                    getUser: {
                        name: "Some name",
                        contact: {
                            emailAddress: "some@example.com",
                        },
                        username: "someusername",
                    },
                },
            }),
        });
        jest.spyOn(
            cognitoIdentityServiceProvider,
            "adminSetUserPassword"
        ).mockReturnValue({
            promise: () => Promise.resolve(),
        });
        await indexModule.handler(event);
        expect(appsyncModule.request).toMatchSnapshot();
        expect(sendWelcomeModule.sendWelcomeEmail).toMatchSnapshot();
    });
});
