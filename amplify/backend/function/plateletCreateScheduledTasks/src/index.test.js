const indexModule = require("./index");

const mockScheduledTasks = [
    {
        id: "taskId",
        tenantId: "tenantId",
        priority: "MEDIUM",
        requesterContact: {
            name: "name",
            telephoneNumber: "phone",
        },
        establishmentLocation: {
            id: "establishmentLocationId",
            listed: 1,
            _version: 1,
        },
        pickUpLocation: {
            id: "pickUpLocationId",
            listed: 1,
            _version: 1,
        },
        dropOffLocation: {
            id: "dropOffLocationId",
            contact: {
                name: "name",
                telephoneNumber: "phone",
            },
            line1: "line1",
            line2: "line2",
            line3: "line3",
            town: "town",
            county: "county",
            country: "country",
            postcode: "postcode",
            what3words: "what3words",
            tenantId: "tenantId",
            listed: 0,
            _version: 1,
        },
        deliverables: {
            items: [
                {
                    id: "deliverableId",
                    deliverableType: { id: "deliverableType", label: "bloods" },
                    deliverableTypeDeliverablesId:
                        "deliverableTypeDeliverablesId",
                    count: 1,
                    unit: "unit",
                },
            ],
        },
        _version: 1,
        _deleted: null,
        _lastChangedAt: 1620000000000,
    },
];

jest.mock(
    "/opt/appSyncRequest",
    () => {
        return {
            request: jest.fn(),
        };
    },
    { virtual: true }
);
jest.mock(
    "/opt/graphql/mutations",
    () => {
        return {
            createTask: "createTaskQuery",
            createLocation: "createLocationQuery",
            createDeliverable: "createDeliverableQuery",
        };
    },
    { virtual: true }
);

const appsyncModule = require("/opt/appSyncRequest");

describe("plateletCreateScheduledTasks", () => {
    afterEach(() => jest.restoreAllMocks());
    beforeAll(() => {
        jest.useFakeTimers("modern");
        jest.setSystemTime(new Date("2021-05-01T00:00:00.000Z"));
    });
    test("create some scheduled tasks", async () => {
        appsyncModule.request
            .mockResolvedValueOnce({
                json: () => ({
                    data: {
                        listScheduledTasks: {
                            items: mockScheduledTasks,
                            nextToken: null,
                        },
                    },
                }),
            })
            .mockResolvedValueOnce({
                json: () => ({
                    data: { createLocation: { id: "newLocationId" } },
                }),
            })
            .mockResolvedValueOnce({
                json: () => ({
                    data: { createTask: { id: "newTaskId" } },
                }),
            })
            .mockResolvedValueOnce({
                json: () => ({
                    data: { createDeliverable: { id: "newDeliverableId" } },
                }),
            });

        await indexModule.handler();
        expect(appsyncModule.request).toMatchSnapshot();
    });
});
