import { DataStore } from "aws-amplify";
import _ from "lodash";
import * as models from "../../../models";
import { ResolvedTaskAssignee } from "../../../resolved-models";

const ignoredFields = [
    "id",
    "_version",
    "_lastChangedAt",
    "_deleted",
    "updatedAt",
    "createdAt",
];

export default async function generateMultipleDuplicatedTaskModels(
    tasks: models.Task[],
    tenantId: string,
    whoamiId: string,
    copyAssignees = false,
    assigneeId: string | null = null,
    assigneeRole: models.Role | null = null,
    copyCommentsUserId: string | null = null
) {
    if (!tenantId) throw new Error("tenantId is required");
    if (!whoamiId) throw new Error("whoamiId is required");
    const whoami = await DataStore.query(models.User, whoamiId);
    if (!whoami) throw new Error("author not found");
    const allAssignees = await DataStore.query(models.TaskAssignee);
    const allDeliverables = await DataStore.query(models.Deliverable);
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const result = await Promise.all(
        Object.values(tasks).map(async (task) => {
            let {
                id,
                updatedAt,
                createdAt,
                timePickedUp,
                timeDroppedOff,
                timePickedUpSenderName,
                timeDroppedOffRecipientName,
                timeRiderHome,
                timeRejected,
                timeCancelled,
                //riderResponsibility,
                createdBy,
                comments,
                assignees,
                deliverables,
                ...rest
            } = { ...task };

            let dropOffLocation = await task.dropOffLocation;
            let pickUpLocation = await task.pickUpLocation;
            let establishmentLocation = await task.establishmentLocation;

            const locationModels = [];

            // split off locations into new models if they are unlisted ones
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
                status: models.TaskStatus.NEW,
                pickUpLocation,
                dropOffLocation,
                createdBy: whoami,
                establishmentLocation,
                dateCreated: today.toISOString().split("T")[0],
                tenantId,
            });

            const existingDeliverables = await DataStore.query(
                models.Deliverable,
                (d) => d.task.id.eq(task.id)
            );
            let assigneeModels: models.TaskAssignee[] = [];
            if (copyAssignees) {
                const existingAssignments = await DataStore.query(
                    models.TaskAssignee,
                    (a) => a.task.id.eq(task.id)
                );
                const existingAssignmentsResolved = await Promise.all(
                    existingAssignments.map(async (a) => {
                        const assignee = await a.assignee;
                        return { ...a, assignee };
                    })
                );
                assigneeModels = existingAssignmentsResolved.map((a) => {
                    return new models.TaskAssignee({
                        task: newTaskData,
                        assignee: a.assignee,
                        tenantId,
                        role: a.role,
                    });
                });
                if (assigneeId && assigneeRole) {
                    if (
                        !existingAssignmentsResolved.find(
                            (a) =>
                                a.assignee?.id === assigneeId &&
                                a.role === assigneeRole
                        )
                    ) {
                        const user = await DataStore.query(
                            models.User,
                            assigneeId
                        );
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
                if (assigneeModels.find((a) => a.role === models.Role.RIDER)) {
                    let riderResponsibility = null;
                    const riders = assigneeModels
                        .filter((a) => a.role === models.Role.RIDER)
                        .map((a) => a.assignee);
                    if (riders.length > 0) {
                        const rider = await riders[riders.length - 1];
                        if (rider && rider.riderResponsibility) {
                            riderResponsibility = rider.riderResponsibility;
                        }
                    }
                    const { comments, assignees, deliverables, ...rest } =
                        newTaskData;
                    newTaskData = new models.Task({
                        ...rest,
                        riderResponsibility,
                        status: models.TaskStatus.ACTIVE,
                        createdBy: whoami,
                        pickUpLocation,
                        dropOffLocation,
                        establishmentLocation,
                        dateCreated: today.toISOString().split("T")[0],
                        tenantId,
                    });
                    // go back and update the now out of date task references
                    assigneeModels = assigneeModels.map((a) => {
                        return models.TaskAssignee.copyOf(a, (updated) => {
                            updated.task = newTaskData;
                        });
                    });
                }
            }
            const deliverablesResult = existingDeliverables.map(
                (del) =>
                    new models.Deliverable({
                        ..._.omit(del, ...ignoredFields),
                        task: newTaskData,
                        tenantId,
                    })
            );
            let newComments: models.Comment[] = [];
            if (copyCommentsUserId) {
                const oldComments = await DataStore.query(models.Comment, (c) =>
                    c.parentId.eq(task.id)
                );
                const filteredComments: models.Comment[] = [];
                for (const c of oldComments) {
                    const author = await c.author;
                    if (author?.id === copyCommentsUserId) {
                        filteredComments.push(c);
                    }
                }
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
            //console.log("locationmodels", locationModels);
            //console.log("newTaskData", newTaskData);
            //console.log("assigneeModels", assigneeModels);
            //console.log("deliverablesResult", deliverablesResult);
            //console.log("newComments", newComments);
            await Promise.all(
                locationModels.flat().map((l) => DataStore.save(l))
            );
            await DataStore.save(newTaskData);
            await Promise.all(
                deliverablesResult.flat().map((d) => DataStore.save(d))
            );
            await Promise.all(
                assigneeModels.flat().map((a) => DataStore.save(a))
            );
            await Promise.all(newComments.flat().map((c) => DataStore.save(c)));
            return [];
        })
    );
    return result.flat();
}
