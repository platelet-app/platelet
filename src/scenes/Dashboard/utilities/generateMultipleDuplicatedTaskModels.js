import { DataStore } from "aws-amplify";
import _ from "lodash";
import { tasksStatus, userRoles } from "../../../apiConsts";
import * as models from "../../../models";

const ignoredFields = [
    "id",
    "_version",
    "_lastChangedAt",
    "_deleted",
    "updatedAt",
    "createdAt",
];

export default async function generateMultipleDuplicatedTaskModels(
    tasks,
    tenantId,
    copyAssignees = false,
    assigneeId = null,
    assigneeRole = null,
    copyCommentsUserId = null
) {
    if (!tenantId) throw new Error("tenantId is required");
    const allAssignees = await DataStore.query(models.TaskAssignee);
    const deliverables = await DataStore.query(models.Deliverable);
    const result = await Promise.all(
        Object.values(tasks).map(async (task) => {
            let {
                id,
                _version,
                _lastChangedAt,
                _deleted,
                updatedAt,
                createdAt,
                timePickedUp,
                timeDroppedOff,
                timePickedUpSenderName,
                timeDroppedOffRecipientName,
                timeRiderHome,
                timeRejected,
                timeCancelled,
                riderResponsibility,
                dropOffLocation,
                pickUpLocation,
                establishmentLocation,
                ...rest
            } = { ...task };

            const locationModels = [];

            if (pickUpLocation?.listed === 0) {
                pickUpLocation = new models.Location({
                    ..._.omit(pickUpLocation, ...ignoredFields),
                    tenantId,
                });
                locationModels.push(pickUpLocation);
            } else if (pickUpLocation) {
                pickUpLocation = await DataStore.query(
                    models.Location,
                    pickUpLocation.id
                );
            }
            if (dropOffLocation?.listed === 0) {
                dropOffLocation = new models.Location({
                    ..._.omit(dropOffLocation, ...ignoredFields),
                    tenantId,
                });
                locationModels.push(dropOffLocation);
            } else if (dropOffLocation) {
                dropOffLocation = await DataStore.query(
                    models.Location,
                    dropOffLocation.id
                );
            }
            if (establishmentLocation?.listed === 0) {
                establishmentLocation = new models.Location({
                    ..._.omit(establishmentLocation, ...ignoredFields),
                    tenantId,
                });
                locationModels.push(establishmentLocation);
            } else if (establishmentLocation) {
                establishmentLocation = await DataStore.query(
                    models.Location,
                    establishmentLocation.id
                );
            }

            let newTaskData = new models.Task({
                ...rest,
                status: tasksStatus.new,
                pickUpLocation,
                dropOffLocation,
                establishmentLocation,
                tenantId,
            });

            const filteredDeliverables = deliverables.filter(
                (d) => d.task?.id === task.id
            );
            let assigneeModels = [];
            if (copyAssignees) {
                const assignees = allAssignees.filter(
                    (a) => a.task?.id === task.id
                );
                assigneeModels = assignees.map(
                    (a) =>
                        new models.TaskAssignee({
                            ..._.omit(a, ...ignoredFields),
                            task: newTaskData,
                            tenantId,
                        })
                );
            }
            if (assigneeId && assigneeRole) {
                if (
                    !assigneeModels.find(
                        (a) =>
                            a.assignee?.id === assigneeId &&
                            a.role === assigneeRole
                    )
                ) {
                    const user = await DataStore.query(models.User, assigneeId);
                    if (user) {
                        const newAssignee = new models.TaskAssignee({
                            task: newTaskData,
                            assignee: user,
                            role: assigneeRole,
                            tenantId,
                        });
                        assigneeModels = [...assigneeModels, newAssignee];
                    }
                }
            }
            // if there is a rider then make it active
            // and set the rider role back to the last rider
            if (assigneeModels.find((a) => a.role === userRoles.rider)) {
                const riders = assigneeModels
                    .filter((a) => a.role === userRoles.rider)
                    .map((a) => a.assignee);
                if (riders.length > 0) {
                    const rider = riders[riders.length - 1];
                    if (rider && rider.riderResponsibility) {
                        riderResponsibility = rider.riderResponsibility;
                    }
                } else {
                    riderResponsibility = null;
                }
                newTaskData = new models.Task({
                    ...newTaskData,
                    riderResponsibility,
                    status: tasksStatus.active,
                    tenantId,
                });
                // go back and update the now out of date task references
                assigneeModels = assigneeModels.map(
                    (a) =>
                        new models.TaskAssignee({
                            ..._.omit(a, ...ignoredFields),
                            task: newTaskData,
                            tenantId,
                        })
                );
            }
            const deliverablesResult = filteredDeliverables.map(
                (del) =>
                    new models.Deliverable({
                        ..._.omit(del, ...ignoredFields),
                        task: newTaskData,
                        tenantId,
                    })
            );
            let newComments = [];
            if (copyCommentsUserId) {
                const oldComments = await DataStore.query(models.Comment, (c) =>
                    c.parentId("eq", task.id)
                );
                const filteredComments = oldComments.filter(
                    (c) => c.author?.id === copyCommentsUserId
                );
                newComments = filteredComments.map(
                    (c) =>
                        new models.Comment({
                            ..._.omit(c, ...ignoredFields),
                            parentId: newTaskData.id,
                            tenantId,
                        })
                );
            }
            // locations models go first, then tasks
            return [
                ...locationModels,
                newTaskData,
                ...deliverablesResult,
                ...assigneeModels,
                ...newComments,
            ];
        })
    );
    return result.flat();
}
