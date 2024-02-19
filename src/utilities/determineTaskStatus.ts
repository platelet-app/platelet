import * as models from "../models";
import { DataStore } from "aws-amplify";

interface TaskInterface {
    id: string;
    timeCancelled?: string | null;
    timeDroppedOff?: string | null;
    timePickedUp?: string | null;
    timeRiderHome?: string | null;
    timeRejected?: string | null;
}

interface Assignee {
    task?: TaskInterface | null;
    assignee: object;
}

export default async function determineTaskStatus(
    task: TaskInterface,
    riderAssignees: Assignee[] | null = null
) {
    // sort out cancelled and rejected first
    if (!!task.timeCancelled) {
        return !!task.timePickedUp
            ? models.TaskStatus.ABANDONED
            : models.TaskStatus.CANCELLED;
    } else if (!!task.timeRejected) {
        return models.TaskStatus.REJECTED;
    }

    if (!!task.timePickedUp && !!!task.timeDroppedOff) {
        return models.TaskStatus.PICKED_UP;
    } else if (
        !!task.timePickedUp &&
        !!task.timeDroppedOff &&
        !!!task.timeRiderHome
    ) {
        return models.TaskStatus.DROPPED_OFF;
    } else if (
        !!task.timePickedUp &&
        !!task.timeDroppedOff &&
        !!task.timeRiderHome
    ) {
        return models.TaskStatus.COMPLETED;
    }
    if (riderAssignees === null) {
        riderAssignees = (await DataStore.query(models.TaskAssignee, (a) =>
            a.role("eq", models.Role.RIDER)
        )) as Assignee[];
    }
    let isRiderAssigned = false;
    if (task && task.id) {
        isRiderAssigned = riderAssignees.some(
            (a) => a.task && a.task.id === task.id
        );
    }
    if (!isRiderAssigned) {
        return models.TaskStatus.NEW;
    } else {
        return models.TaskStatus.ACTIVE;
    }
}
