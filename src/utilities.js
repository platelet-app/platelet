import React from 'react';

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

export function orderTaskList(tasks) {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaAAAAA")
    let tasksNew = [];
    let tasksActive = [];
    let tasksPickedUp = [];
    let tasksDelivered = [];
    tasks.forEach((task) => {
        if (typeof(task.timestamp) === "string") {
            task.timestamp = new Date(task.timestamp);
        }
        if (task.assigned_rider === null) {
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
    tasksNew.sort(function(a, b) {
        return a.timestamp>b.timestamp ? -1 : a.timestamp<b.timestamp ? 1 : 0;
    });
    tasksActive.sort(function(a, b) {
        return a.timestamp>b.timestamp ? -1 : a.timestamp<b.timestamp ? 1 : 0;
    });
    tasksPickedUp.sort(function(a, b) {
        return a.timestamp>b.timestamp ? -1 : a.timestamp<b.timestamp ? 1 : 0;
    });
    tasksDelivered.sort(function(a, b) {
        return a.timestamp>b.timestamp ? -1 : a.timestamp<b.timestamp ? 1 : 0;
    });
    result = result.concat(tasksNew);
    result = result.concat(tasksActive);
    result = result.concat(tasksPickedUp);
    result = result.concat(tasksDelivered);
    return result;
}
