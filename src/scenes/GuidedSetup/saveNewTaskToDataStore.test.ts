import { saveNewTaskToDataStore } from "./saveNewTaskToDataStore";
import { waitFor } from "@testing-library/react";
import { DataStore } from "aws-amplify";
import * as models from "../../models";

const tenantId = "tenantId";

describe("saveNewTaskToDataStore", () => {
    beforeEach(async () => {
        await DataStore.clear();
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2021-01-01T12:00:58.987Z"));
    });
    afterEach(async () => {
        jest.restoreAllMocks();
    });
    test("save a new task", async () => {
        const author = new models.User({
            name: "name",
            displayName: "displayName",
            tenantId,
            username: "username",
            roles: [models.Role.USER],
            cognitoId: "cognitoId",
        });

        const { id: authorId } = await DataStore.save(author);
        const saveSpy = jest.spyOn(DataStore, "save");

        const establishmentLocation = new models.Location({
            line1: "line 1",
            line2: "line 2",
            town: "town",
            country: "country",
            county: "county",
            contact: {
                name: "name loc",
                telephoneNumber: "01234567914",
            },
            tenantId,
        });
        const data = {
            locations: {
                pickUpLocation: null,
                dropOffLocation: null,
            },
            deliverables: {},
            comment: { body: "" },
            establishmentLocation,
            schedule: { pickUp: null, dropOff: null },
            requesterContact: {
                name: "some name",
                telephoneNumber: "01234567890",
            },
            timeOfCall: "2021-02-01T12:00:58.987Z",
        };
        const mockTask = new models.Task({
            createdBy: author,
            establishmentLocation,
            pickUpLocation: null,
            dropOffLocation: null,
            pickUpSchedule: null,
            dropOffSchedule: null,
            timeOfCall: "2021-02-01T12:00:58.987Z",
            requesterContact: {
                name: "some name",
                telephoneNumber: "01234567890",
            },
            status: models.TaskStatus.NEW,
            dateCreated: new Date().toISOString().split("T")[0],
            tenantId,
        });
        await saveNewTaskToDataStore(data, tenantId, authorId);
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTask,
            id: expect.any(String),
        });
    });
    test("save a new task with deliverables", async () => {
        const author = new models.User({
            name: "name",
            displayName: "displayName",
            tenantId,
            username: "username",
            roles: [models.Role.USER],
            cognitoId: "cognitoId",
        });

        const { id: authorId } = await DataStore.save(author);
        const deliverableType = await DataStore.save(
            new models.DeliverableType({
                label: "deliverable",
                defaultUnit: models.DeliverableUnit.ITEM,
                tenantId,
            })
        );
        const saveSpy = jest.spyOn(DataStore, "save");

        const deliverable = {
            _deleted: undefined,
            _lastChangedAt: undefined,
            _version: undefined,
            id: deliverableType.id,
            deliverableType,
            unit: models.DeliverableUnit.ITEM,
            tenantId,
            count: 20,
        };

        const data = {
            locations: {
                pickUpLocation: null,
                dropOffLocation: null,
            },
            deliverables: { [deliverableType.id]: deliverable },
            comment: { body: "" },
            establishmentLocation: null,
            schedule: { pickUp: null, dropOff: null },
            requesterContact: {
                name: "some name",
                telephoneNumber: "01234567890",
            },
            timeOfCall: "2021-02-01T12:00:58.987Z",
        };
        const mockTask = new models.Task({
            createdBy: author,
            pickUpLocation: null,
            dropOffLocation: null,
            establishmentLocation: null,
            pickUpSchedule: null,
            dropOffSchedule: null,
            timeOfCall: "2021-02-01T12:00:58.987Z",
            requesterContact: {
                name: "some name",
                telephoneNumber: "01234567890",
            },
            status: models.TaskStatus.NEW,
            dateCreated: new Date().toISOString().split("T")[0],
            tenantId,
        });

        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            assignee: author,
            role: models.Role.COORDINATOR,
            tenantId,
        });
        await saveNewTaskToDataStore(data, tenantId, authorId);
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTask,
            id: expect.any(String),
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockAssignment,
            task: { ...mockTask, id: expect.any(String) },
            id: expect.any(String),
        });
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...deliverable,
                task: { ...mockTask, id: expect.any(String) },
                id: expect.any(String),
            });
        });
    });
    test("save a new task with schedules", async () => {
        const author = new models.User({
            name: "name",
            displayName: "displayName",
            tenantId,
            username: "username",
            roles: [models.Role.USER],
            cognitoId: "cognitoId",
        });

        const pickUpSchedule = {
            timeRelation: models.TimeRelation.BETWEEN,
            timePrimary: "10:30",
            timeSecondary: "11:30",
            date: new Date("2021-02-01"),
        };

        const dropOffSchedule = {
            timeRelation: models.TimeRelation.BETWEEN,
            timePrimary: "10:30",
            timeSecondary: "08:30",
            date: new Date("2021-02-02"),
        };

        const mockPickUpSchedule = new models.Schedule({
            relation: models.TimeRelation.BETWEEN,
            timePrimary: "2021-02-01T10:30:00.000Z",
            timeSecondary: "2021-02-01T11:30:00.000Z",
        });
        // it should set the timeSecondary to the next day on account of
        // the secondary time being before the primary time
        const mockDropOffSchedule = new models.Schedule({
            relation: models.TimeRelation.BETWEEN,
            timePrimary: "2021-02-02T10:30:00.000Z",
            timeSecondary: "2021-02-03T08:30:00.000Z",
        });

        const { id: authorId } = await DataStore.save(author);
        const saveSpy = jest.spyOn(DataStore, "save");

        const data = {
            locations: {
                pickUpLocation: null,
                dropOffLocation: null,
            },
            deliverables: {},
            comment: { body: "" },
            establishmentLocation: null,
            schedule: { pickUp: pickUpSchedule, dropOff: dropOffSchedule },
            requesterContact: {
                name: "some name",
                telephoneNumber: "01234567890",
            },
            timeOfCall: "2021-02-01T12:00:58.987Z",
        };
        const mockTask = new models.Task({
            createdBy: author,
            pickUpLocation: null,
            dropOffLocation: null,
            establishmentLocation: null,
            pickUpSchedule: mockPickUpSchedule,
            dropOffSchedule: mockDropOffSchedule,
            timeOfCall: "2021-02-01T12:00:58.987Z",
            requesterContact: {
                name: "some name",
                telephoneNumber: "01234567890",
            },
            status: models.TaskStatus.FUTURE,
            dateCreated: new Date().toISOString().split("T")[0],
            tenantId,
        });
        await saveNewTaskToDataStore(data, tenantId, authorId);
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTask,
            id: expect.any(String),
        });
    });
    test("save a new task with locations", async () => {
        const author = new models.User({
            name: "name",
            displayName: "displayName",
            tenantId,
            username: "username",
            roles: [models.Role.USER],
            cognitoId: "cognitoId",
        });

        const { id: authorId } = await DataStore.save(author);
        const saveSpy = jest.spyOn(DataStore, "save");

        const pickUpLocation = new models.Location({
            line1: "line 1",
            line2: "line 2",
            town: "town",
            country: "country",
            county: "county",
            contact: {
                name: "name loc",
                telephoneNumber: "01234567914",
            },
            tenantId,
        });

        const dropOffLocation = new models.Location({
            line1: "drop line 1",
            line2: "drop line 2",
            town: "drop town",
            country: "drop country",
            county: "drop county",
            contact: {
                name: "drop name loc",
                telephoneNumber: "01734567914",
            },
            tenantId,
        });

        const data = {
            locations: {
                pickUpLocation,
                dropOffLocation,
            },
            deliverables: {},
            comment: { body: "" },
            establishmentLocation: null,
            schedule: { pickUp: null, dropOff: null },
            requesterContact: {
                name: "some name",
                telephoneNumber: "01234567890",
            },
            timeOfCall: "2021-02-01T12:00:58.987Z",
        };
        const mockTask = new models.Task({
            createdBy: author,
            pickUpLocation,
            dropOffLocation,
            establishmentLocation: null,
            pickUpSchedule: null,
            dropOffSchedule: null,
            timeOfCall: "2021-02-01T12:00:58.987Z",
            requesterContact: {
                name: "some name",
                telephoneNumber: "01234567890",
            },
            status: models.TaskStatus.NEW,
            dateCreated: new Date().toISOString().split("T")[0],
            tenantId,
        });
        await saveNewTaskToDataStore(data, tenantId, authorId);
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTask,
            id: expect.any(String),
        });
    });
    test("save a new task with a comment", async () => {
        const author = new models.User({
            name: "name",
            displayName: "displayName",
            tenantId,
            username: "username",
            roles: [models.Role.USER],
            cognitoId: "cognitoId",
        });

        const { id: authorId } = await DataStore.save(author);
        const saveSpy = jest.spyOn(DataStore, "save");

        const establishmentLocation = new models.Location({
            line1: "line 1",
            line2: "line 2",
            town: "town",
            country: "country",
            county: "county",
            contact: {
                name: "name loc",
                telephoneNumber: "01234567914",
            },
            tenantId,
        });
        const data = {
            locations: {
                pickUpLocation: null,
                dropOffLocation: null,
            },
            comment: { body: "some comment" },
            deliverables: {},
            establishmentLocation,
            schedule: { pickUp: null, dropOff: null },
            requesterContact: {
                name: "some name",
                telephoneNumber: "01234567890",
            },
            timeOfCall: "2021-02-01T12:00:58.987Z",
        };
        const mockTask = new models.Task({
            createdBy: author,
            establishmentLocation,
            pickUpLocation: null,
            dropOffLocation: null,
            pickUpSchedule: null,
            dropOffSchedule: null,
            timeOfCall: "2021-02-01T12:00:58.987Z",
            requesterContact: {
                name: "some name",
                telephoneNumber: "01234567890",
            },
            status: models.TaskStatus.NEW,
            dateCreated: new Date().toISOString().split("T")[0],
            tenantId,
        });
        const mockComment = new models.Comment({
            body: "some comment",
            author,
            parentId: mockTask.id,
            tenantId,
        });
        await saveNewTaskToDataStore(data, tenantId, authorId);
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTask,
            id: expect.any(String),
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockComment,
            id: expect.any(String),
            parentId: expect.any(String),
        });
    });
});
