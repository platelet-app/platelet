const { handler } = require("./index");

jest.mock(
    "/opt/graphql/queries",
    () => {
        return {
            listPossibleRiderResponsibilities:
                "listPossibleRiderResponsibilities",
        };
    },
    { virtual: true }
);
jest.mock(
    "/opt/graphql/mutations",
    () => {
        return {
            deleteRiderResponsibilities: "deleteRiderResponsibilities",
            deletePossibleRiderResponsibilities:
                "deletePossibleRiderResponsibilities",
            deleteRiderResponsibility: "deleteRiderResponsibility",
        };
    },
    { virtual: true }
);

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

const appsyncModule = require("/opt/appSyncRequest");

const mockRiderResponsibility = {
    _version: 1,
    _deleted: null,
    _lastChangedAt: 1620000000000,
};

const possibleRiderResponsibilitiesFakeDataWithToken = {
    listPossibleRiderResponsibilities: {
        items: [
            { id: "someId3", _version: 3, _deleted: false },
            { id: "someId4", _version: 4, _deleted: false },
        ],
        nextToken: "someToken",
    },
};
const possibleRiderResponsibilitiesFakeData = {
    listPossibleRiderResponsibilities: {
        items: [
            { id: "someId1", _version: 1, _deleted: false },
            { id: "someId2", _version: 10, _deleted: false },
        ],
        nextToken: null,
    },
};

const fakeRiderResponsibility = {
    getRiderResponsibility: {
        id: "someRiderRespId",
        _version: 5,
        _deleted: false,
    },
};

const possibleRiderResponsibilityDeleted = {
    deleteRiderResponsibility: {
        id: "someId1",
        _version: 2,
        _deleted: true,
    },
};
const possibleRiderResponsibilityDeleted2 = {
    deleteRiderResponsibility: {
        id: "someId2",
        _version: 2,
        _deleted: true,
    },
};
const possibleRiderResponsibilityDeleted3 = {
    deleteRiderResponsibility: {
        id: "someId3",
        _version: 3,
        _deleted: true,
    },
};
const possibleRiderResponsibilityDeleted4 = {
    deleteRiderResponsibility: {
        id: "someId4",
        _version: 4,
        _deleted: true,
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

describe("index", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.useFakeTimers();
    });
    test("delete a rider responsibility and associated possible rider responsibilities", async () => {
        appsyncModule.request
            .mockImplementationOnce(
                setupFetchStub(possibleRiderResponsibilitiesFakeData)
            )
            .mockImplementationOnce(
                setupFetchStub(possibleRiderResponsibilityDeleted)
            )
            .mockImplementationOnce(
                setupFetchStub(possibleRiderResponsibilityDeleted2)
            )
            .mockImplementationOnce(setupFetchStub(fakeRiderResponsibility))
            .mockImplementationOnce(
                setupFetchStub({ ...fakeRiderResponsibility, _deleted: true })
            );
        const event = {
            arguments: { riderResponsibilityId: "someRiderRespId" },
        };
        handler(event);
        await jest.runAllTimersAsync();
        expect(appsyncModule.request).toMatchSnapshot();
    });
    test("paginated rider responsibilities", async () => {
        appsyncModule.request
            .mockImplementationOnce(
                setupFetchStub(possibleRiderResponsibilitiesFakeDataWithToken)
            )
            .mockImplementationOnce(
                setupFetchStub(possibleRiderResponsibilitiesFakeData)
            )
            .mockImplementationOnce(
                setupFetchStub(possibleRiderResponsibilityDeleted)
            )
            .mockImplementationOnce(
                setupFetchStub(possibleRiderResponsibilityDeleted2)
            )
            .mockImplementationOnce(
                setupFetchStub(possibleRiderResponsibilityDeleted3)
            )
            .mockImplementationOnce(
                setupFetchStub(possibleRiderResponsibilityDeleted4)
            )
            .mockImplementationOnce(setupFetchStub(fakeRiderResponsibility))
            .mockImplementationOnce(
                setupFetchStub({ ...fakeRiderResponsibility, _deleted: true })
            );
        const event = {
            arguments: { riderResponsibilityId: "someRiderRespId" },
        };
        handler(event);
        await jest.runAllTimersAsync();
        expect(appsyncModule.request).toMatchSnapshot();
    });
});
