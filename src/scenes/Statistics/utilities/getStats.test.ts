import * as APITypes from "../../../API";
import * as models from "../../../models";
import getStats from "./getStats";

const tenantId = "someTenantId";

describe("getStats", () => {
    test("should return the correct stats", () => {
        const mockWhoami = new models.User({
            tenantId,
            displayName: "someDisplayName",
            roles: [models.Role.ADMIN, models.Role.COORDINATOR],
            username: "someUsername",
            cognitoId: "someCognitoId",
        });
        const mockTask = {
            id: "someId",
            timeOfCall: "2021-05-01T00:00:00.000Z",
            riderResponsibility: "someRiderResponsibility",
            priority: APITypes.Priority.HIGH,
            status: APITypes.TaskStatus.COMPLETED,
            createdAt: new Date().toISOString(),
            assignees: {
                items: [
                    {
                        role: models.Role.RIDER,
                        task: {
                            priority: APITypes.Priority.HIGH,
                        },
                        assignee: {
                            id: "someId",
                            displayName: "Rider Name",
                        },
                    },
                    {
                        role: models.Role.COORDINATOR,
                        assignee: {
                            id: mockWhoami.id,
                            displayName: "Coordinator Name",
                        },
                    },
                ],
            },
            dateCreated: new Date().toISOString().split("T")[0],
            _version: 1,
            _deleted: null,
            _lastChangedAt: 1620000000000,
        };
        const mockTaskNoPriority = {
            id: "someId",
            timeOfCall: "2021-05-01T00:00:00.000Z",
            riderResponsibility: null,
            priority: null,
            status: APITypes.TaskStatus.NEW,
            createdAt: new Date().toISOString(),
            assignees: {
                items: [
                    {
                        role: models.Role.RIDER,
                        task: {
                            priority: null,
                        },
                        assignee: {
                            id: "someId",
                            displayName: "Rider Name",
                        },
                    },
                    {
                        role: models.Role.COORDINATOR,
                        assignee: {
                            id: mockWhoami.id,
                            displayName: "Coordinator Name",
                        },
                    },
                ],
            },
            dateCreated: new Date().toISOString().split("T")[0],
            _version: 1,
            _deleted: null,
            _lastChangedAt: 1620000000000,
        };
        const notMyMockTask = {
            id: "anotherId",
            timeOfCall: "2021-05-01T00:00:00.000Z",
            riderResponsibility: "someRiderResponsibility",
            priority: APITypes.Priority.HIGH,
            status: APITypes.TaskStatus.COMPLETED,
            createdAt: new Date().toISOString(),
            assignees: {
                items: [
                    {
                        role: models.Role.RIDER,
                        assignee: {
                            id: "someId",
                            displayName: "Not My Rider Name",
                        },
                    },
                    {
                        role: models.Role.COORDINATOR,
                        assignee: {
                            id: "someOtherId",
                            displayName: "Coordinator Name",
                        },
                    },
                ],
            },
            _version: 1,
            _deleted: null,
            _lastChangedAt: 1620000000000,
        };
        const result = getStats(
            [mockTask, notMyMockTask, mockTaskNoPriority],
            mockWhoami.id
        );
        expect(result).toMatchSnapshot();
    });
});
