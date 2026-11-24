import { jest, expect } from "@jest/globals";

jest.unstable_mockModule("@platelet-app/lambda", () => ({
    request: jest.fn(),
    errorCheck: jest.fn(),
}));

// must be imported before the handler
const lambda = await import("@platelet-app/lambda");
const { mutations } = await import("@platelet-app/graphql");
// import handler
const { handler } = await import("./index.js");

const mockRequest = jest.mocked(lambda.request);

const mockScheduledTasks = [
    {
        id: "taskId",
        tenantId: "tenantId",
        priority: "MEDIUM",
        requesterContact: {
            name: "name",
            telephoneNumber: "phone",
        },
        pickUpSchedule: null,
        dropOffSchedule: null,
        establishmentLocation: {
            id: "establishmentLocationId",
            name: "establishment",
            listed: 1,
            _version: 1,
        },
        pickUpLocation: {
            id: "pickUpLocationId",
            name: "pick up",
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
            googleMapsPlaceId: "googleMapsPlaceId",
            tenantId: "tenantId",
            listed: 0,
            _version: 1,
        },
        deliverables: {
            items: [
                {
                    _deleted: null,
                    id: "deliverableId",
                    deliverableType: { id: "deliverableType", label: "bloods" },
                    deliverableTypeDeliverablesId:
                        "deliverableTypeDeliverablesId",
                    count: 1,
                    unit: "unit",
                },
                {
                    _deleted: true,
                    id: "deletedDeliverableId",
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
    {
        id: "deletedTaskId",
        tenantId: "tenantId",
        priority: "MEDIUM",
        requesterContact: {
            name: "name",
            telephoneNumber: "phone",
        },
        establishmentLocation: null,
        pickUpLocation: null,
        dropOffLocation: null,
        _version: 1,
        _deleted: true,
        _lastChangedAt: 1620000000000,
    },
];

const mockScheduledTasksScheduled = [
    {
        id: "taskId",
        tenantId: "tenantId",
        priority: "MEDIUM",
        requesterContact: {
            name: "name",
            telephoneNumber: "phone",
        },
        pickUpSchedule: {
            timePrimary: "2099-01-01T10:00:00.000Z",
            timeSecondary: "2099-01-02T04:00:00.000Z",
            relation: "BETWEEN",
        },
        dropOffSchedule: {
            timePrimary: "2099-01-01T23:00:00.000Z",
            timeSecondary: null,
            relation: "BEFORE",
        },
        establishmentLocation: {
            id: "establishmentLocationId",
            name: "establishment",
            listed: 1,
            _version: 1,
        },
        pickUpLocation: {
            id: "pickUpLocationId",
            name: "pick up",
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
            googleMapsPlaceId: "googleMapsPlaceId",
            tenantId: "tenantId",
            listed: 0,
            _version: 1,
        },
        deliverables: {
            items: [
                {
                    _deleted: null,
                    id: "deliverableId",
                    deliverableType: { id: "deliverableType", label: "bloods" },
                    deliverableTypeDeliverablesId:
                        "deliverableTypeDeliverablesId",
                    count: 1,
                    unit: "unit",
                },
                {
                    _deleted: true,
                    id: "deletedDeliverableId",
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

const mockResponse = (data: unknown) =>
    ({
        json: () => Promise.resolve({ data }),
    } as unknown as Awaited<ReturnType<typeof lambda.request>>);

// list the scheduled tasks, then create the unlisted drop off location,
// the task and its one non-deleted deliverable
const setupRequests = (scheduledTasks: unknown[]) => {
    mockRequest
        .mockResolvedValueOnce(
            mockResponse({
                listScheduledTasks: {
                    items: scheduledTasks,
                    nextToken: null,
                },
            })
        )
        .mockResolvedValueOnce(
            mockResponse({ createLocation: { id: "newLocationId" } })
        )
        .mockResolvedValueOnce(
            mockResponse({ createTask: { id: "newTaskId" } })
        )
        .mockResolvedValueOnce(
            mockResponse({ createDeliverable: { id: "newDeliverableId" } })
        );
};

describe("CreateScheduledTasks", () => {
    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2021-05-01T00:00:00.000Z"));
    });
    afterAll(() => {
        jest.useRealTimers();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("create some scheduled tasks", async () => {
        setupRequests(mockScheduledTasks);
        await handler({});
        expect(mockRequest.mock.calls).toMatchSnapshot();
    });
    test("create some scheduled tasks and calculate schedule", async () => {
        setupRequests(mockScheduledTasksScheduled);
        await handler({});
        expect(mockRequest.mock.calls).toMatchSnapshot();
    });
    test("only the task location fields are copied to the location details", async () => {
        setupRequests(mockScheduledTasks);
        await handler({});
        const createTaskCall = mockRequest.mock.calls.find(
            ([{ query }]) => query === mutations.createTask
        );
        const { input } = createTaskCall?.[0].variables;
        expect(input.pickUpLocationDetails).toEqual({ name: "pick up" });
        expect(input.establishmentLocationDetails).toEqual({
            name: "establishment",
        });
        // the model fields id, tenantId, listed and _version are left out
        expect(input.dropOffLocationDetails).toEqual({
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
            googleMapsPlaceId: "googleMapsPlaceId",
        });
    });
});
