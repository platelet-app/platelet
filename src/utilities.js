import React from 'react';
import uuidBase62 from 'uuid-base62';

export function encodeUUID(uuid) {
    return uuidBase62.encode(uuid);
}

export function decodeUUID(uuid) {
    return uuidBase62.decode(uuid)
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

export function saveKanbanMode(status) {
    console.log("AAAAAAAAAAAAAAA")
    console.log(status)
    localStorage.setItem("kanbanMode", status);
}

export function getKanbanMode() {
    console.log(localStorage.getItem("kanbanMode"))
    return localStorage.getItem("kanbanMode");
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
        if (typeof (task.timestamp) === "string") {
            task.timestamp = new Date(task.timestamp);
        }
        if (task.cancelled_time) {
            tasksCancelled.unshift(task);
        } else if (task.rejected_time) {
            tasksRejected.unshift(task);
        } else if (task.assigned_rider === null) {
            tasksNew.unshift(task);
        } else if (task.assigned_rider && !task.pickup_time) {
            tasksActive.unshift(task);
        } else if (task.assigned_rider && task.pickup_time && !task.dropoff_time) {
            tasksPickedUp.unshift(task);
        } else if (task.dropoff_time) {
            tasksDelivered.unshift(task);
        } else {
            tasksNew.unshift(task);
        }
    });

    let result = [];
    tasksNew.sort(function (a, b) {
        return a.timestamp > b.timestamp ? -1 : a.timestamp < b.timestamp ? 1 : 0;
    });
    tasksCancelled.sort(function (a, b) {
        return a.timestamp > b.timestamp ? -1 : a.timestamp < b.timestamp ? 1 : 0;
    });
    tasksRejected.sort(function (a, b) {
        return a.timestamp > b.timestamp ? -1 : a.timestamp < b.timestamp ? 1 : 0;
    });
    tasksActive.sort(function (b, a) {
        return a.timestamp > b.timestamp ? -1 : a.timestamp < b.timestamp ? 1 : 0;
    });
    tasksPickedUp.sort(function (b, a) {
        return a.timestamp > b.timestamp ? -1 : a.timestamp < b.timestamp ? 1 : 0;
    });
    tasksDelivered.sort(function (b, a) {
        return a.timestamp > b.timestamp ? -1 : a.timestamp < b.timestamp ? 1 : 0;
    });
    result = result.concat(tasksNew);
    result = result.concat(tasksActive);
    result = result.concat(tasksPickedUp);
    result = result.concat(tasksDelivered);
    const tasksRejectedCancelled = tasksCancelled.concat(tasksRejected)
    return {tasksNew, tasksActive, tasksPickedUp, tasksDelivered, tasksRejectedCancelled}
    return result;
}
