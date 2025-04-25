const handler = require("./index").handler;

const errorCheck = (body) => {
    if (body?.errors) {
        console.error(body?.errors);
        throw new Error(body?.errors[0].message);
    }
};

jest.mock(
    "/opt/appSyncRequest",
    () => {
        return {
            request: jest.fn(),
            errorCheck,
        };
    },
    { virtual: true }
);
jest.mock(
    "/opt/graphql/mutations",
    () => {
        return {
            updateTask: "updateTaskMutation",
        };
    },
    { virtual: true }
);
const appsyncModule = require("/opt/appSyncRequest");

function setupFetchStub(data) {
    return function fetchStub(_url) {
        return new Promise((resolve) => {
            resolve({
                json: () =>
                    Promise.resolve({
                        data,
                    }),
            });
        });
    };
}

const fakeTask = {
    id: "1",
    status: "FUTURE",
    pickUpSchedule: {
        timePrimary: "2021-05-01T23:00:00.000Z",
    },
    dropOffSchedule: null,
    _version: 1,
};

const fakeTaskLater = {
    id: "2",
    status: "FUTURE",
    pickUpSchedule: {
        timePrimary: "2021-05-02T00:01:00.000Z",
    },
    dropOffSchedule: null,
    _version: 1,
};
const fakeTask2 = {
    id: "1",
    status: "FUTURE",
    dropOffSchedule: {
        timePrimary: "2021-05-01T23:00:00.000Z",
    },
    pickUpSchedule: null,
    _version: 1,
};

const fakeTaskLater2 = {
    id: "2",
    status: "FUTURE",
    dropOffSchedule: {
        timePrimary: "2021-05-02T00:01:00.000Z",
    },
    pickUpSchedule: null,
    _version: 1,
};

const fakeData = {
    tasksByStatus: {
        items: [fakeTask],
        nextToken: null,
    },
};
const fakeDataNot = {
    tasksByStatus: {
        items: [fakeTask, fakeTaskLater],
        nextToken: null,
    },
};
const fakeData2 = {
    tasksByStatus: {
        items: [fakeTask2],
        nextToken: null,
    },
};
const fakeDataNot2 = {
    tasksByStatus: {
        items: [fakeTask2, fakeTaskLater2],
        nextToken: null,
    },
};

describe("handler", () => {
    afterEach(() => jest.resetAllMocks());
    beforeAll(() => {
        jest.useFakeTimers("modern");
        jest.setSystemTime(new Date("2021-05-01T00:00:00.000Z"));
    });
    it("should move future tasks into pending if pick up is due within a day", async () => {
        appsyncModule.request
            .mockImplementationOnce(setupFetchStub(fakeData))
            .mockImplementationOnce(setupFetchStub({}));
        const event = {};
        await handler(event);
        expect(appsyncModule.request).toMatchSnapshot();
    });
    it("should not move future tasks into pending if pick up is not due within a day", async () => {
        appsyncModule.request
            .mockImplementationOnce(setupFetchStub(fakeDataNot))
            .mockImplementationOnce(setupFetchStub({}))
            .mockImplementationOnce(setupFetchStub({}));
        const event = {};
        await handler(event);
        expect(appsyncModule.request).toHaveBeenCalledWith(
            {
                query: "updateTaskMutation",
                variables: {
                    input: {
                        _version: 1,
                        id: "1",
                        status: "PENDING",
                    },
                },
            },
            "https://api.example.com/graphql"
        );
        expect(appsyncModule.request).not.toHaveBeenCalledWith(
            {
                query: "updateTaskMutation",
                variables: {
                    input: {
                        _version: 1,
                        id: "2",
                        status: "PENDING",
                    },
                },
            },
            "https://api.example.com/graphql"
        );
    });
    it("should move future tasks into pending if drop off is due within a day", async () => {
        appsyncModule.request
            .mockImplementationOnce(setupFetchStub(fakeData2))
            .mockImplementationOnce(setupFetchStub({}));
        const event = {};
        await handler(event);
        expect(appsyncModule.request).toMatchSnapshot();
    });
    it("should not move future tasks into pending if drop off is not due within a day", async () => {
        appsyncModule.request
            .mockImplementationOnce(setupFetchStub(fakeDataNot2))
            .mockImplementationOnce(setupFetchStub({}))
            .mockImplementationOnce(setupFetchStub({}));
        const event = {};
        await handler(event);
        expect(appsyncModule.request).toHaveBeenCalledWith(
            {
                query: "updateTaskMutation",
                variables: {
                    input: {
                        _version: 1,
                        id: "1",
                        status: "PENDING",
                    },
                },
            },
            "https://api.example.com/graphql"
        );
        expect(appsyncModule.request).not.toHaveBeenCalledWith(
            {
                query: "updateTaskMutation",
                variables: {
                    input: {
                        _version: 1,
                        id: "2",
                        status: "PENDING",
                    },
                },
            },
            "https://api.example.com/graphql"
        );
    });
});
