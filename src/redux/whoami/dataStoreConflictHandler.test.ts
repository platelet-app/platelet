import moment from "moment";
import * as models from "../../models";
import dataStoreConflictHandler from "./dataStoreConflictHandler";
import { PersistentModelConstructor, OpType } from "@aws-amplify/datastore";
import { DataStore } from "aws-amplify";

const tenantId = "tenantId";

describe("dataStoreConflictHandler", () => {
    test.each`
        timeField
        ${"timePickedUp"} | ${"timeDroppedOff"} | ${"timeRiderHome"} | ${"timeCancelled"} | ${"timeRejected"}
    `(
        "should return the local data for any times if the remote data is null (individual times)",
        async ({ timeField }) => {
            const timePickedUpSenderName = "timePickedUpSenderName";
            const timeDroppedOffRecipientName = "timeDroppedOffRecipientName";

            const data = {
                timePickedUpSenderName:
                    timeField === "timePickedUp"
                        ? timePickedUpSenderName
                        : null,
                timeDroppedOffRecipientName:
                    timeField === "timeDroppedOff"
                        ? timeDroppedOffRecipientName
                        : null,
                timePickedUp:
                    timeField === "timePickedUp"
                        ? moment().toISOString()
                        : null,
                timeDroppedOff:
                    timeField === "timeDroppedOff"
                        ? moment().toISOString()
                        : null,
                timeRiderHome:
                    timeField === "timeRiderHome"
                        ? moment().toISOString()
                        : null,
                timeCancelled:
                    timeField === "timeCancelled"
                        ? moment().toISOString()
                        : null,
                timeRejected:
                    timeField === "timeRejected"
                        ? moment().toISOString()
                        : null,
            };

            const createdBy = new models.User({
                tenantId,
                username: "test",
                cognitoId: "test",
                displayName: "test",
                roles: [models.Role.COORDINATOR],
            });
            const mockRemoteTask = await DataStore.save(
                new models.Task({
                    priority: models.Priority.HIGH,
                    status: models.TaskStatus.ACTIVE,
                    tenantId,
                    createdBy,
                })
            );

            const mockRider = await DataStore.save(
                new models.User({
                    tenantId,
                    displayName: "test",
                    username: "test",
                    cognitoId: "test",
                    roles: [models.Role.RIDER],
                })
            );

            await DataStore.save(
                new models.TaskAssignee({
                    task: mockRemoteTask,
                    assignee: mockRider,
                    role: models.Role.RIDER,
                    tenantId,
                })
            );

            const mockLocalTask = {
                ...mockRemoteTask,
                ...data,
                priority: models.Priority.LOW,
            };

            const result = await dataStoreConflictHandler({
                modelConstructor:
                    models.Task as PersistentModelConstructor<any>,
                localModel: mockLocalTask,
                remoteModel: mockRemoteTask,
                operation: OpType.UPDATE,
                attempts: 1,
            });

            expect(result).toEqual({
                ...mockRemoteTask,
                ...data,
                status: expect.any(String),
            });
        }
    );
    test("should return the local data for rider times if the remote data is null", async () => {
        const newMoment = moment();
        const timePickedUp = newMoment.toISOString();
        const timeDroppedOff = newMoment.subtract(1, "minute").toISOString();
        const timeRiderHome = newMoment.subtract(2, "minute").toISOString();
        const timePickedUpSenderName = "timePickedUpSenderName";
        const timeDroppedOffRecipientName = "timeDroppedOffRecipientName";

        const createdBy = new models.User({
            tenantId,
            username: "test",
            cognitoId: "test",
            displayName: "test",
            roles: [models.Role.COORDINATOR],
        });
        const mockRemoteTask = await DataStore.save(
            new models.Task({
                priority: models.Priority.HIGH,
                status: models.TaskStatus.ACTIVE,
                tenantId,
                createdBy,
            })
        );

        const mockRider = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "test",
                username: "test",
                cognitoId: "test",
                roles: [models.Role.RIDER],
            })
        );

        await DataStore.save(
            new models.TaskAssignee({
                task: mockRemoteTask,
                assignee: mockRider,
                role: models.Role.RIDER,
                tenantId,
            })
        );

        const mockLocalTask = {
            ...mockRemoteTask,
            priority: models.Priority.LOW,
            status: models.TaskStatus.COMPLETED,
            timeDroppedOff,
            timePickedUp,
            timeRiderHome,
            timePickedUpSenderName,
            timeDroppedOffRecipientName,
        };

        const result = await dataStoreConflictHandler({
            modelConstructor: models.Task as PersistentModelConstructor<any>,
            localModel: mockLocalTask,
            remoteModel: mockRemoteTask,
            operation: OpType.UPDATE,
            attempts: 1,
        });

        expect(result).toEqual({
            ...mockRemoteTask,
            status: models.TaskStatus.COMPLETED,
            timeDroppedOff,
            timePickedUp,
            timeRiderHome,
            timePickedUpSenderName,
            timeDroppedOffRecipientName,
        });
    });
});
