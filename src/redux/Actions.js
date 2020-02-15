/*
 * action types
 */

// TASKS

export const GET_TASK = 'GET_TASK';
export const GET_TASK_SUCCESS = 'GET_TASK_SUCCESS';
export const ADD_TASK = 'ADD_TASK';
export const ADD_TASK_SUCCESS = 'ADD_TASK_SUCCESS';
export const UPDATE_TASK = 'UPDATE_TASK';
export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
export const GET_TASKS = 'GET_TASKS';
export const GET_TASKS_SUCCESS = 'GET_TASKS_SUCCESS';
export const GET_MY_TASKS = 'GET_MY_TASKS';
export const GET_MY_TASKS_SUCCESS = 'GET_MY_TASKS_SUCCESS';

export function getTask(data) {
    return { type: GET_TASK, data }
}

export function getTaskSuccess(data) {
    return { type: GET_TASK_SUCCESS, data }
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

// VEHICLES

export const ADD_VEHICLE = 'ADD_VEHICLE';
export const ADD_VEHICLE_SUCCESS = 'ADD_VEHICLE_SUCCESS';
export const UPDATE_VEHICLE = 'UPDATE_VEHICLE';
export const UPDATE_VEHICLE_SUCCESS = 'UPDATE_VEHICLE_SUCCESS';
export const GET_VEHICLES = 'GET_VEHICLES';
export const GET_VEHICLES_SUCCESS = 'GET_VEHICLES_SUCCESS';
export const GET_VEHICLE = 'GET_VEHICLE';
export const GET_VEHICLE_SUCCESS = 'GET_VEHICLE_SUCCESS';

export function addVehicle(data) {
    return { type: ADD_VEHICLE, data }
}

export function addVehicleSuccess(data) {
    return { type: ADD_VEHICLE_SUCCESS, data }
}

export function updateVehicle(data) {
    return { type: UPDATE_VEHICLE, data }
}

export function updateVehicleSuccess(data) {
    return { type: UPDATE_VEHICLE_SUCCESS, data }
}

export function getVehicle(data) {
    return { type: GET_VEHICLE, data }
}

export function getVehicleSuccess(data) {
    return { type: GET_VEHICLE_SUCCESS, data }
}

export function getAllVehicles(data) {
    return { type: GET_VEHICLES, data }
}

export function getAllVehiclesSuccess(data) {
    return { type: GET_VEHICLES_SUCCESS, data }
}

// SESSIONS

export const ADD_SESSION = 'ADD_SESSION';
export const ADD_SESSION_SUCCESS = 'ADD_SESSION_SUCCESS';
export const GET_SESSIONS = 'GET_SESSIONS';
export const GET_SESSIONS_SUCCESS = 'GET_SESSIONS_SUCCESS';

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


// DELIVERABLES

export const ADD_DELIVERABLE = 'ADD_DELIVERABLE';
export const ADD_DELIVERABLE_SUCCESS = 'ADD_DELIVERABLE_SUCCESS';
export const UPDATE_DELIVERABLE = 'UPDATE_DELIVERABLE';
export const UPDATE_DELIVERABLE_SUCCESS = 'UPDATE_DELIVERABLE_SUCCESS';
export const GET_DELIVERABLES = 'GET_DELIVERABLES';
export const GET_DELIVERABLES_SUCCESS = 'GET_DELIVERABLES_SUCCESS';
export const GET_AVAILABLE_DELIVERABLES = 'GET_AVAILABLE_DELIVERABLES';
export const GET_AVAILABLE_DELIVERABLES_SUCCESS = 'GET_AVAILABLE_DELIVERABLES_SUCCESS';

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

export function getAvailableDeliverables() {
    return { type: GET_AVAILABLE_DELIVERABLES }
}

export function getAvailableDeliverablesSuccess(data) {
    return { type: GET_AVAILABLE_DELIVERABLES_SUCCESS, data }
}


// LOGIN

export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export function loginUser(data) {
    return { type: ADD_DELIVERABLE, data }
}

export function loginUserSuccess(data) {
    return { type: ADD_DELIVERABLE_SUCCESS, data }
}


// PRIORITIES

export const GET_AVAILABLE_PRIORITIES = 'GET_AVAILABLE_PRIORITIES';
export const GET_AVAILABLE_PRIORITIES_SUCCESS = 'GET_AVAILABLE_PRIORITIES_SUCCESS';

export function getAvailablePriorities() {
    return { type: GET_AVAILABLE_PRIORITIES }
}

export function getAvailablePrioritiesSuccess(data) {
    return { type: GET_AVAILABLE_PRIORITIES_SUCCESS, data }
}


// LOCATIONS

export const GET_AVAILABLE_LOCATIONS = 'GET_AVAILABLE_LOCATIONS';
export const GET_AVAILABLE_LOCATIONS_SUCCESS = 'GET_AVAILABLE_LOCATIONS_SUCCESS';

export function getAvailableLocations() {
    return { type: GET_AVAILABLE_LOCATIONS }
}

export function getAvailableLocationsSuccess(data) {
    return { type: GET_AVAILABLE_LOCATIONS_SUCCESS, data }
}


// USERS

export const GET_USERS = 'GET_USERS';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';

export function getUsers() {
    return { type: GET_USERS }
}

export function getUsersSuccess(data) {
    return { type: GET_USERS_SUCCESS, data }
}
