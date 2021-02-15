export const UPDATE_ACTIVE_TASK = "UPDATE_ACTIVE_TASK";
export const UPDATE_ACTIVE_TASK_ASSIGNED_RIDER = "UPDATE_ACTIVE_TASK_ASSIGNED_RIDER";
export const UPDATE_ACTIVE_TASK_ASSIGNED_COORDINATOR = "UPDATE_ACTIVE_TASK_ASSIGNED_COORDINATOR";
export const UPDATE_ACTIVE_TASK_REMOVE_ASSIGNED_RIDER = "UPDATE_ACTIVE_TASK_REMOVE_ASSIGNED_RIDER";

export const GET_TASK_REQUEST = "GET_TASK_REQUEST";
export const GET_TASK_SUCCESS = "GET_TASK_SUCCESS";
export const GET_TASK_FAILURE = "GET_TASK_FAILURE";
export const GET_TASK_NOTFOUND = "GET_TASK_NOTFOUND";

export function getTaskRequest(taskUUID) {
    return { type: GET_TASK_REQUEST, data: {taskUUID} }
}

export function getTaskSuccess(data) {
    return { type: GET_TASK_SUCCESS, data }
}

export function getTaskFailure(error) {
    return { type: GET_TASK_FAILURE, error }
}

export function getTaskNotFound(error) {
    return { type: GET_TASK_NOTFOUND, error }
}

export function updateActiveTask(taskUUID, payload) {
    return {type: UPDATE_ACTIVE_TASK, data: {taskUUID, payload}}
}

export function updateActiveTaskAssignedRider(taskUUID, payload) {
    return {type: UPDATE_ACTIVE_TASK_ASSIGNED_RIDER, data: {taskUUID, payload}}
}

export function updateActiveTaskAssignedCoordinator(taskUUID, payload) {
    return {type: UPDATE_ACTIVE_TASK_ASSIGNED_COORDINATOR, data: {taskUUID, payload}}
}

export function updateActiveTaskRemoveAssignedRider(taskUUID, payload) {
    return {type: UPDATE_ACTIVE_TASK_REMOVE_ASSIGNED_RIDER, data: {taskUUID, payload}}
}
