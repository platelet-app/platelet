const { request, errorCheck } = require("./appSyncRequest");
const { default: fetch, Request } = require("node-fetch");

jest.mock("node-fetch", () => ({
    ...jest.requireActual("node-fetch"),
    Request: class {
        constructor(input, init) {
            this.input =
                "https://xxxxxx.appsync-api.ap-northeast-1.amazonaws.com/graphql";
            this.init = "init";
        }
    },
    default: jest.fn().mockResolvedValue(
        Promise.resolve({
            json: jest.fn().mockResolvedValue({
                data: {
                    listTodos: {
                        items: [
                            {
                                id: "1",
                                name: "Todo 1",
                            },
                            {
                                id: "2",
                                name: "Todo 2",
                            },
                        ],
                    },
                },
            }),
        })
    ),
}));

describe("appSyncRequest", () => {
    test("make a request", async () => {
        const response = await request(
            {
                query: `query listTodos {
                listTodos {
                  items {
                    id
                    name
                  }
                }
              }`,
            },
            "https://xxxxxx.appsync-api.ap-northeast-1.amazonaws.com/graphql"
        );
        expect(response).toBeDefined();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toMatchSnapshot();
    });
    test("error check function", async () => {
        const body = {
            errors: [
                {
                    message: "Error message",
                },
            ],
        };
        expect(() => errorCheck(body)).toThrow("Error message");
    });
});
