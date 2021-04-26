//TODO: this doesn't trigger the auth monitor. They are requests and should start with REQUEST. Convert it to use the factory functions

import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const appendTasksDeliveredPrefix = "APPEND_TASKS_DELIVERED";
export const appendTasksDeliveredActions = createRequestActions(appendTasksDeliveredPrefix);
export const {
    appendTasksDeliveredSuccess,
    appendTasksDeliveredFailure,
    appendTasksDeliveredNotFound,
    appendTasksDeliveredForbidden } = createRequestFunctions(appendTasksDeliveredActions);
export const appendTasksRejectedPrefix = "APPEND_TASKS_REJECTED";
export const appendTasksRejectedActions = createRequestActions(appendTasksRejectedPrefix);
export const {
    appendTasksRejectedSuccess,
    appendTasksRejectedFailure,
    appendTasksRejectedNotFound,
    appendTasksRejectedForbidden } = createRequestFunctions(appendTasksRejectedActions);
export const appendTasksCancelledPrefix = "APPEND_TASKS_CANCELLED";
export const appendTasksCancelledActions = createRequestActions(appendTasksCancelledPrefix);
export const {
    appendTasksCancelledSuccess,
    appendTasksCancelledFailure,
    appendTasksCancelledNotFound,
    appendTasksCancelledForbidden } = createRequestFunctions(appendTasksCancelledActions);

export function appendTasksDeliveredRequest(userUUID, page, role, taskStatus, beforeParent) {
    return {type: appendTasksDeliveredActions.request, userUUID, page, role, taskStatus, beforeParent}
}

export function appendTasksCancelledRequest(userUUID, page, role, taskStatus, beforeParent) {
    return {type: appendTasksCancelledActions.request, userUUID, page, role, taskStatus, beforeParent}
}

export function appendTasksRejectedRequest(userUUID, page, role, taskStatus, beforeParent) {
    return {type: appendTasksRejectedActions.request, userUUID, page, role, taskStatus, beforeParent}
}
