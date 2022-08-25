import { DataStore } from "aws-amplify";
import _ from "lodash";
import { tasksStatus, userRoles } from "../../../apiConsts";
import * as models from "../../../models";

export default async function generateMultipleDuplicatedTaskModels(
    tasks,
    copyAssignees = false,
    assigneeId = null,
    assigneeRole = null,
    copyCommentsUserId = null
) {
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
                timeRiderHome,
                timeRejected,
                timeCancelled,
                riderResponsibility,
                dropOffLocation,
                pickUpLocation,
                ...rest
            } = { ...task };
            if (pickUpLocation?.listed === 0) {
                pickUpLocation = new models.Location({
                    ...pickUpLocation,
                });
            }
            if (dropOffLocation?.listed === 0) {
                dropOffLocation = new models.Location({
                    ...dropOffLocation,
                });
            }

            let newTaskData = new models.Task({
                ...rest,
                status: tasksStatus.new,
                pickUpLocation,
                dropOffLocation,
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
                    (a) => new models.TaskAssignee({ ...a, task: newTaskData })
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
                });
                // go back and update the now out of date task references
                assigneeModels = assigneeModels.map((a) => ({
                    ...a,
                    task: newTaskData,
                }));
            }
            const deliverablesResult = filteredDeliverables.map(
                (del) => new models.Deliverable({ ...del, task: newTaskData })
            );
            return [...deliverablesResult, ...assigneeModels, newTaskData];
        })
    );
    return result.flat();
}
