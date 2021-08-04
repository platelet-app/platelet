import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const UPDATE_ACTIVE_TASK = "UPDATE_ACTIVE_TASK";
export const UPDATE_ACTIVE_TASK_ASSIGNED_RIDER = "UPDATE_ACTIVE_TASK_ASSIGNED_RIDER";
export const UPDATE_ACTIVE_TASK_ASSIGNED_COORDINATOR = "UPDATE_ACTIVE_TASK_ASSIGNED_COORDINATOR";
export const UPDATE_ACTIVE_TASK_REMOVE_ASSIGNED_RIDER = "UPDATE_ACTIVE_TASK_REMOVE_ASSIGNED_RIDER";
export const UPDATE_ACTIVE_TASK_REMOVE_ASSIGNED_COORDINATOR = "UPDATE_ACTIVE_TASK_REMOVE_ASSIGNED_COORDINATOR";

export const getTaskPrefix = "GET_TASK"
export const getTaskActions = createRequestActions(getTaskPrefix);
export const {getTaskSuccess, getTaskFailure, getTaskNotFound, getTaskForbidden} = createRequestFunctions(getTaskActions);

export function getTaskRequest(taskUUID) {
    return { type: getTaskActions.request, data: {taskUUID} }
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

export function updateActiveTaskRemoveAssignedCoordinator(taskUUID, payload) {
    return {type: UPDATE_ACTIVE_TASK_REMOVE_ASSIGNED_COORDINATOR, data: {taskUUID, payload}}
}
