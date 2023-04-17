const indexModule = require("./index");
const { default: fetch } = require("node-fetch");

const mockTaskNewer = {
    id: "anotherTaskId",
    archived: null,
    _version: 1,
    _deleted: null,
    _lastChangedAt: 1620000000000,
};

const mockTask = {
    id: "someTaskId",
    archived: null,
    _version: 1,
};

const fakeData = {
    listTasks: {
        items: [mockTask],
        nextToken: "tasktoken",
    },
};
const fakeDataSecond = {
    listTasks: {
        items: [mockTaskNewer],
        nextToken: null,
    },
};

const fakeLocationData = {
    listLocations: {
        items: [
            {
                id: "someLocationId",
                archived: null,
                _version: 1,
            },
        ],
        nextToken: "loctoken",
    },
};

const fakeLocationDataSecond = {
    ...fakeLocationData,
    listLocations: {
        ...fakeLocationData.listLocations,
        nextToken: null,
    },
};

const fakeAssigneeData = {
    listTaskAssignees: {
        items: [
            {
                id: "someAssignmentId",
                archived: null,
                _version: 1,
            },
        ],
        nextToken: "asstoken",
    },
};

const fakeAssigneeDataSecond = {
    ...fakeAssigneeData,
    listTaskAssignees: {
        ...fakeAssigneeData.listTaskAssignees,
        nextToken: null,
    },
};

const fakeAssigneeReturn = {
    updateTaskAssignee: {
        id: "someAssignmentId",
        archived: 0,
    },
};
const fakeDeliverableData = {
    listDeliverables: {
        items: [
            {
                id: "someDeliverableId",
                archived: null,
                _version: 1,
            },
        ],
        nextToken: "deltoken",
    },
};
const fakeDeliverableDataSecond = {
    ...fakeDeliverableData,
    listDeliverables: {
        ...fakeDeliverableData.listDeliverables,
        nextToken: null,
    },
};
const fakeDeliverableReturn = {
    updateDeliverable: {
        id: "someDeliverableId",
        archived: 0,
    },
};
const fakeCommentData = {
    listComments: {
        items: [
            {
                id: "someCommentId",
                _version: 1,
                archived: null,
            },
        ],
        nextToken: "comtoken",
    },
};

const fakeCommentDataSecond = {
    ...fakeCommentData,
    listComments: {
        ...fakeCommentData.listComments,
        nextToken: null,
    },
};

const fakeCommentReturn = {
    updateComment: {
        id: "someCommentId",
        archived: 0,
    },
};
const fakeTaskReturn = {
    updateTask: {
        id: "someTaskId",
        archived: 0,
    },
};

const fakeLocationReturn = {
    updateLocation: {
        id: "someLocationId",
        archived: 0,
    },
};

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

describe("plateletArchiver", () => {
    afterEach(() => jest.restoreAllMocks());

    it("should return a function", () => {
        expect(typeof indexModule.handler).toBe("function");
    });

    test("convert items from null archived to 0", async () => {
        const requestSpy = jest.spyOn(indexModule, "makeNewRequest");
        jest.spyOn(fetch, "default")
            .mockImplementationOnce(setupFetchStub(fakeData))
            .mockImplementationOnce(setupFetchStub(fakeTaskReturn))
            .mockImplementationOnce(setupFetchStub(fakeCommentData))
            .mockImplementationOnce(setupFetchStub(fakeCommentReturn))
            .mockImplementationOnce(setupFetchStub(fakeLocationData))
            .mockImplementationOnce(setupFetchStub(fakeLocationReturn))
            .mockImplementationOnce(setupFetchStub(fakeDeliverableData))
            .mockImplementationOnce(setupFetchStub(fakeDeliverableReturn))
            .mockImplementationOnce(setupFetchStub(fakeAssigneeData))
            .mockImplementationOnce(setupFetchStub(fakeAssigneeReturn));
        await indexModule.handler({}, indexModule.makeNewRequest);
        expect(requestSpy).toMatchSnapshot();
    });
    test.skip("with nextToken convert items from null archived to 0", async () => {
        const requestSpy = jest.spyOn(indexModule, "makeNewRequest");
        jest.spyOn(fetch, "default")
            .mockImplementationOnce(setupFetchStub(fakeData))
            .mockImplementationOnce(setupFetchStub(fakeDataSecond))
            .mockImplementationOnce(setupFetchStub(fakeTaskReturn))
            .mockImplementationOnce(setupFetchStub(fakeTaskReturn))
            .mockImplementationOnce(setupFetchStub(fakeCommentData))
            .mockImplementationOnce(setupFetchStub(fakeCommentDataSecond))
            .mockImplementationOnce(setupFetchStub(fakeCommentReturn))
            .mockImplementationOnce(setupFetchStub(fakeCommentReturn))
            .mockImplementationOnce(setupFetchStub(fakeLocationData))
            .mockImplementationOnce(setupFetchStub(fakeLocationDataSecond))
            .mockImplementationOnce(setupFetchStub(fakeLocationReturn))
            .mockImplementationOnce(setupFetchStub(fakeLocationReturn))
            .mockImplementationOnce(setupFetchStub(fakeDeliverableData))
            .mockImplementationOnce(setupFetchStub(fakeDeliverableDataSecond))
            .mockImplementationOnce(setupFetchStub(fakeDeliverableReturn))
            .mockImplementationOnce(setupFetchStub(fakeDeliverableReturn))
            .mockImplementationOnce(setupFetchStub(fakeAssigneeData))
            .mockImplementationOnce(setupFetchStub(fakeAssigneeDataSecond))
            .mockImplementationOnce(setupFetchStub(fakeAssigneeReturn))
            .mockImplementationOnce(setupFetchStub(fakeAssigneeReturn));
        await indexModule.handler({}, indexModule.makeNewRequest);
        expect(requestSpy).toMatchSnapshot();
    });
});
