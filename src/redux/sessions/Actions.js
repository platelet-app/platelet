export const ADD_SESSION_REQUEST = 'ADD_SESSION_REQUEST';
export const ADD_SESSION_SUCCESS = 'ADD_SESSION_SUCCESS';
export const GET_SESSIONS_REQUEST = 'GET_SESSIONS_REQUEST';
export const GET_SESSIONS_SUCCESS = 'GET_SESSIONS_SUCCESS';
export const GET_SESSION_REQUEST = 'GET_SESSION_REQUEST';
export const GET_SESSION_SUCCESS = 'GET_SESSION_SUCCESS';
export const DELETE_SESSION_REQUEST = 'DELETE_SESSION_REQUEST';
export const DELETE_SESSION_SUCCESS = 'DELETE_SESSION_SUCCESS';
export const RESTORE_SESSION_REQUEST = 'RESTORE_SESSION_REQUEST';
export const RESTORE_SESSION_SUCCESS = 'RESTORE_SESSION_SUCCESS';

export function addSession(data) {
    return { type: ADD_SESSION_REQUEST, data }
}

export function addSessionSuccess(data) {
    return { type: ADD_SESSION_SUCCESS, data }
}

export function getAllSessions(data) {
    return { type: GET_SESSIONS_REQUEST, data }
}

export function getAllSessionsSuccess(data) {
    return { type: GET_SESSIONS_SUCCESS, data }
}

export function getSession(data) {
    return { type: GET_SESSION_REQUEST, data }
}

export function getSessionSuccess(data) {
    return { type: GET_SESSION_SUCCESS, data }
}

export function deleteSession(data) {
    return { type: DELETE_SESSION_REQUEST, data }
}

export function restoreSession(data) {
    return { type: RESTORE_SESSION_REQUEST, data }
}

export function deleteSessionSuccess(data) {
    return { type: DELETE_SESSION_SUCCESS, data }
}

export function restoreSessionSuccess(data) {
    return { type: RESTORE_SESSION_SUCCESS, data }
}
