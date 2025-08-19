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
            deleteRiderResponsibility: "deleteRiderResponsibility",
            deletePossibleRiderResponsibility:
                "deletePossibleRiderResponsibility",
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
    test("delete a rider responsibility and associated possible rider responsibilities", () => {
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
    });
});
