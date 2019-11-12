/*
 * action types
 */

export const ADD_TASK = 'ADD_TASK';
export const ADD_TASK_SUCCESS = 'ADD_TASK_SUCCESS';

export const ADD_SESSION = 'ADD_SESSION';
export const ADD_SESSION_SUCCESS = 'ADD_SESSION_SUCCESS';
export const SAVE_SESSIONS = 'SAVE_SESSIONS';
export const SAVE_SESSIONS_SUCCESS = 'SAVE_SESSIONS_SUCCESS';


/*
 * other constants
 */

export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE'
};

/*
 * action creators
 */

export function addTask(data) {
    return { type: ADD_TASK, data }
}

export function addTaskSuccess(data) {
    return { type: ADD_TASK_SUCCESS, data }
}

export function addSession(data) {
    return { type: ADD_SESSION, data }
}

export function addSessionSuccess(data) {
    return { type: ADD_SESSION_SUCCESS, data }
}

export function saveAllSessions(data) {
    return { type: SAVE_SESSIONS, data }
}

export function saveAllSessionsSuccess(data) {
    return { type: SAVE_SESSIONS_SUCCESS, data }
}
