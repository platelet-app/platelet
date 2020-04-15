import React from 'react';
import uuidBase62 from 'uuid-base62';

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
    return localStorage.getItem("apiBearer");
}

export function deleteLogin() {
    localStorage.clear("apiBearer")
}

export function saveLocalStorageViewMode(status) {
    localStorage.setItem("viewMode", status);
}

export function getLocalStorageViewMode() {
    return localStorage.getItem("viewMode");
}

export function orderTaskList(tasks) {
    let tasksNew = [];
    let tasksActive = [];
    let tasksPickedUp = [];
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
        } else if (task.assigned_rider === null) {
            tasksNew.unshift(task);
        } else if (task.assigned_rider && !task.time_picked_up) {
            tasksActive.unshift(task);
        } else if (task.assigned_rider && task.time_picked_up && !task.time_dropped_off) {
            tasksPickedUp.unshift(task);
        } else if (task.time_dropped_off) {
            tasksDelivered.unshift(task);
        } else {
            tasksNew.unshift(task);
        }
    });

    let result = [];
    tasksNew.sort(function (a, b) {
        return a.time_of_call > b.time_of_call ? -1 : a.time_of_call < b.time_of_call ? 1 : 0;
    });
    tasksCancelled.sort(function (a, b) {
        return a.time_of_call > b.time_of_call ? -1 : a.time_of_call < b.time_of_call ? 1 : 0;
    });
    tasksRejected.sort(function (a, b) {
        return a.time_of_call > b.time_of_call ? -1 : a.time_of_call < b.time_of_call ? 1 : 0;
    });
    tasksActive.sort(function (b, a) {
        return a.time_of_call > b.time_of_call ? -1 : a.time_of_call < b.time_of_call ? 1 : 0;
    });
    tasksPickedUp.sort(function (b, a) {
        return a.time_of_call > b.time_of_call ? -1 : a.time_of_call < b.time_of_call ? 1 : 0;
    });
    tasksDelivered.sort(function (b, a) {
        return a.time_of_call > b.time_of_call ? -1 : a.time_of_call < b.time_of_call ? 1 : 0;
    });
    result = result.concat(tasksNew);
    result = result.concat(tasksActive);
    result = result.concat(tasksPickedUp);
    result = result.concat(tasksDelivered);
    const tasksRejectedCancelled = tasksCancelled.concat(tasksRejected)
    return {tasksNew, tasksActive, tasksPickedUp, tasksDelivered, tasksRejectedCancelled}
}
