/*
 * action types
 */

export const ADD_TASK = 'ADD_TASK';
export const ADD_TASK_SUCCESS = 'ADD_TASK_SUCCESS';
export const UPDATE_TASK = 'UPDATE_TASK';
export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
export const GET_TASKS = 'GET_TASKS';
export const GET_TASKS_SUCCESS = 'GET_TASKS_SUCCESS';

export const ADD_SESSION = 'ADD_SESSION';
export const ADD_SESSION_SUCCESS = 'ADD_SESSION_SUCCESS';
export const GET_SESSIONS = 'GET_SESSIONS';
export const GET_SESSIONS_SUCCESS = 'GET_SESSIONS_SUCCESS';


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

export function updateTask(data) {
    return { type: UPDATE_TASK, data }
}

export function updateTaskSuccess(data) {
    return { type: UPDATE_TASK_SUCCESS, data }
}

export function getAllTasks(data) {
    return { type: GET_TASKS, data }
}

export function getAllTasksSuccess(data) {
    return { type: GET_TASKS_SUCCESS, data }
}

export function addSession(data) {
    return { type: ADD_SESSION, data }
}

export function addSessionSuccess(data) {
    return { type: ADD_SESSION_SUCCESS, data }
}

export function getAllSessions(data) {
    return { type: GET_SESSIONS, data }
}

export function getAllSessionsSuccess(data) {
    return { type: GET_SESSIONS_SUCCESS, data }
}
