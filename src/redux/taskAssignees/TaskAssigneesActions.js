
export const GET_TASK_ASSIGNED_RIDERS_REQUEST = "GET_TASK_ASSIGNED_RIDERS_REQUEST";
export const GET_TASK_ASSIGNED_RIDERS_SUCCESS = "GET_TASK_ASSIGNED_RIDERS_SUCCESS";
export const GET_TASK_ASSIGNED_RIDERS_FAILURE = "GET_TASK_ASSIGNED_RIDERS_FAILURE";
export const ADD_TASK_ASSIGNED_RIDER_REQUEST = "UPDATE_TASK_ASSIGNED_RIDER_REQUEST";
export const ADD_TASK_ASSIGNED_RIDER_SUCCESS = "ADD_TASK_ASSIGNED_RIDER_SUCCESS";
export const ADD_TASK_ASSIGNED_RIDER_FAILURE = "ADD_TASK_ASSIGNED_RIDER_FAILURE";
export const REMOVE_TASK_ASSIGNED_RIDER_REQUEST = "REMOVE_TASK_ASSIGNED_RIDER_REQUEST";
export const REMOVE_TASK_ASSIGNED_RIDER_SUCCESS = "REMOVE_TASK_ASSIGNED_RIDER_SUCCESS";
export const REMOVE_TASK_ASSIGNED_RIDER_FAILURE = "REMOVE_TASK_ASSIGNED_RIDER_FAILURE";

export const GET_TASK_ASSIGNED_COORDINATORS_REQUEST = "GET_TASK_ASSIGNED_COORDINATORS_REQUEST";
export const GET_TASK_ASSIGNED_COORDINATORS_SUCCESS = "GET_TASK_ASSIGNED_COORDINATORS_SUCCESS";
export const GET_TASK_ASSIGNED_COORDINATORS_FAILURE = "GET_TASK_ASSIGNED_COORDINATORS_FAILURE";
export const ADD_TASK_ASSIGNED_COORDINATOR_REQUEST = "UPDATE_TASK_ASSIGNED_COORDINATOR_REQUEST";
export const ADD_TASK_ASSIGNED_COORDINATOR_SUCCESS = "ADD_TASK_ASSIGNED_COORDINATOR_SUCCESS";
export const ADD_TASK_ASSIGNED_COORDINATOR_FAILURE = "ADD_TASK_ASSIGNED_COORDINATOR_FAILURE";
export const REMOVE_TASK_ASSIGNED_COORDINATOR_REQUEST = "REMOVE_TASK_ASSIGNED_COORDINATOR_REQUEST";
export const REMOVE_TASK_ASSIGNED_COORDINATOR_SUCCESS = "REMOVE_TASK_ASSIGNED_COORDINATOR_SUCCESS";
export const REMOVE_TASK_ASSIGNED_COORDINATOR_FAILURE = "REMOVE_TASK_ASSIGNED_COORDINATOR_FAILURE";

export function getTaskAssignedRidersRequest(data) {
    return { type: GET_TASK_ASSIGNED_RIDERS_REQUEST, data }
}
export function getTaskAssignedRidersSuccess(data) {
    return { type: GET_TASK_ASSIGNED_RIDERS_SUCCESS, data }
}

export function getTaskAssignedRidersFailure(error) {
    return { type: GET_TASK_ASSIGNED_RIDERS_FAILURE, error }
}

export function addTaskAssignedRiderRequest(taskUUID, userUUID, patchID) {
    return { type: ADD_TASK_ASSIGNED_RIDER_REQUEST, data: {taskUUID, payload: {patch_id: patchID, user_uuid: userUUID} } }
}
export function addTaskAssignedRiderSuccess(data) {
    return { type: ADD_TASK_ASSIGNED_RIDER_SUCCESS, data }
}

export function addTaskAssignedRiderFailure(error) {
    return { type: ADD_TASK_ASSIGNED_RIDER_FAILURE, error }
}

export function removeTaskAssignedRiderRequest(data) {
    return { type: REMOVE_TASK_ASSIGNED_RIDER_REQUEST, data }
}

export function removeTaskAssignedRiderFailure(error) {
    return { type: REMOVE_TASK_ASSIGNED_RIDER_FAILURE, error }
}

export function removeTaskAssignedRiderSuccess(data) {
    return { type: REMOVE_TASK_ASSIGNED_RIDER_SUCCESS, data }
}

export function addTaskAssignedCoordinatorRequest(taskUUID, userUUID) {
    return { type: ADD_TASK_ASSIGNED_COORDINATOR_REQUEST, data: {taskUUID, payload: {user_uuid: userUUID }}}
}
export function addTaskAssignedCoordinatorSuccess(data) {
    return { type: ADD_TASK_ASSIGNED_COORDINATOR_SUCCESS, data }
}

export function addTaskAssignedCoordinatorFailure(error) {
    return { type: ADD_TASK_ASSIGNED_COORDINATOR_FAILURE, error }
}

export function removeTaskAssignedCoordinatorRequest(data) {
    return { type: REMOVE_TASK_ASSIGNED_COORDINATOR_REQUEST, data }
}

export function removeTaskAssignedCoordinatorFailure(error) {
    return { type: REMOVE_TASK_ASSIGNED_COORDINATOR_FAILURE, error }
}

export function removeTaskAssignedCoordinatorSuccess(data) {
    return { type: REMOVE_TASK_ASSIGNED_COORDINATOR_SUCCESS, data }
}
