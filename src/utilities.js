import React from 'react';
import uuidBase62 from 'uuid-base62';
import { v4 as uuidv4 } from 'uuid';

export function encodeUUID(uuid) {
    return uuid ? uuidBase62.encode(uuid) : "";
}

export function decodeUUID(uuid) {
    return uuid ? uuidBase62.decode(uuid) : "";
}

export function convertDate(timestamp) {
    if (timestamp) {
        return new Date(timestamp).toLocaleString();
    }
    return "";
}

export function saveDashboardRoleMode(mode) {
    localStorage.setItem("dashboardRoleMode", mode);
}

export function getDashboardRoleMode() {
    return localStorage.getItem("dashboardRoleMode") || "coordinator";
}

export function saveLogin(apiBearer) {
    localStorage.setItem("apiBearer", apiBearer);
}

export function getLogin() {
    return localStorage.getItem("apiBearer") || "";
}

export function createTabIdentifier() {
    const tabUUID = uuidv4();
    sessionStorage.setItem("tabUUID", tabUUID)
    return tabUUID;
}

export function getTabIdentifier() {
    return sessionStorage.getItem("tabUUID")
}

export function saveApiURL(apiURL) {
    localStorage.setItem("apiURL", apiURL);

}

export function getApiURL() {
    return process.env.REACT_APP_API_URL;
}

export function deleteLogin() {
    localStorage.removeItem("apiBearer")
}

export function deleteApiURL() {
    localStorage.removeItem("apiURL")
}

export function saveLocalStorageViewMode(status) {
    localStorage.setItem("viewMode", status);
}

export function getLocalStorageViewMode() {
    return localStorage.getItem("viewMode");
}


export function debounce (func, delay) {
    let inDebounce
    let result;
    return function() {
        const context = this
        const args = arguments
        clearTimeout(inDebounce)
        inDebounce = setTimeout(() =>
                result = func.apply(context, args)
            , delay)
        return result;
    }
}

export function throttle(func, limit) {
    let lastFunc
    let lastRan
    let result;
    return function() {
        const context = this
        const args = arguments
        if (!lastRan) {
            result = func.apply(context, args)
            lastRan = Date.now()
        } else {
            clearTimeout(lastFunc)
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    result = func.apply(context, args)
                    lastRan = Date.now()
                }
            }, limit - (Date.now() - lastRan))
        }
        return result;
    }
}

export function orderTaskList(tasks) {
    let tasksNew = [];
    let tasksActivePickedUp = [];
    let tasksDelivered = [];
    let tasksCancelled = [];
    let tasksRejected = [];
    if (!tasks)
        return {tasksNew: [], tasksActive: [], tasksPickedUp: [], tasksDelivered: []}
    tasks.forEach((task) => {
        if (typeof (task.time_of_call) === "string") {
            task.time_of_call = new Date(task.time_of_call);
        }
        if (task.time_cancelled) {
            tasksCancelled.unshift(task);
        } else if (task.time_rejected) {
            tasksRejected.unshift(task);
        } else if (!task.assigned_riders || !task.assigned_riders.length) {
            tasksNew.unshift(task);
        } else if ((task.assigned_riders.length || task.time_picked_up) && !task.time_dropped_off) {
            tasksActivePickedUp.unshift(task);
        } else if (task.time_dropped_off) {
            tasksDelivered.unshift(task);
        } else {
            tasksNew.unshift(task);
        }
    });

    tasksNew.sort(function (a, b) {
        return a.time_of_call > b.time_of_call ? -1 : a.time_of_call < b.time_of_call ? 1 : 0;
    });
    tasksCancelled.sort(function (a, b) {
        return a.time_of_call > b.time_of_call ? -1 : a.time_of_call < b.time_of_call ? 1 : 0;
    });
    tasksRejected.sort(function (a, b) {
        return a.time_of_call > b.time_of_call ? -1 : a.time_of_call < b.time_of_call ? 1 : 0;
    });
    tasksActivePickedUp.sort(function (b, a) {
        return a.time_of_call > b.time_of_call ? -1 : a.time_of_call < b.time_of_call ? 1 : 0;
    });
    tasksDelivered.sort(function (b, a) {
        return a.time_of_call > b.time_of_call ? -1 : a.time_of_call < b.time_of_call ? 1 : 0;
    });
    const tasksRejectedCancelled = tasksCancelled.concat(tasksRejected)
    return {tasksNew, tasksActivePickedUp, tasksDelivered, tasksRejectedCancelled}
}

function determineTaskFinishedState(task) {
    if (task.relay_next) {
        return determineTaskFinishedState(task.relay_next)
    } else {
        return !!task.time_dropped_off
    }
}

export function determineTaskType(taskGroup) {
    const result = {};
    // sort out cancelled and rejected first
    const cancelledRejected = taskGroup.filter(t => !!t.time_rejected || !!t.time_cancelled);
    const filteredCancelledRejected = taskGroup.filter(t => !!!t.time_rejected && !!!t.time_cancelled);
    for (const t of cancelledRejected) {
        if (!!t.time_cancelled) {
            result['tasksCancelled'] = result['tasksCancelled'] ? [...result['tasksCancelled'], t] : [t]
        } else if (!!t.time_rejected) {
            result['tasksRejected'] = result['tasksRejected'] ? [...result['tasksRejected'], t] : [t]
        }
    }
    if (filteredCancelledRejected.length === 0) {
        return result;
        // if it has no assigned riders, it goes in new
    } else if (!filteredCancelledRejected.some(t => t.assigned_riders.length)) {
        return { ...result, tasksNew: filteredCancelledRejected };
        // if it has any assigned riders, but none are picked up, goes into active
    } else if ((taskGroup.some(t => t.assigned_riders.length) && !taskGroup.some(t => !!t.time_picked_up))) {
        return { ...result, tasksActive: filteredCancelledRejected };
        // some are not delivered but some are picked up, it goes in picked up
    } else if ((taskGroup.some(t => t.assigned_riders.length)) && taskGroup.some(t => !!t.time_picked_up) && taskGroup.some(t => !!!t.time_dropped_off)) {
        return { ...result, tasksPickedUp: filteredCancelledRejected };
        // else if the last one is delivered
    } else if ((taskGroup.some(t => t.assigned_riders.length)) && taskGroup.some(t => !!t.time_picked_up) && !taskGroup.some(t => !!!t.time_dropped_off)) {
        return { ...result, tasksDelivered: filteredCancelledRejected };
    } else {
        return null;
    }
}

function recursiveRelaySearch(uuidToFind, task) {
    if (task.uuid === uuidToFind) {
        return true
    } else if (task.relay_next) {
        return recursiveRelaySearch(uuidToFind, task.relay_next)
    } else {
        return false
    }
}

export function findExistingTaskParentByID(tasks, ID) {
    // this returns the task parent by it's integer id
    let listType = undefined;
    let index = undefined;
    let taskGroup = undefined;
    for (const [type, value] of Object.entries(tasks)) {
        if (type === "tasksCancelled" || type === "tasksRejected") {
            continue;
        }
        taskGroup = value.find((t) => t[0].parent_id === ID);
        if (taskGroup) {
            index = value.indexOf(taskGroup);
            listType = type;
            return { listType, index, taskGroup };
        }
    }
    return { listType, index, taskGroup };
}

export function findExistingTaskParent(tasks, uuid) {
    // this returns the PARENT list if given the UUID of any task
    let listType = undefined;
    let index = undefined;
    let taskGroup = undefined;

    for (const [type, value] of Object.entries(tasks)) {
        taskGroup = value.find(group => group.map(t => t.uuid).includes(uuid));
        if (taskGroup) {
            index = value.indexOf(taskGroup);
            listType = type;
            return { listType, index, taskGroup };
        }
    }
    return { listType, index, taskGroup };
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
        return taskParent.taskGroup.find(t => t.uuid === uuid) || undefined
    return undefined;
}

export function spliceExistingTask(tasks, uuid) {
    let result = {};
    let listType = undefined;
    let index = undefined;
    let task = undefined;
    for (const [type, value] of Object.entries(tasks)) {
        result = value.find(task => task.uuid === uuid);
        if (result) {
            index = value.indexOf(result);
            task = value.splice(index, 1)[0]
            listType = type;
        }
    }
    return { listType, index, task };
}
