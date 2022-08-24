import { DataStore } from "aws-amplify";
import _ from "lodash";
import { tasksStatus, userRoles } from "../../../apiConsts";
import * as models from "../../../models";

export default async function generateMultipleDuplicatedTaskModels(
    tasks,
    copyAssignees = false,
    assignCoordinatorId = null,
    copyCommentsUserId = null
) {
    const allAssignees = await DataStore.query(models.TaskAssignee);
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

            const deliverables = await DataStore.query(models.Deliverable);
            const filteredDeliverables = deliverables.filter(
                (d) => d.task?.id === task.id
            );
            let assigneeModels = [];
            if (copyAssignees) {
                const assignees = allAssignees.filter(
                    (a) => a.task?.id === task.id
                );
                // if there is a rider then make it active
                // and set the rider role back to original
                if (assignees.find((a) => a.role === userRoles.rider)) {
                    newTaskData = new models.Task({
                        ...newTaskData,
                        riderResponsibility,
                        status: tasksStatus.active,
                    });
                }
                assigneeModels = assignees.map(
                    (a) => new models.TaskAssignee({ ...a, task: newTaskData })
                );
            }
            if (assignCoordinatorId) {
                if (
                    !assigneeModels.find(
                        (a) => a.assignee?.id === assignCoordinatorId
                    )
                ) {
                    const user = await DataStore.query(
                        models.User,
                        assignCoordinatorId
                    );
                    if (user) {
                        const coordAssignee = new models.TaskAssignee({
                            task: newTaskData,
                            assignee: user,
                            role: userRoles.coordinator,
                        });
                        assigneeModels = [...assigneeModels, coordAssignee];
                    }
                }
            }
            // only refer to the new task model after this point
            const deliverablesResult = filteredDeliverables.map(
                (del) => new models.Deliverable({ ...del, task: newTaskData })
            );
            return [...deliverablesResult, ...assigneeModels, newTaskData];
        })
    );
    return result.flat();
}
