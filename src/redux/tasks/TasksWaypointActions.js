export const APPEND_TASKS_DELIVERED_REQUEST = "APPEND_TASKS_DELIVERED_REQUEST";
export const APPEND_TASKS_REJECTED_REQUEST = "APPEND_TASKS_REJECTED_REQUEST";
export const APPEND_TASKS_CANCELLED_REQUEST = "APPEND_TASKS_CANCELLED_REQUEST";

export const APPEND_TASKS_DELIVERED_FAILURE = "APPEND_TASKS_DELIVERED_FAILURE";
export const APPEND_TASKS_REJECTED_FAILURE = "APPEND_TASKS_REJECTED_FAILURE";
export const APPEND_TASKS_CANCELLED_FAILURE = "APPEND_TASKS_CANCELLED_FAILURE";

export const APPEND_TASKS_DELIVERED_SUCCESS = "APPEND_TASKS_DELIVERED_SUCCESS";
export const APPEND_TASKS_REJECTED_SUCCESS = "APPEND_TASKS_REJECTED_SUCCESS";
export const APPEND_TASKS_CANCELLED_SUCCESS = "APPEND_TASKS_CANCELLED_SUCCESS";


export const APPEND_TASKS_DELIVERED_NOTFOUND = "APPEND_TASKS_DELIVERED_NOTFOUND";
export const APPEND_TASKS_REJECTED_NOTFOUND = "APPEND_TASKS_REJECTED_NOTFOUND";
export const APPEND_TASKS_CANCELLED_NOTFOUND = "APPEND_TASKS_CANCELLED_NOTFOUND";

export function appendTasksDeliveredRequest(userUUID, page, role, taskStatus, beforeParent) {
    return {type: APPEND_TASKS_DELIVERED_REQUEST, userUUID, page, role, taskStatus, beforeParent}
}

export function appendTasksCancelledRequest(userUUID, page, role, taskStatus, beforeParent) {
    return {type: APPEND_TASKS_CANCELLED_REQUEST, userUUID, page, role, taskStatus, beforeParent}
}

export function appendTasksRejectedRequest(userUUID, page, role, taskStatus, beforeParent) {
    return {type: APPEND_TASKS_REJECTED_REQUEST, userUUID, page, role, taskStatus, beforeParent}
}

export function appendTasksDeliveredSuccess(data) {
    return {type: APPEND_TASKS_DELIVERED_SUCCESS, data}
}

export function appendTasksCancelledSuccess(data) {
    return {type: APPEND_TASKS_CANCELLED_SUCCESS, data}
}

export function appendTasksRejectedSuccess(data) {
    return {type: APPEND_TASKS_REJECTED_SUCCESS, data}
}

export function appendTasksDeliveredFailure(error) {
    return {type: APPEND_TASKS_DELIVERED_FAILURE, error}
}

export function appendTasksCancelledFailure(error) {
    return {type: APPEND_TASKS_CANCELLED_FAILURE, error}
}

export function appendTasksRejectedFailure(error) {
    return {type: APPEND_TASKS_REJECTED_FAILURE, error}
}

export function appendTasksDeliveredNotFound(error) {
    return {type: APPEND_TASKS_DELIVERED_NOTFOUND, error}
}

export function appendTasksCancelledNotFound(error) {
    return {type: APPEND_TASKS_CANCELLED_NOTFOUND, error}
}

export function appendTasksRejectedNotFound(error) {
    return {type: APPEND_TASKS_REJECTED_NOTFOUND, error}
}
