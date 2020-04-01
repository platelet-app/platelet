export const GET_TASK_REQUEST = 'GET_TASK_REQUEST';
export const GET_TASK_SUCCESS = 'GET_TASK_SUCCESS';
export const ADD_TASK_REQUEST = 'ADD_TASK_REQUEST';
export const ADD_TASK_SUCCESS = 'ADD_TASK_SUCCESS';
export const DELETE_TASK_REQUEST = 'DELETE_TASK_REQUEST';
export const DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS';
export const RESTORE_TASK_REQUEST = 'RESTORE_TASK_REQUEST';
export const RESTORE_TASK_SUCCESS = 'RESTORE_TASK_SUCCESS';

export const UPDATE_TASK_CONTACT_NAME = "UPDATE_TASK_CONTACT_NAME";
export const UPDATE_TASK_CONTACT_NUMBER = "UPDATE_TASK_CONTACT_NUMBER";
export const UPDATE_TASK_PICKUP_ADDRESS = "UPDATE_TASK_PICKUP_ADDRESS";
export const UPDATE_TASK_DROPOFF_ADDRESS = "UPDATE_TASK_DROPOFF_ADDRESS";
export const UPDATE_TASK_PICKUP_TIME = "UPDATE_TASK_PICKUP_TIME";
export const UPDATE_TASK_DROPOFF_TIME = "UPDATE_TASK_DROPOFF_TIME";
export const UPDATE_TASK_CANCELLED_TIME = "UPDATE_TASK_CANCELLED_TIME";
export const UPDATE_TASK_REJECTED_TIME = "UPDATE_TASK_REJECTED_TIME";
export const UPDATE_TASK_ASSIGNED_RIDER = "UPDATE_TASK_ASSIGNED_RIDER";
export const UPDATE_TASK_PRIORITY = "UPDATE_TASK_PRIORITY";

export const UPDATE_TASK_REQUEST = 'UPDATE_TASK_REQUEST';
export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
export const GET_TASKS_REQUEST = 'GET_TASKS_REQUEST';
export const GET_TASKS_SUCCESS = 'GET_TASKS_SUCCESS';
export const GET_MY_TASKS_REQUEST = 'GET_MY_TASKS_REQUEST';
export const GET_MY_TASKS_SUCCESS = 'GET_MY_TASKS_SUCCESS';

export function restoreTask(data) {
    return { type: RESTORE_TASK_REQUEST, data }
}

export function restoreTaskSuccess(data) {
    return { type: RESTORE_TASK_SUCCESS, data }
}

export function getTask(data) {
    return { type: GET_TASK_REQUEST, data }
}

export function getTaskSuccess(data) {
    return { type: GET_TASK_SUCCESS, data }
}

export function addTask(data) {
    return { type: ADD_TASK_REQUEST, data }
}

export function addTaskSuccess(data) {
    return { type: ADD_TASK_SUCCESS, data }
}

export function deleteTask(data) {
    return { type: DELETE_TASK_REQUEST, data }
}

export function deleteTaskSuccess(data) {
    return { type: DELETE_TASK_SUCCESS, data }
}

export function updateTask(data) {
    return { type: UPDATE_TASK_REQUEST, data }
}


export function updateTaskContactName(data) {
    return { type: UPDATE_TASK_CONTACT_NAME, data }
}
export function updateTaskContactNumber(data) {
    return { type: UPDATE_TASK_CONTACT_NUMBER, data }
}
export function updateTaskPickupAddress(data) {
    return { type: UPDATE_TASK_PICKUP_ADDRESS, data }
}
export function updateTaskDropoffAddress(data) {
    return { type: UPDATE_TASK_DROPOFF_ADDRESS, data }
}
export function updateTaskPickupTime(data) {
    return { type: UPDATE_TASK_PICKUP_TIME, data }
}
export function updateTaskDropoffTime(data) {
    return { type: UPDATE_TASK_DROPOFF_TIME, data }
}
export function updateTaskCancelledTime(data) {
    return { type: UPDATE_TASK_CANCELLED_TIME, data }
}
export function updateTaskRejectedTime(data) {
    return { type: UPDATE_TASK_REJECTED_TIME, data }
}
export function updateTaskAssignedRider(data) {
    return { type: UPDATE_TASK_ASSIGNED_RIDER, data }
}
export function updateTaskPriority(data) {
    return { type: UPDATE_TASK_PRIORITY, data }
}

export function updateTaskSuccess(data) {
    return { type: UPDATE_TASK_SUCCESS, data }
}

export function getAllTasks(data) {
    return { type: GET_TASKS_REQUEST, data }
}

export function getAllTasksSuccess(data) {
    return { type: GET_TASKS_SUCCESS, data }
}

export function getAllMyTasks(data) {
    return { type: GET_MY_TASKS_REQUEST, data }
}

export function getAllMyTasksSuccess(data) {
    return { type: GET_MY_TASKS_SUCCESS, data }
}

