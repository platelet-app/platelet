const indexModule = require("./index");

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
            updateLocation: "updateLocationMutation",
        };
    },
    { virtual: true }
);
jest.mock(
    "/opt/graphql/queries",
    () => {
        return {
            locationsByArchivedStatus: "locationsByArchivedStatusQuery",
        };
    },
    { virtual: true }
);

const appsyncModule = require("/opt/appSyncRequest");

const fakeData = {
    locationsByArchivedStatus: {
        items: [
            {
                id: "1",
                archived: 1,
                line1: "123 Main St",
                line2: "Apt 1",
                line3: "Floor 2",
                town: "Some town",
                postCode: "12345",
                createdAt: "2020-01-01T00:00:00.000Z",
            },
            {
                id: "2",
                archived: 1,
                line1: "123 Main St",
                line2: "Apt 1",
                line3: "Floor 2",
                town: "Some town",
                postCode: "12345",
                createdAt: "2021-04-28T00:00:00.000Z",
            },
        ],
        nextToken: null,
    },
};

describe("plateletCleanUpArchiveData", () => {
    afterEach(() => jest.resetAllMocks());

    beforeAll(() => {
        jest.useFakeTimers("modern");
        jest.setSystemTime(new Date("2021-05-01T00:00:00.000Z"));
    });
    test("clean up some location data, ignore the newer one", async () => {
        const locationResponse = {
            updateLocation: {
                id: "1",
                archived: 1,
                line1: null,
                line2: null,
                line3: null,
                town: "Some town",
                postCode: "12345",
            },
        };
        appsyncModule.request
            .mockImplementationOnce(setupFetchStub(fakeData))
            .mockImplementationOnce(setupFetchStub(locationResponse));
        await indexModule.handler();
        expect(appsyncModule.request).toHaveBeenCalledTimes(2);
        expect(appsyncModule.request).toMatchSnapshot();
    });
});
