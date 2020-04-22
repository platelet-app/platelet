export const GET_TASK_REQUEST = 'GET_TASK_REQUEST';
export const GET_TASK_SUCCESS = 'GET_TASK_SUCCESS';
export const ADD_TASK_REQUEST = 'ADD_TASK_REQUEST';
export const ADD_TASK_SUCCESS = 'ADD_TASK_SUCCESS';
export const DELETE_TASK_REQUEST = 'DELETE_TASK_REQUEST';
export const DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS';
export const RESTORE_TASK_REQUEST = 'RESTORE_TASK_REQUEST';
export const RESTORE_TASK_SUCCESS = 'RESTORE_TASK_SUCCESS';

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
    return { type: UPDATE_TASK_CONTACT_NAME_REQUEST, data }
}
export function updateTaskContactNumber(data) {
    return { type: UPDATE_TASK_CONTACT_NUMBER_REQUEST, data }
}
export function updateTaskPickupAddress(data) {
    return { type: UPDATE_TASK_PICKUP_ADDRESS_REQUEST, data }
}
export function updateTaskDropoffAddress(data) {
    return { type: UPDATE_TASK_DROPOFF_ADDRESS_REQUEST, data }
}
export function updateTaskPickupTime(data) {
    return { type: UPDATE_TASK_PICKUP_TIME_REQUEST, data }
}
export function updateTaskDropoffTime(data) {
    return { type: UPDATE_TASK_DROPOFF_TIME_REQUEST, data }
}
export function updateTaskCancelledTime(data) {
    return { type: UPDATE_TASK_CANCELLED_TIME_REQUEST, data }
}
export function updateTaskRejectedTime(data) {
    return { type: UPDATE_TASK_REJECTED_TIME_REQUEST, data }
}
export function updateTaskAssignedRider(data) {
    return { type: UPDATE_TASK_ASSIGNED_RIDER_REQUEST, data }
}
export function updateTaskPriority(data) {
    return { type: UPDATE_TASK_PRIORITY_REQUEST, data }
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

