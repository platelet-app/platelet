import * as models from "../models";
import { DataStore } from "aws-amplify";

export default async function determineTaskStatus(
    task: models.Task,
    riderAssignees: models.TaskAssignee[] | null = null
) {
    // sort out cancelled and rejected first
    if (!!task.timeCancelled) {
        return !!task.timePickedUp
            ? models.TaskStatus.ABANDONED
            : models.TaskStatus.CANCELLED;
    } else if (!!task.timeRejected) {
        return models.TaskStatus.REJECTED;
    }
    if (!riderAssignees) {
        riderAssignees = await DataStore.query(models.TaskAssignee, (a) =>
            a.and((a) => [a.task.id.eq(task.id), a.role.eq(models.Role.RIDER)])
        );
    }
    const isRiderAssigned = riderAssignees.length > 0;
    if (!isRiderAssigned) {
        return models.TaskStatus.NEW;
    } else if (isRiderAssigned && !!!task.timePickedUp) {
        return models.TaskStatus.ACTIVE;
    } else if (
        isRiderAssigned &&
        !!task.timePickedUp &&
        !!!task.timeDroppedOff
    ) {
        return models.TaskStatus.PICKED_UP;
    } else if (
        isRiderAssigned &&
        !!task.timePickedUp &&
        !!task.timeDroppedOff &&
        !!!task.timeRiderHome
    ) {
        return models.TaskStatus.DROPPED_OFF;
    } else if (
        isRiderAssigned &&
        !!task.timePickedUp &&
        !!task.timeDroppedOff &&
        !!task.timeRiderHome
    ) {
        return models.TaskStatus.COMPLETED;
    }
}
