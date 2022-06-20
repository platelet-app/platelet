const plateletProfilePictureUploadURLResolver = require("./index").handler;
const s3RequestPresigner = require("@aws-sdk/s3-request-presigner");
const s3 = require("@aws-sdk/client-s3");
const AWS = require("aws-sdk/global");
const appsync = require("aws-appsync");

const event = {
    identity: {
        claims: {
            "cognito:groups": ["USER"],
            sub: "testSubId",
        },
    },
    arguments: { userId: "testId" },
};

jest.mock("aws-appsync", () => {
    return {
        ...jest.requireActual("aws-appsync"),
        default: class {
            query() {
                return this;
            }
        },
    };
});

const beginString = `https://s3.${process.env.REGION}.amazonaws.com/${process.env.STORAGE_PLATELETSTORAGE_BUCKETNAME}/public/${event.arguments.userId}.jpg`;

describe("platelet profile picture upload URL resolver", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
        process.env = { ...OLD_ENV };
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });
    it("should generate a url for their own picture", async () => {
        const querySpy = jest
            .spyOn(appsync.default.prototype, "query")
            .mockResolvedValueOnce({
                data: {
                    getUser: {
                        id: "testId",
                        cognitoId: "testSubId",
                    },
                },
            });
        const result = await plateletProfilePictureUploadURLResolver(event);
        expect(querySpy).toHaveBeenCalled();
        expect(result.startsWith(beginString)).toBe(true);
    });

    it("reject if they are the wrong user", async () => {
        jest.spyOn(appsync.default.prototype, "query").mockResolvedValueOnce({
            data: {
                getUser: {
                    id: "testIdNope",
                    cognitoId: "testSubIdNope",
                },
            },
        });
        await expect(
            plateletProfilePictureUploadURLResolver(event)
        ).rejects.toEqual("User is not authorized");
    });

    it("should generate a url if they are an admin", async () => {
        const querySpy = jest
            .spyOn(appsync.default.prototype, "query")
            .mockResolvedValueOnce({
                data: {
                    getUser: {
                        id: "testId",
                        cognitoId: "testSubId",
                        tenantId: "testTenantId",
                    },
                },
            })
            .mockResolvedValue({
                data: {
                    getUserByCognitoId: {
                        items: [
                            {
                                id: "testIdAdmin",
                                cognitoId: "testSubIdAdmin",
                                tenantId: "testTenantId",
                            },
                        ],
                    },
                },
            });

        const result = await plateletProfilePictureUploadURLResolver({
            ...event,
            identity: {
                claims: {
                    ...event.identity.claims,
                    "cognito:groups": ["ADMIN"],
                },
            },
        });
        expect(querySpy).toHaveBeenCalledTimes(2);
        expect(result.startsWith(beginString)).toBe(true);
    });

    it("reject admin if they are of the wrong tenant", async () => {
        jest.spyOn(appsync.default.prototype, "query")
            .mockResolvedValueOnce({
                data: {
                    getUser: {
                        id: "testId",
                        cognitoId: "testSubId",
                        tenantId: "testTenantId",
                    },
                },
            })
            .mockResolvedValue({
                data: {
                    getUserByCognitoId: {
                        items: [
                            {
                                id: "testIdAdmin",
                                cognitoId: "testSubIdAdmin",
                                tenantId: "testTenantIdNope",
                            },
                        ],
                    },
                },
            });

        await expect(
            plateletProfilePictureUploadURLResolver({
                ...event,
                identity: {
                    claims: {
                        ...event.identity.claims,
                        "cognito:groups": ["ADMIN"],
                    },
                },
            })
        ).rejects.toEqual("User is not part of this tenant");
    });
});
