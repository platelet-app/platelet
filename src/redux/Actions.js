/*
 * action types
 */

// TASKS
export const ADD_TASK = 'ADD_TASK';
export const ADD_TASK_SUCCESS = 'ADD_TASK_SUCCESS';
export const UPDATE_TASK = 'UPDATE_TASK';
export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
export const GET_TASKS = 'GET_TASKS';
export const GET_TASKS_SUCCESS = 'GET_TASKS_SUCCESS';
export const GET_MY_TASKS = 'GET_MY_TASKS';
export const GET_MY_TASKS_SUCCESS = 'GET_MY_TASKS_SUCCESS';

// SESSIONS
export const ADD_SESSION = 'ADD_SESSION';
export const ADD_SESSION_SUCCESS = 'ADD_SESSION_SUCCESS';
export const GET_SESSIONS = 'GET_SESSIONS';
export const GET_SESSIONS_SUCCESS = 'GET_SESSIONS_SUCCESS';

// DELIVERABLES
export const ADD_DELIVERABLE = 'ADD_DELIVERABLE';
export const ADD_DELIVERABLE_SUCCESS = 'ADD_DELIVERABLE_SUCCESS';
export const UPDATE_DELIVERABLE = 'UPDATE_DELIVERABLE';
export const UPDATE_DELIVERABLE_SUCCESS = 'UPDATE_DELIVERABLE_SUCCESS';
export const GET_DELIVERABLES = 'GET_DELIVERABLES';
export const GET_DELIVERABLES_SUCCESS = 'GET_DELIVERABLES_SUCCESS';


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

export function addDeliverable(data) {
    return { type: ADD_DELIVERABLE, data }
}

export function addDeliverableSuccess(data) {
    return { type: ADD_DELIVERABLE_SUCCESS, data }
}

export function getDeliverables(data) {
    return { type: GET_DELIVERABLES, data }
}

export function getDeliverablesSuccess(data) {
    return { type: GET_DELIVERABLES_SUCCESS, data }
}

export function updateDeliverable(data) {
    return { type: UPDATE_DELIVERABLE, data }
}

export function updateDeliverableSuccess(data) {
    return { type: UPDATE_DELIVERABLE_SUCCESS, data }
}

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

export function getAllMyTasks(data) {
    return { type: GET_MY_TASKS, data }
}

export function getAllMyTasksSuccess(data) {
    return { type: GET_MY_TASKS_SUCCESS, data }
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
