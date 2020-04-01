export const ADD_SESSION_REQUEST = 'ADD_SESSION_REQUEST';
export const ADD_SESSION_SUCCESS = 'ADD_SESSION_SUCCESS';
export const GET_SESSIONS_REQUEST = 'GET_SESSIONS_REQUEST';
export const GET_SESSIONS_SUCCESS = 'GET_SESSIONS_SUCCESS';
export const GET_SESSION_REQUEST = 'GET_SESSION_REQUEST';
export const GET_SESSION_SUCCESS = 'GET_SESSION_SUCCESS';

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


