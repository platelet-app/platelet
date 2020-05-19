export const ADD_SESSION_REQUEST = 'ADD_SESSION_REQUEST';
export const ADD_SESSION_SUCCESS = 'ADD_SESSION_SUCCESS';
export const ADD_SESSION_FAILURE = 'ADD_SESSION_FAILURE';
export const GET_SESSIONS_REQUEST = 'GET_SESSIONS_REQUEST';
export const GET_SESSIONS_SUCCESS = 'GET_SESSIONS_SUCCESS';
export const GET_SESSIONS_FAILURE = 'GET_SESSIONS_FAILURE';
export const GET_SESSION_REQUEST = 'GET_SESSION_REQUEST';
export const GET_SESSION_SUCCESS = 'GET_SESSION_SUCCESS';
export const GET_SESSION_FAILURE = 'GET_SESSION_FAILURE';
export const GET_SESSION_NOTFOUND = 'GET_SESSION_NOTFOUND';
export const GET_SESSION_STATISTICS_REQUEST = 'GET_SESSION_STATISTICS_REQUEST';
export const GET_SESSION_STATISTICS_SUCCESS = 'GET_SESSION_STATISTICS_SUCCESS';
export const GET_SESSION_STATISTICS_NOTFOUND = 'GET_SESSION_STATISTICS_NOTFOUND';
export const GET_SESSION_STATISTICS_FAILURE = 'GET_SESSION_STATISTICS_FAILURE';
export const DELETE_SESSION_REQUEST = 'DELETE_SESSION_REQUEST';
export const DELETE_SESSION_SUCCESS = 'DELETE_SESSION_SUCCESS';
export const DELETE_SESSION_FAILURE = 'DELETE_SESSION_FAILURE';
export const RESTORE_SESSION_REQUEST = 'RESTORE_SESSION_REQUEST';
export const RESTORE_SESSION_SUCCESS = 'RESTORE_SESSION_SUCCESS';
export const RESTORE_SESSION_FAILURE = 'RESTORE_SESSION_FAILURE';
export const REFRESH_CURRENT_SESSION_REQUEST = 'REFRESH_CURRENT_SESSION_REQUEST';
export const REFRESH_CURRENT_SESSION_SUCCESS = 'REFRESH_CURRENT_SESSION_SUCCESS';
export const REFRESH_CURRENT_SESSION_FAILURE = 'REFRESH_CURRENT_SESSION_FAILURE';

export const SET_CURRENT_SESSION = 'SET_CURRENT_SESSION';
export const CLEAR_CURRENT_SESSION = 'CLEAR_CURRENT_SESSION';
export const SET_CURRENT_SESSION_TIME_ACTIVE_TO_NOW = 'SET_CURRENT_SESSION_TIME_ACTIVE_TO_NOW';

export function addSession(data) {
    return { type: ADD_SESSION_REQUEST, data }
}

export function addSessionSuccess(data) {
    return { type: ADD_SESSION_SUCCESS, data }
}

export function addSessionFailure(data) {
    return { type: ADD_SESSION_FAILURE, data }
}

export function getAllSessions(data) {
    return { type: GET_SESSIONS_REQUEST, data }
}

export function getAllSessionsSuccess(data) {
    return { type: GET_SESSIONS_SUCCESS, data }
}

export function getAllSessionsFailure(error) {
    return { type: GET_SESSIONS_FAILURE, error }
}

export function getSession(data) {
    return { type: GET_SESSION_REQUEST, data }
}

export function getSessionSuccess(data) {
    return { type: GET_SESSION_SUCCESS, data }
}

export function getSessionFailure(data) {
    return { type: GET_SESSION_FAILURE, data }
}

export function getSessionNotFound(data) {
    return { type: GET_SESSION_NOTFOUND, data }
}

export function getSessionStatistics(data) {
    return { type: GET_SESSION_STATISTICS_REQUEST, data }
}

export function getSessionStatisticsSuccess(data) {
    return { type: GET_SESSION_STATISTICS_SUCCESS, data }
}

export function getSessionStatisticsNotFound(data) {
    return { type: GET_SESSION_STATISTICS_NOTFOUND, data }
}

export function getSessionStatisticsFailure(data) {
    return { type: GET_SESSION_STATISTICS_FAILURE, data }
}

export function deleteSession(data) {
    return { type: DELETE_SESSION_REQUEST, data }
}

export function deleteSessionSuccess(data) {
    return { type: DELETE_SESSION_SUCCESS, data }
}

export function deleteSessionFailure(data) {
    return { type: DELETE_SESSION_FAILURE, data }
}

export function restoreSession(data) {
    return { type: RESTORE_SESSION_REQUEST, data }
}

export function restoreSessionSuccess(data) {
    return { type: RESTORE_SESSION_SUCCESS, data }
}

export function restoreSessionFailure(data) {
    return { type: RESTORE_SESSION_FAILURE, data }
}

export function setCurrentSession(data) {
    return { type: SET_CURRENT_SESSION, data }
}

export function clearCurrentSession() {
    return { type: CLEAR_CURRENT_SESSION }
}

export function refreshCurrentSession(data) {
    return { type: REFRESH_CURRENT_SESSION_REQUEST, data }
}
export function refreshCurrentSessionSuccess(data) {
    return { type: REFRESH_CURRENT_SESSION_SUCCESS, data }
}

export function refreshCurrentSessionFailure(data) {
    return { type: REFRESH_CURRENT_SESSION_FAILURE, data }
}

export function setCurrentSessionTimeActiveToNow() {
    return { type: SET_CURRENT_SESSION_TIME_ACTIVE_TO_NOW }
}

