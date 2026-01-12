const plateletProfilePictureResolver = require("./index").handler;
const { S3Client } = require("@aws-sdk/client-s3");
const sharp = require("sharp");
const fetch = require("node-fetch");

jest.mock("sharp");
jest.mock("node-fetch", () => ({
    ...jest.requireActual("node-fetch"),
    default: jest.fn(),
}));

jest.mock("aws-sdk", () => {
    return {
        ...jest.requireActual("aws-sdk"),
        S3: class {
            getObject() {
                return this;
            }
        },
    };
});

const event = {
    arguments: {},
    source: {
        profilePicture: { key: "public/testId.jpg" },
        id: "testId",
    },
};

jest.mock("@aws-sdk/credential-provider-node", () => ({
    defaultProvider: () => async () => ({
        accessKeyId: "test-key",
        secretAccessKey: "test-secret",
    }),
}));

jest.mock("@aws-sdk/signature-v4", () => ({
    SignatureV4: class {
        async sign(request) {
            return {
                ...request,
                headers: {
                    ...request.headers,
                    Authorization: "Signed-Header",
                },
            };
        }
    },
}));

const beginString = `https://s3.${process.env.REGION}.amazonaws.com/${process.env.STORAGE_PLATELETSTORAGE_BUCKETNAME}/`;

describe("plateletProfilePictureResolver", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    beforeAll(() => {
        return;
        jest.spyOn(S3Client.prototype, "send").mockImplementation(() => {
            return {
                promise: async () => {
                    return {
                        Body: Buffer.from("test"),
                    };
                },
            };
        });
    });

    it("returns the full profile picture for someone", async () => {
        jest.spyOn(fetch, "default").mockResolvedValue({
            json: async () => {
                return {
                    data: {
                        getUser: {
                            profilePicture: {
                                key: "public/testId.jpg",
                            },
                        },
                    },
                };
            },
        });

        const result = await plateletProfilePictureResolver(event);

        expect(
            result.startsWith(
                `${beginString}${event.source.profilePicture.key}`
            )
        ).toBe(true);
    });

    it.skip("resizes the picture and saves it", async () => {
        const result = await plateletProfilePictureResolver({
            ...event,
            arguments: { width: 100, height: 100 },
        });
        console.log(result);
        console.log(`${beginString}public/testId-100-100.jpg`);
        expect(
            result.startsWith(`${beginString}public/testId-100-100.jpg`)
        ).toBe(true);
    });
});
