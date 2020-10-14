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

export function saveLogin(apiBearer) {
    localStorage.setItem("apiBearer", apiBearer);
}

export function getLogin() {
    const result = localStorage.getItem("apiBearer");
    return result ? result : "";
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
    const result = localStorage.getItem("apiURL");
    return result ? result : "";
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

export function determineTaskType(task) {
    if (task.time_cancelled) {
        return { tasksCancelled: [task] };
    } else if (task.time_rejected) {
        return { tasksRejected: [task] };
    } else if (!task.assigned_riders || !task.assigned_riders.length) {
        return { tasksNew: [task] };
    } else if ((task.assigned_riders.length) && !task.time_picked_up) {
        return { tasksActive: [task] };
    } else if ((task.assigned_riders.length) && task.time_picked_up && !determineTaskFinishedState(task)) {
        return { tasksPickedUp: [task] };
    } else if (determineTaskFinishedState(task)) {
        return { tasksDelivered: [task] };
    } else {
        return null;
    }
}

function recursiveRelaySearch(uuidToFind, task) {
    if (task.uuid === uuidToFind)
        return true
    else if (task.relay_next)
        return recursiveRelaySearch(uuidToFind, task.relay_next)
    else
        return false
}

export function findExistingTaskParent(tasks, uuid) {
    // this returns the PARENT if given the UUID of a relay task
    let result = {};
    let listType = undefined;
    let index = undefined;
    let task = undefined;

    for (const [type, value] of Object.entries(tasks)) {
        result = value.filter(recursiveRelaySearch.bind(this, uuid));
        if (result.length === 1) {
            index = value.indexOf(result[0]);
            task = result[0]
            listType = type;
            return { listType, index, task };
        }
    }
    return { listType, index, task };
}

export function recursiveFindTaskChild(task, uuid) {
    if (task.uuid === uuid)
        return task
    else
        return recursiveFindTaskChild(task.relay_next, uuid)

}

export function findExistingTask(tasks, uuid) {
    const {listType, index, task} = findExistingTaskParent(tasks, uuid)
    if (task)
        return task.uuid === uuid ? {listType, index, task} : {listType, index, task: recursiveFindTaskChild(task, uuid)}
    else
        return {listType, index, task}


}

export function spliceExistingTask(tasks, uuid) {
    let result = {};
    let listType = undefined;
    let index = undefined;
    let task = undefined;
    for (const [type, value] of Object.entries(tasks)) {
        result = value.filter(task => task.uuid === uuid);
        if (result.length === 1) {
            index = value.indexOf(result[0]);
            task = value.splice(index, 1)[0]
            listType = type;
        }
    }
    return { listType, index, task };
}
