import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const getActionsRecordPrefix = "GET_ACTIONS_RECORD";

export const getActionsRecordActions = createRequestActions(getActionsRecordPrefix);
export const {getActionsRecordSuccess, getActionsRecordFailure, getActionsRecordNotFound, getActionsRecordForbidden} = createRequestFunctions(getActionsRecordActions);


export function getActionsRecordRequest(uuid) {
    return { type: getActionsRecordActions.request, data: {uuid }}
}

export const getTasksActionsRecordPrefix = "GET_TASKS_ACTIONS_RECORD";
export const getTasksActionsRecordActions = createRequestActions(getTasksActionsRecordPrefix);
export const {getTasksActionsRecordSuccess, getTasksActionsRecordFailure, getTasksActionsRecordNotFound, getTasksActionsRecordForbidden} = createRequestFunctions(getTasksActionsRecordActions);


export function getTasksActionsRecordRequest(userUUID) {
    return { type: getTasksActionsRecordActions.request, data: {userUUID} }
}
