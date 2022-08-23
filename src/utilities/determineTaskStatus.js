import * as models from "../models";
import { tasksStatus, userRoles } from "../apiConsts";
import { DataStore } from "aws-amplify";

export async function determineTaskStatus(task, riderAssignees = null) {
    // sort out cancelled and rejected first
    if (!!task.timeCancelled) {
        return !!task.timePickedUp
            ? tasksStatus.abandoned
            : tasksStatus.cancelled;
    } else if (!!task.timeRejected) {
        return tasksStatus.rejected;
    }
    if (riderAssignees === null) {
        riderAssignees = await DataStore.query(models.TaskAssignee, (a) =>
            a.role("eq", userRoles.rider)
        );
    }
    let isRiderAssigned = false;
    if (task && task.id) {
        isRiderAssigned = riderAssignees.some(
            (a) => a.task && a.task.id === task.id
        );
    }
    if (!isRiderAssigned) {
        return tasksStatus.new;
    } else if (isRiderAssigned && !!!task.timePickedUp) {
        return tasksStatus.active;
    } else if (
        isRiderAssigned &&
        !!task.timePickedUp &&
        !!!task.timeDroppedOff
    ) {
        return tasksStatus.pickedUp;
    } else if (
        isRiderAssigned &&
        !!task.timePickedUp &&
        !!task.timeDroppedOff &&
        !!!task.timeRiderHome
    ) {
        return tasksStatus.droppedOff;
    } else if (
        isRiderAssigned &&
        !!task.timePickedUp &&
        !!task.timeDroppedOff &&
        !!task.timeRiderHome
    ) {
        return tasksStatus.completed;
    }
}
