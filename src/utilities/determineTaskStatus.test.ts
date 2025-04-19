import { DataStore } from "aws-amplify";
import * as models from "../models";
import determineTaskStatus from "./determineTaskStatus";
const tenantId = "tenantId";

describe("determineTaskStatus", () => {
    afterEach(async () => {
        await DataStore.clear();
    });
    test("cancelled", async () => {
        const task = new models.Task({
            tenantId,
            dateCreated: "2023-10-01",
            timeCancelled: "2023-10-01T00:00:00Z",
            timePickedUp: null,
            timeDroppedOff: null,
            timeRiderHome: null,
            timeRejected: null,
        });
        const result = await determineTaskStatus(task);
        expect(result).toBe(models.TaskStatus.CANCELLED);
    });
    test("rejected", async () => {
        const task = new models.Task({
            tenantId,
            dateCreated: "2023-10-01",
            timeRejected: "2023-10-01T00:00:00Z",
            timePickedUp: null,
            timeDroppedOff: null,
            timeRiderHome: null,
            timeCancelled: null,
        });
        const result = await determineTaskStatus(task);
        expect(result).toBe(models.TaskStatus.REJECTED);
    });
    test("abandoned", async () => {
        const task = new models.Task({
            tenantId,
            dateCreated: "2023-10-01",
            timeCancelled: "2023-10-01T00:00:00Z",
            timeRejected: null,
            timePickedUp: "2023-10-01T00:00:00Z",
            timeDroppedOff: null,
            timeRiderHome: null,
        });
        const result = await determineTaskStatus(task);
        expect(result).toBe(models.TaskStatus.ABANDONED);
    });
    test("picked up", async () => {
        const task = new models.Task({
            tenantId,
            dateCreated: "2023-10-01",
            timeCancelled: null,
            timeRejected: null,
            timePickedUp: "2023-10-01T00:00:00Z",
            timeDroppedOff: null,
            timeRiderHome: null,
        });
        const result = await determineTaskStatus(task);
        expect(result).toBe(models.TaskStatus.PICKED_UP);
    });
    test("dropped off", async () => {
        const task = new models.Task({
            tenantId,
            dateCreated: "2023-10-01",
            timeCancelled: null,
            timeRejected: null,
            timeDroppedOff: "2023-10-01T00:00:00Z",
            timePickedUp: "2023-10-01T00:00:00Z",
            timeRiderHome: null,
        });
        const result = await determineTaskStatus(task);
        expect(result).toBe(models.TaskStatus.DROPPED_OFF);
    });
    test("completed", async () => {
        const task = new models.Task({
            tenantId,
            dateCreated: "2023-10-01",
            timeCancelled: null,
            timeRejected: null,
            timeDroppedOff: "2023-10-01T00:00:00Z",
            timePickedUp: "2023-10-01T00:00:00Z",
            timeRiderHome: "2023-10-01T00:00:00Z",
        });
        const result = await determineTaskStatus(task);
        expect(result).toBe(models.TaskStatus.COMPLETED);
    });
    test("pending", async () => {
        const task = new models.Task({
            tenantId,
            dateCreated: "2023-10-01",
            timeCancelled: null,
            timeRejected: null,
            timeDroppedOff: null,
            timePickedUp: null,
            timeRiderHome: null,
        });
        const result = await determineTaskStatus(task);
        expect(result).toBe(models.TaskStatus.PENDING);
    });
    test("new", async () => {
        const assignee = new models.User({
            tenantId,
            cognitoId: "cognitoId",
            username: "username",
            displayName: "displayName",
            roles: [models.Role.COORDINATOR],
        });
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                dateCreated: "2023-10-01",
                timeCancelled: null,
                timeRejected: null,
                timeDroppedOff: null,
                timePickedUp: null,
                timeRiderHome: null,
            })
        );
        await DataStore.save(
            new models.TaskAssignee({
                task,
                assignee,
                tenantId,
                role: models.Role.COORDINATOR,
            })
        );
        const result = await determineTaskStatus(task);
        expect(result).toBe(models.TaskStatus.NEW);
    });
    test("active", async () => {
        const assignee = new models.User({
            tenantId,
            cognitoId: "cognitoId",
            username: "username",
            displayName: "displayName",
            roles: [models.Role.RIDER],
        });
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                dateCreated: "2023-10-01",
                timeCancelled: null,
                timeRejected: null,
                timeDroppedOff: null,
                timePickedUp: null,
                timeRiderHome: null,
            })
        );
        await DataStore.save(
            new models.TaskAssignee({
                task,
                assignee,
                tenantId,
                role: models.Role.RIDER,
            })
        );
        const result = await determineTaskStatus(task);
        expect(result).toBe(models.TaskStatus.ACTIVE);
    });
});
