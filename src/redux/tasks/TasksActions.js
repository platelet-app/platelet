export const GET_TASK_REQUEST = 'GET_TASK_REQUEST';
export const GET_TASK_SUCCESS = 'GET_TASK_SUCCESS';
export const GET_TASK_FAILURE = 'GET_TASK_FAILURE';
export const GET_TASK_NOTFOUND = 'GET_TASK_NOTFOUND';
export const ADD_TASK_REQUEST = 'ADD_TASK_REQUEST';
export const ADD_TASK_SUCCESS = 'ADD_TASK_SUCCESS';
export const ADD_TASK_FAILURE = 'ADD_TASK_FAILURE';
export const DELETE_TASK_REQUEST = 'DELETE_TASK_REQUEST';
export const DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS';
export const DELETE_TASK_FAILURE = 'DELETE_TASK_FAILURE';
export const RESTORE_TASK_REQUEST = 'RESTORE_TASK_REQUEST';
export const RESTORE_TASK_SUCCESS = 'RESTORE_TASK_SUCCESS';
export const RESTORE_TASK_FAILURE = 'RESTORE_TASK_FAILURE';

export const SET_CURRENT_TASK = 'SET_CURRENT_TASK';

export const UPDATE_TASK_CONTACT_NAME_REQUEST = "UPDATE_TASK_CONTACT_NAME_REQUEST";
export const UPDATE_TASK_CONTACT_NUMBER_REQUEST = "UPDATE_TASK_CONTACT_NUMBER_REQUEST";
export const UPDATE_TASK_PICKUP_ADDRESS_REQUEST = "UPDATE_TASK_PICKUP_ADDRESS_REQUEST";
export const UPDATE_TASK_DROPOFF_ADDRESS_REQUEST = "UPDATE_TASK_DROPOFF_ADDRESS_REQUEST";
export const UPDATE_TASK_PICKUP_TIME_REQUEST = "UPDATE_TASK_PICKUP_TIME_REQUEST";
export const UPDATE_TASK_DROPOFF_TIME_REQUEST = "UPDATE_TASK_DROPOFF_TIME_REQUEST";
export const UPDATE_TASK_CANCELLED_TIME_REQUEST = "UPDATE_TASK_CANCELLED_TIME_REQUEST";
export const UPDATE_TASK_REJECTED_TIME_REQUEST = "UPDATE_TASK_REJECTED_TIME_REQUEST";
export const UPDATE_TASK_ASSIGNED_RIDER_REQUEST = "UPDATE_TASK_ASSIGNED_RIDER_REQUEST";
export const UPDATE_TASK_PRIORITY_REQUEST = "UPDATE_TASK_PRIORITY_REQUEST";
export const UPDATE_TASK_PATCH_REQUEST = "UPDATE_TASK_PATCH_REQUEST";

export const UPDATE_TASK_CONTACT_NAME_SUCCESS = "UPDATE_TASK_CONTACT_NAME_SUCCESS";
export const UPDATE_TASK_CONTACT_NUMBER_SUCCESS = "UPDATE_TASK_CONTACT_NUMBER_SUCCESS";
export const UPDATE_TASK_PICKUP_ADDRESS_SUCCESS = "UPDATE_TASK_PICKUP_ADDRESS_SUCCESS";
export const UPDATE_TASK_DROPOFF_ADDRESS_SUCCESS = "UPDATE_TASK_DROPOFF_ADDRESS_SUCCESS";
export const UPDATE_TASK_PICKUP_TIME_SUCCESS = "UPDATE_TASK_PICKUP_TIME_SUCCESS";
export const UPDATE_TASK_DROPOFF_TIME_SUCCESS = "UPDATE_TASK_DROPOFF_TIME_SUCCESS";
export const UPDATE_TASK_CANCELLED_TIME_SUCCESS = "UPDATE_TASK_CANCELLED_TIME_SUCCESS";
export const UPDATE_TASK_REJECTED_TIME_SUCCESS = "UPDATE_TASK_REJECTED_TIME_SUCCESS";
export const UPDATE_TASK_ASSIGNED_RIDER_SUCCESS = "UPDATE_TASK_ASSIGNED_RIDER_SUCCESS";
export const UPDATE_TASK_PRIORITY_SUCCESS = "UPDATE_TASK_PRIORITY_SUCCESS";
export const UPDATE_TASK_PATCH_SUCCESS = "UPDATE_TASK_PATCH_SUCCESS";

export const UPDATE_TASK_CONTACT_NAME_FAILURE = "UPDATE_TASK_CONTACT_NAME_FAILURE";
export const UPDATE_TASK_CONTACT_NUMBER_FAILURE = "UPDATE_TASK_CONTACT_NUMBER_FAILURE";
export const UPDATE_TASK_PICKUP_ADDRESS_FAILURE = "UPDATE_TASK_PICKUP_ADDRESS_FAILURE";
export const UPDATE_TASK_DROPOFF_ADDRESS_FAILURE = "UPDATE_TASK_DROPOFF_ADDRESS_FAILURE";
export const UPDATE_TASK_PICKUP_TIME_FAILURE = "UPDATE_TASK_PICKUP_TIME_FAILURE";
export const UPDATE_TASK_DROPOFF_TIME_FAILURE = "UPDATE_TASK_DROPOFF_TIME_FAILURE";
export const UPDATE_TASK_CANCELLED_TIME_FAILURE = "UPDATE_TASK_CANCELLED_TIME_FAILURE";
export const UPDATE_TASK_REJECTED_TIME_FAILURE = "UPDATE_TASK_REJECTED_TIME_FAILURE";
export const UPDATE_TASK_ASSIGNED_RIDER_FAILURE = "UPDATE_TASK_ASSIGNED_RIDER_FAILURE";
export const UPDATE_TASK_PRIORITY_FAILURE = "UPDATE_TASK_PRIORITY_FAILURE";
export const UPDATE_TASK_PATCH_FAILURE = "UPDATE_TASK_PATCH_FAILURE";

export const UPDATE_TASK_REQUEST = 'UPDATE_TASK_REQUEST';
export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
export const UPDATE_TASK_FAILURE = 'UPDATE_TASK_FAILURE';
export const GET_TASKS_REQUEST = 'GET_TASKS_REQUEST';
export const GET_TASKS_SUCCESS = 'GET_TASKS_SUCCESS';
export const GET_TASKS_NOTFOUND = 'GET_TASKS_NOTFOUND';
export const GET_TASKS_FAILURE = 'GET_TASKS_FAILURE';
export const REFRESH_TASKS_REQUEST = 'REFRESH_TASKS_REQUEST';
export const REFRESH_TASKS_SUCCESS = 'REFRESH_TASKS_SUCCESS';
export const REFRESH_TASKS_FAILURE = 'REFRESH_TASKS_FAILURE';
export const GET_MY_TASKS_REQUEST = 'GET_MY_TASKS_REQUEST';
export const GET_MY_TASKS_SUCCESS = 'GET_MY_TASKS_SUCCESS';
export const GET_MY_TASKS_FAILURE = 'GET_MY_TASKS_FAILURE';
export const GET_MY_TASKS_NOTFOUND = 'GET_MY_TASKS_NOTFOUND';

export function restoreTask(data) {
    return { type: RESTORE_TASK_REQUEST, data }
}

export function restoreTaskSuccess(data) {
    return { type: RESTORE_TASK_SUCCESS, data }
}

export function getTask(data) {
    return { type: GET_TASK_REQUEST, data }
}

export function setCurrentTask(data) {
    return { type: SET_CURRENT_TASK, data }
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
    data.time_modified = new Date().toISOString();
    return { type: UPDATE_TASK_CONTACT_NAME_REQUEST, data }
}
export function updateTaskContactNumber(data) {
    data.time_modified = new Date().toISOString();
    return { type: UPDATE_TASK_CONTACT_NUMBER_REQUEST, data }
}
export function updateTaskPickupAddress(data) {
    data.time_modified = new Date().toISOString();
    return { type: UPDATE_TASK_PICKUP_ADDRESS_REQUEST, data }
}
export function updateTaskDropoffAddress(data) {
    data.time_modified = new Date().toISOString();
    return { type: UPDATE_TASK_DROPOFF_ADDRESS_REQUEST, data }
}
export function updateTaskPickupTime(data) {
    data.time_modified = new Date().toISOString();
    return { type: UPDATE_TASK_PICKUP_TIME_REQUEST, data }
}
export function updateTaskDropoffTime(data) {
    data.time_modified = new Date().toISOString();
    return { type: UPDATE_TASK_DROPOFF_TIME_REQUEST, data }
}
export function updateTaskCancelledTime(data) {
    data.time_modified = new Date().toISOString();
    return { type: UPDATE_TASK_CANCELLED_TIME_REQUEST, data }
}
export function updateTaskRejectedTime(data) {
    data.time_modified = new Date().toISOString();
    return { type: UPDATE_TASK_REJECTED_TIME_REQUEST, data }
}
export function updateTaskAssignedRider(data) {
    data.time_modified = new Date().toISOString();
    return { type: UPDATE_TASK_ASSIGNED_RIDER_REQUEST, data }
}
export function updateTaskPriority(data) {
    data.time_modified = new Date().toISOString();
    return { type: UPDATE_TASK_PRIORITY_REQUEST, data }
}

export function updateTaskPatch(data) {
    data.time_modified = new Date().toISOString();
    return { type: UPDATE_TASK_PATCH_REQUEST, data }
}

export function updateTaskContactNameSuccess(data) {
    return { type: UPDATE_TASK_CONTACT_NAME_SUCCESS, data }
}
export function updateTaskContactNumberSuccess(data) {
    return { type: UPDATE_TASK_CONTACT_NUMBER_SUCCESS, data }
}
export function updateTaskPickupAddressSuccess(data) {
    return { type: UPDATE_TASK_PICKUP_ADDRESS_SUCCESS, data }
}
export function updateTaskDropoffAddressSuccess(data) {
    return { type: UPDATE_TASK_DROPOFF_ADDRESS_SUCCESS, data }
}
export function updateTaskPickupTimeSuccess(data) {
    return { type: UPDATE_TASK_PICKUP_TIME_SUCCESS, data }
}
export function updateTaskDropoffTimeSuccess(data) {
    return { type: UPDATE_TASK_DROPOFF_TIME_SUCCESS, data }
}
export function updateTaskCancelledTimeSuccess(data) {
    return { type: UPDATE_TASK_CANCELLED_TIME_SUCCESS, data }
}
export function updateTaskRejectedTimeSuccess(data) {
    return { type: UPDATE_TASK_REJECTED_TIME_SUCCESS, data }
}
export function updateTaskAssignedRiderSuccess(data) {
    return { type: UPDATE_TASK_ASSIGNED_RIDER_SUCCESS, data }
}
export function updateTaskPrioritySuccess(data) {
    return { type: UPDATE_TASK_PRIORITY_SUCCESS, data }
}

export function updateTaskPatchSuccess(data) {
    data.time_modified = new Date().toISOString();
    return { type: UPDATE_TASK_PATCH_SUCCESS, data }
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

export function refreshAllTasks(data) {
    return { type: REFRESH_TASKS_REQUEST, data }
}

export function refreshAllTasksSuccess(data) {
    return { type: REFRESH_TASKS_SUCCESS, data }
}

export function getAllTasksFailure(data) {
    return { type: GET_TASKS_FAILURE, data }
}

export function getAllTasksNotFound(data) {
    return { type: GET_TASKS_NOTFOUND, data }
}

export function getAllMyTasks(data) {
    return { type: GET_MY_TASKS_REQUEST, data }
}

export function getAllMyTasksSuccess(data) {
    return { type: GET_MY_TASKS_SUCCESS, data }
}

export function getAllMyTasksFailure(error) {
    return { type: GET_MY_TASKS_FAILURE, error }
}

export function getAllMyTasksNotFound(error) {
    return { type: GET_MY_TASKS_NOTFOUND, error }
}

