const indexModule = require("./index");
const _ = require("lodash");

const mockTaskNewer = {
    id: "anotherTaskId",
    status: "COMPLETED",
    archived: 0,
    createdAt: "2021-04-29T00:00:00.000Z",
    dateCompleted: "2021-04-29",
    pickUpLocation: {
        listed: 1,
        _version: 1,
    },
    dropOffLocation: {
        listed: 0,
        _version: 1,
    },
    _version: 1,
    _deleted: null,
    _lastChangedAt: 1620000000000,
};

const mockTaskDateCompletedNull = {
    id: "anotherTaskId",
    status: "COMPLETED",
    archived: 0,
    createdAt: "2021-04-29T00:00:00.000Z",
    dateCompleted: null,
    _version: 1,
    _deleted: null,
    _lastChangedAt: 1620000000000,
};

const mockTask = {
    id: "someTaskId",
    status: "COMPLETED",
    archived: 0,
    createdAt: "2021-04-01T00:00:00.000Z",
    dateCompleted: "2021-04-01",
    pickUpLocation: {
        listed: 1,
        _version: 1,
        id: "someLocationIdListed",
    },
    dropOffLocation: {
        id: "someLocationIdUnlisted",
        listed: 0,
        _version: 1,
    },
    _version: 1,
    _deleted: null,
    _lastChangedAt: 1620000000000,
};

const fakeData = {
    tasksByArchivedStatus: {
        items: [mockTask, mockTaskNewer],
        nextToken: "tasktoken",
    },
};
const fakeDataSecond = {
    tasksByArchivedStatus: {
        items: [mockTaskNewer],
        nextToken: null,
    },
};
const fakeDataDateCompletedNull = {
    tasksByArchivedStatus: {
        items: [mockTaskDateCompletedNull],
        nextToken: null,
    },
};

const manyTasks = _.range(0, 30).map((i) => ({
    id: `someTaskId${i}`,
    status: "COMPLETED",
    archived: 0,
    createdAt: "2021-04-01T00:00:00.000Z",
    dateCompleted: "2021-04-01",
    _version: 1,
    _deleted: null,
    _lastChangedAt: 1620000000000,
    status: "COMPLETED",
}));

const fakeDataMany = {
    tasksByArchivedStatus: {
        items: manyTasks,
        nextToken: "tasktoken",
    },
};
const fakeEmptyData = {
    tasksByArchivedStatus: {
        items: [],
        nextToken: null,
    },
};
const fakeAssigneeData = {
    getTask: {
        assignees: {
            items: [
                {
                    id: "someAssignmentId",
                    _version: 1,
                },
            ],
            nextToken: "asstoken",
        },
    },
};
const fakeAssigneeDataSecond = {
    ...fakeAssigneeData,
    getTask: {
        ...fakeAssigneeData.getTask,
        assignees: {
            ...fakeAssigneeData.getTask.assignees,
            nextToken: null,
        },
    },
};
const fakeAssigneeReturn = {
    updateTaskAssignee: {
        id: "someAssignmentId",
        archived: 1,
    },
};
const fakeDeliverableData = {
    getTask: {
        deliverables: {
            items: [
                {
                    id: "someDeliverableId",
                    _version: 1,
                },
            ],
            nextToken: "deltoken",
        },
    },
};
const fakeDeliverableDataSecond = {
    ...fakeDeliverableData,
    getTask: {
        ...fakeDeliverableData.getTask,
        deliverables: {
            ...fakeDeliverableData.getTask.deliverables,
            nextToken: null,
        },
    },
};
const fakeDeliverableReturn = {
    updateDeliverable: {
        id: "someDeliverableId",
        archived: 1,
    },
};
const fakeCommentData = {
    getTask: {
        comments: {
            items: [
                {
                    id: "someCommentId",
                    _version: 1,
                },
            ],
            nextToken: "comtoken",
        },
    },
};
const fakeCommentDataSecond = {
    ...fakeCommentData,
    getTask: {
        ...fakeCommentData.getTask,
        comments: {
            ...fakeCommentData.getTask.comments,
            nextToken: null,
        },
    },
};
const fakeCommentReturn = {
    updateComment: {
        id: "someCommentId",
        archived: 1,
    },
};
const fakeTaskReturn = {
    updateTask: {
        id: "someTaskId",
        archived: 1,
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
            updateLocation: "updateLocationMutation",
            updateDeliverable: "updateDeliverableMutation",
            updateComment: "updateCommentMutation",
            updateTaskAssignee: "updateTaskAssigneeMutation",
        };
    },
    { virtual: true }
);

const appsyncModule = require("/opt/appSyncRequest");

describe("plateletArchiver", () => {
    afterEach(() => jest.resetAllMocks());

    beforeAll(() => {
        jest.useFakeTimers("modern");
        jest.setSystemTime(new Date("2021-05-01T00:00:00.000Z"));
    });

    it("should return a function", () => {
        expect(typeof indexModule.handler).toBe("function");
    });

    test("archive some tasks, ignore the newer task", async () => {
        appsyncModule.request
            .mockImplementationOnce(setupFetchStub(fakeData))
            .mockImplementationOnce(setupFetchStub(fakeDataSecond))
            .mockImplementationOnce(setupFetchStub(fakeEmptyData))
            .mockImplementationOnce(setupFetchStub(fakeEmptyData))
            .mockImplementationOnce(setupFetchStub(fakeEmptyData))
            .mockImplementationOnce(setupFetchStub({}))
            .mockImplementationOnce(setupFetchStub(fakeAssigneeData))
            .mockImplementationOnce(setupFetchStub(fakeAssigneeDataSecond))
            .mockImplementationOnce(setupFetchStub(fakeAssigneeReturn))
            .mockImplementationOnce(setupFetchStub(fakeAssigneeReturn))
            .mockImplementationOnce(setupFetchStub(fakeDeliverableData))
            .mockImplementationOnce(setupFetchStub(fakeDeliverableDataSecond))
            .mockImplementationOnce(setupFetchStub(fakeDeliverableReturn))
            .mockImplementationOnce(setupFetchStub(fakeDeliverableReturn))
            .mockImplementationOnce(setupFetchStub(fakeCommentData))
            .mockImplementationOnce(setupFetchStub(fakeCommentDataSecond))
            .mockImplementationOnce(setupFetchStub(fakeCommentReturn))
            .mockImplementationOnce(setupFetchStub(fakeCommentReturn))
            .mockImplementationOnce(setupFetchStub(fakeTaskReturn));
        await indexModule.handler({}, indexModule.makeNewRequest);
        expect(appsyncModule.request).toMatchSnapshot();
        expect(appsyncModule.request).not.toHaveBeenCalledWith(
            {
                query: "updateTaskMutation",
                variables: {
                    input: expect.objectContaining({ id: "anotherTaskId" }),
                },
            },
            expect.anything()
        );
    });

    test("chunk the tasks into 10s", async () => {
        appsyncModule.request
            .mockImplementationOnce(setupFetchStub(fakeDataMany))
            .mockImplementation(setupFetchStub(fakeTaskReturn));
        await indexModule.handler({}, indexModule.makeNewRequest);
        for (const task of manyTasks) {
            expect(appsyncModule.request).toHaveBeenCalledWith(
                {
                    query: "updateTaskMutation",
                    variables: {
                        input: {
                            _version: 1,
                            archived: 1,
                            id: task.id,
                        },
                    },
                },
                "https://api.example.com/graphql"
            );
        }
    });

    test("update the null dateCompleted", async () => {
        appsyncModule.request
            .mockImplementationOnce(setupFetchStub(fakeDataDateCompletedNull))
            .mockImplementation(setupFetchStub(fakeTaskReturn));
        await indexModule.handler({}, indexModule.makeNewRequest);
        expect(appsyncModule.request).toHaveBeenCalledWith(
            {
                query: "updateTaskMutation",
                variables: {
                    input: {
                        _version: 1,
                        id: mockTaskDateCompletedNull.id,
                        dateCompleted: "2021-05-01",
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
                        archived: 1,
                        id: mockTaskDateCompletedNull.id,
                    },
                },
            },
            "https://api.example.com/graphql"
        );
    });

    test("failure to archive an assignee", async () => {
        const unArchivedFakeAssigneeReturn = {
            updateTaskAssignee: {
                id: "someAssignmentId",
                archived: 0,
            },
        };
        appsyncModule.request
            .mockImplementationOnce(setupFetchStub(fakeData))
            .mockImplementationOnce(setupFetchStub(fakeDataSecond))
            .mockImplementationOnce(setupFetchStub(fakeEmptyData))
            .mockImplementationOnce(setupFetchStub(fakeEmptyData))
            .mockImplementationOnce(setupFetchStub(fakeEmptyData))
            .mockImplementationOnce(setupFetchStub({}))
            .mockImplementationOnce(setupFetchStub(fakeAssigneeDataSecond))
            .mockImplementationOnce(
                setupFetchStub(unArchivedFakeAssigneeReturn)
            );
        await indexModule.handler({}, indexModule.makeNewRequest);
        expect(appsyncModule.request).toMatchSnapshot();
        expect(appsyncModule.request).not.toHaveBeenCalledWith(
            {
                query: "updateTaskMutation",
                variables: {
                    input: expect.objectContaining({ id: "someTaskId" }),
                },
            },
            expect.anything()
        );
    });
    test("graphql failure to archive an assignee", async () => {
        const unArchivedFakeAssigneeReturnError = {
            updateTaskAssignee: null,
            errors: [
                {
                    message: "some error",
                },
            ],
        };
        appsyncModule.request
            .mockImplementationOnce(setupFetchStub(fakeData))
            .mockImplementationOnce(setupFetchStub(fakeDataSecond))
            .mockImplementationOnce(setupFetchStub(fakeEmptyData))
            .mockImplementationOnce(setupFetchStub(fakeEmptyData))
            .mockImplementationOnce(setupFetchStub(fakeEmptyData))
            .mockImplementationOnce(setupFetchStub({}))
            .mockImplementationOnce(setupFetchStub(fakeAssigneeDataSecond))
            .mockImplementationOnce(
                setupFetchStub(unArchivedFakeAssigneeReturnError)
            );
        await indexModule.handler({}, indexModule.makeNewRequest);
        expect(appsyncModule.request).toMatchSnapshot();
        expect(appsyncModule.request).not.toHaveBeenCalledWith({
            query: "updateTaskMutation",
            variables: expect.objectContaining({
                input: expect.objectContaining({
                    id: "someTaskId",
                }),
            }),
        });
    });
});
