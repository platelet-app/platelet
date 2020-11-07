export const GET_ACTIONS_RECORD_REQUEST = 'GET_ACTIONS_RECORD_REQUEST';
export const GET_ACTIONS_RECORD_FAILURE = 'GET_ACTIONS_RECORD_FAILURE';
export const GET_ACTIONS_RECORD_NOTFOUND = 'GET_ACTIONS_RECORD_NOTFOUND';
export const GET_ACTIONS_RECORD_FORBIDDEN = 'GET_ACTIONS_RECORD_FORBIDDEN';
export const GET_ACTIONS_RECORD_SUCCESS = 'GET_ACTIONS_RECORD_SUCCESS';


export function getActionsRecordRequest(data) {
    return { type: GET_ACTIONS_RECORD_REQUEST, data }
}

export function actionRecordsNotFound(data) {
    return { type: GET_ACTIONS_RECORD_NOTFOUND, data }
}

export function getActionsRecordFailure(error) {
    return { type: GET_ACTIONS_RECORD_FAILURE, error }
}

export function getActionsRecordForbidden(data) {
    return { type: GET_ACTIONS_RECORD_FORBIDDEN, data }
}

export function getActionsRecordSuccess(data) {
    return { type: GET_ACTIONS_RECORD_SUCCESS, data }
}
