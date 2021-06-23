import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET = "UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET";
export const UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET = "UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET";
export const UPDATE_TASK_ASSIGNED_COORDINATOR_FROM_SOCKET = "UPDATE_TASK_ASSIGNED_COORDINATOR_FROM_SOCKET";
export const UPDATE_TASK_REMOVE_ASSIGNED_COORDINATOR_FROM_SOCKET = "UPDATE_TASK_REMOVE_ASSIGNED_COORDINATOR_FROM_SOCKET";

export function updateTaskAssignedRiderFromSocket(data) {
    return { type: UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET, data }
}

export function updateTaskRemoveAssignedRiderFromSocket(data) {
    return { type: UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET, data }
}

export function updateTaskAssignedCoordinatorFromSocket(data) {
    return { type: UPDATE_TASK_ASSIGNED_COORDINATOR_FROM_SOCKET, data }
}

export function updateTaskRemoveAssignedCoordinatorFromSocket(data) {
    return { type: UPDATE_TASK_REMOVE_ASSIGNED_COORDINATOR_FROM_SOCKET, data }
}


export const getTaskAssignedRidersPrefix = "GET_TASK_ASSIGNED_RIDERS";
export const getTaskAssignedRidersActions = createRequestActions(getTaskAssignedRidersPrefix);
export const {getTaskAssignedRidersSuccess, getTaskAssignedRidersFailure, getTaskAssignedRidersNotFound} = createRequestFunctions(getTaskAssignedRidersActions);

export function getTaskAssignedRidersRequest(taskUUID) {
    return { type: getTaskAssignedRidersActions.request, data: {taskUUID} }
}

export const addTaskAssignedRiderPrefix = "ADD_TASK_ASSIGNED_RIDER";
export const addTaskAssignedRiderActions = createRequestActions(addTaskAssignedRiderPrefix)
export const {addTaskAssignedRiderSuccess, addTaskAssignedRiderFailure, addTaskAssignedRiderNotFound} = createRequestFunctions(addTaskAssignedRiderActions);

export function addTaskAssignedRiderRequest(taskUUID, userUUID, patchID) {
    return { type: addTaskAssignedRiderActions.request, data: {taskUUID, payload: {patch_id: patchID, user_uuid: userUUID} } }
}

export const removeTaskAssignedRiderPrefix = "REMOVE_TASK_ASSIGNED_RIDER";
export const removeTaskAssignedRiderActions = createRequestActions(removeTaskAssignedRiderPrefix)
export const {removeTaskAssignedRiderSuccess, removeTaskAssignedRiderFailure, removeTaskAssignedRiderNotFound} = createRequestFunctions(removeTaskAssignedRiderActions);

export function removeTaskAssignedRiderRequest(taskUUID, userUUID) {
    return { type: removeTaskAssignedRiderActions.request, data: {taskUUID, payload: {user_uuid: userUUID}} }
}


export const getTaskAssignedCoordinatorsPrefix = "GET_TASK_ASSIGNED_COORDINATORS";
export const getTaskAssignedCoordinatorsActions = createRequestActions(getTaskAssignedCoordinatorsPrefix);
export const {getTaskAssignedCoordinatorsSuccess, getTaskAssignedCoordinatorsFailure, getTaskAssignedCoordinatorsNotFound} = createRequestFunctions(getTaskAssignedCoordinatorsActions);

export function getTaskAssignedCoordinatorsRequest(taskUUID) {
    return { type: getTaskAssignedCoordinatorsActions.request, data: {taskUUID} }
}


export const addTaskAssignedCoordinatorPrefix = "ADD_TASK_ASSIGNED_COORDINATOR";
export const addTaskAssignedCoordinatorActions = createRequestActions(addTaskAssignedCoordinatorPrefix);
export const {addTaskAssignedCoordinatorSuccess, addTaskAssignedCoordinatorFailure, addTaskAssignedCoordinatorNotFound} = createRequestFunctions(addTaskAssignedCoordinatorActions);

export function addTaskAssignedCoordinatorRequest(taskUUID, userUUID) {
    return { type: addTaskAssignedCoordinatorActions.request, data: {taskUUID, payload: {user_uuid: userUUID }}}
}

export const removeTaskAssignedCoordinatorPrefix = "REMOVE_TASK_ASSIGNED_COORDINATOR";
export const removeTaskAssignedCoordinatorActions = createRequestActions(removeTaskAssignedCoordinatorPrefix);
export const {removeTaskAssignedCoordinatorSuccess, removeTaskAssignedCoordinatorFailure, removeTaskAssignedCoordinatorNotFound} = createRequestFunctions(removeTaskAssignedCoordinatorActions);

export function removeTaskAssignedCoordinatorRequest(taskUUID, userUUID) {
    return { type: removeTaskAssignedCoordinatorActions.request, data: {taskUUID, payload: {user_uuid: userUUID}} }
}
