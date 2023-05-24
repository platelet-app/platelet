import * as models from "../models";
import { DataStore } from "aws-amplify";

const updatePendingTask = async (
    task: models.Task,
    whoamiId: string,
    tenantId: string,
    action: "accept" | "reject"
): Promise<{ task: models.Task; assignment: models.TaskAssignee }> => {
    const { id, status } = task;
    if (status !== models.TaskStatus.PENDING) {
        throw new Error(`Task ${id} is not pending`);
    }
    const existingTask = await DataStore.query(models.Task, id);
    if (!existingTask) {
        throw new Error(`Task ${id} does not exist`);
    }
    const assignee = await DataStore.query(models.User, whoamiId);
    if (!assignee) {
        throw new Error(`User ${whoamiId} does not exist`);
    }
    if (!assignee.roles.includes(models.Role.COORDINATOR)) {
        throw new Error(`User ${assignee.id} is not a coordinator`);
    }
    const assignment = await DataStore.save(
        new models.TaskAssignee({
            assignee,
            task: existingTask,
            role: models.Role.COORDINATOR,
            tenantId,
        })
    );
    if (action === "reject") {
        const timeNow = new Date().toISOString();
        const updatedTask = await DataStore.save(
            models.Task.copyOf(existingTask, (updated) => {
                updated.status = models.TaskStatus.REJECTED;
                updated.timeRejected = timeNow;
            })
        );
        return { assignment, task: updatedTask };
    } else {
        const updatedTask = await DataStore.save(
            models.Task.copyOf(existingTask, (updated) => {
                updated.status = models.TaskStatus.NEW;
            })
        );
        return { assignment, task: updatedTask };
    }
};

export default updatePendingTask;
