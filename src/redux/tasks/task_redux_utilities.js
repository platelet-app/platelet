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

export function convertTaskGroupToObject(group) {
    let newGroup = {};
    for (const task of group) {
        newGroup[task.uuid] = task;
    }
    return {[group[0].parent_id]: newGroup};
}

export function determineTaskType(taskGroup) {
    const result = {};
    const taskList = Object.values(taskGroup)
    if (taskGroup.length === 0) {
        return null;
    }
    // sort out cancelled and rejected first
    const cancelledRejected = taskList.filter(t => !!t.time_rejected || !!t.time_cancelled);
    const filteredCancelledRejected = taskList.filter(t => !!!t.time_rejected && !!!t.time_cancelled);
    for (const t of cancelledRejected) {
        if (!!t.time_cancelled) {
            result['tasksCancelled'] = result['tasksCancelled'] ? [...result['tasksCancelled'], t] : [t]
        } else if (!!t.time_rejected) {
            result['tasksRejected'] = result['tasksRejected'] ? [...result['tasksRejected'], t] : [t]
        }
    }
    for (const [key, value] of Object.entries(result)) {
        result[key] = convertTaskGroupToObject(value);
    }
    if (filteredCancelledRejected.length === 0) {
        return result;
        // if it has no assigned riders, it goes in new
    } else if (!filteredCancelledRejected.some(t => t.assigned_riders.length)) {
        return { ...result, tasksNew: convertTaskGroupToObject(filteredCancelledRejected) };
        // if it has any assigned riders, but none are picked up, goes into active
    } else if ((taskList.some(t => t.assigned_riders.length) && !taskList.some(t => !!t.time_picked_up))) {
        return { ...result, tasksActive: convertTaskGroupToObject(filteredCancelledRejected) };
        // some are not delivered but some are picked up, it goes in picked up
    } else if ((taskList.some(t => t.assigned_riders.length)) && taskList.some(t => !!t.time_picked_up) && taskList.some(t => !!!t.time_dropped_off)) {
        return { ...result, tasksPickedUp: convertTaskGroupToObject(filteredCancelledRejected) };
        // else if the last one is delivered
    } else if ((taskList.some(t => t.assigned_riders.length)) && taskList.some(t => !!t.time_picked_up) && !taskList.some(t => !!!t.time_dropped_off)) {
        return { ...result, tasksDelivered: convertTaskGroupToObject(filteredCancelledRejected) };
    } else {
        return null;
    }
}
export function findExistingTaskParentByID(tasks, parentID) {
    // this returns the task parent by it's integer id
    let listType = undefined;
    let taskGroup = undefined;
    for (const [listType, value] of Object.entries(tasks)) {
        if (value)
            taskGroup = value[parentID]
        if (taskGroup) {
            return { listType, parentID, taskGroup };
        }
    }
    return { listType, parentID, taskGroup };
}

export function findExistingTaskParent(tasks, uuid) {
    // this returns the PARENT list if given the UUID of any task
    let listType = undefined;
    let taskGroup = undefined;
    let parentID = undefined;


    for (const [listType, value] of Object.entries(tasks)) {
        for (const [key, taskGroup] of Object.entries(value)) {
            const result = taskGroup[uuid]
            let parentID;
            try {
                parentID = parseInt(key);
            } catch (error) {
                parentID = key;
            }

            if (result) {
                return {listType, taskGroup, parentID: parseInt(parentID)};
            }
        }
    }
    return { listType, taskGroup, parentID };
}

export function recursiveFindTaskChild(task, uuid) {
    if (task.uuid === uuid)
        return task
    else
        return recursiveFindTaskChild(task.relay_next, uuid)

}

export function findExistingTask(tasks, uuid) {
    const taskParent = findExistingTaskParent(tasks, uuid);
    if (taskParent.taskGroup)
        return taskParent.taskGroup[uuid]
    return undefined;
}
