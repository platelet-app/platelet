import {determineTaskType} from "../../utilities";
import _ from "lodash";
import update from "immutability-helper";

export function taskGroupSort(a, b) {
    return a.order_in_relay - b.order_in_relay;
}

export function convertTaskListsToObjects(tasks) {
    let groupedTasks = {};
    for (const [key, value] of Object.entries(tasks)) {
        groupedTasks[key] = convertToRelays(value);
    }

    return groupedTasks;
}

export function shiftParentIDs(taskGroup, shiftValue = 1000000) {
    const shifted = {};
    for (const task of Object.values(taskGroup)) {
        let newPID = 0;
        for (const i of Object.values(task)) {
            if (!newPID)
                newPID = i.parent_id += shiftValue;
            break;
        }
        shifted[newPID] = task;
    }
    return shifted;
}

export function convertToRelays(group) {
    let result = {};
    let currentParentId = -1;
    let currentIndex = -1;
    for (const t of group) {
        if (currentParentId !== t.parent_id) {
            currentParentId = t.parent_id;
            currentIndex += 1;
            result[currentParentId] = {};
        }
        result[currentParentId][t.uuid] = t;
    }
    return result;

}

export function sortAndConcat(tasks, data) {
    const sorted = determineTaskType(data);
    const result = {};
    for (const [key, value] of Object.entries(sorted)) {
        result[key] = {...tasks[key], ...value}
        //sorted[key] = sorted[key].sort((a, b) => b[0].parent_id - a[0].parent_id);
    }
    return {...tasks, ...result};
}


export const addAssigneeToList = (task, user, role = "rider") => {
    if (role === "rider") {
        // add the assignee to the list
        const assigneesList = [...task.assigned_riders, user]
        return {
            assigned_riders: assigneesList,
            assigned_riders_display_string: assigneesList.map(
                (user) => user.display_name
            ).join(", ")
        }
    } else if (role === "coordinator") {
        // add the assignee to the list
        const assigneesList = [...task.assigned_coordinators, user]
        return {
            assigned_coordinators: assigneesList,
            assigned_coordinators_display_string: assigneesList.map(
                (user) => user.display_name
            ).join(", ")
        }
    }
}

export const removeAssigneeFromList = (task, userUUID, role = "rider") => {
    if (role === "rider") {
        // remove the assignee from the list
        const assigneesList = task.assigned_riders.filter(u => u.uuid !== userUUID)
        return {
            assigned_riders: assigneesList,
            assigned_riders_display_string: assigneesList.map(
                (user) => user.display_name
            ).join(", ")
        }
    } else if (role === "coordinator") {
        // remove the assignee from the list
        const assigneesList = task.assigned_coordinators.filter(u => u.uuid !== userUUID)
        return {
            assigned_coordinators: assigneesList,
            assigned_coordinators_display_string: assigneesList.map(
                (user) => user.display_name
            ).join(", ")
        }
    }
}

export function removeParentFromTasks(tasks, listType, parent_id) {
    const newList = _.omit(tasks[listType], parent_id)
    return update(tasks,
        {[listType]: {$set: newList}}
    );
}
