import { DataStore } from "aws-amplify";
import * as models from "../../models/index";
import { tasksStatus } from "../../apiConsts";
import { userRoles } from "../../apiConsts";
export const concatTasks = (tasks) =>
    Object.entries(tasks).reduce((accumulator, [key, value]) => {
        return [...accumulator, value.map((t) => t)];
    }, []);

export const getTaskUUIDs = (tasks) => {
    let result = [];
    for (const value of Object.values(tasks)) {
        for (const group of Object.values(value)) {
            result = [...result, ...Object.keys(group)];
        }
    }
    return result;
};

export async function addTask(whoamiId) {
    const date = new Date();
    const timeOfCall = date.toISOString();
    const createdBy = whoamiId
        ? await DataStore.query(models.User, whoamiId)
        : null;
    const newTask = await DataStore.save(
        new models.Task({
            status: tasksStatus.new,
            timeOfCall,
            createdBy,
        })
    );
    await DataStore.save(
        new models.TaskAssignee({
            task: newTask,
            assignee: createdBy,
            role: userRoles.coordinator,
        })
    );
    return newTask;
}

export const getTaskUUIDEtags = (tasks) => {
    let result = {};
    for (const value of Object.values(tasks)) {
        for (const group of Object.values(value)) {
            for (const task of Object.values(group)) {
                result[task.uuid] = task.etag;
            }
        }
    }
    return result;
};
