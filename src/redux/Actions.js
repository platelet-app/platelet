/*
 * action types
 */

// TASKS

import {throttle} from "redux-saga/effects";

export const GET_TASK_REQUEST = 'GET_TASK_REQUEST';
export const GET_TASK_SUCCESS = 'GET_TASK_SUCCESS';
export const ADD_TASK_REQUEST = 'ADD_TASK_REQUEST';
export const ADD_TASK_SUCCESS = 'ADD_TASK_SUCCESS';
export const DELETE_TASK_REQUEST = 'DELETE_TASK_REQUEST';
export const DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS';
export const RESTORE_TASK_REQUEST = 'RESTORE_TASK_REQUEST';
export const RESTORE_TASK_SUCCESS = 'RESTORE_TASK_SUCCESS';

export const UPDATE_TASK_CONTACT_NAME = "UPDATE_TASK_CONTACT_NAME";
export const UPDATE_TASK_CONTACT_NUMBER = "UPDATE_TASK_CONTACT_NUMBER";
export const UPDATE_TASK_PICKUP_ADDRESS = "UPDATE_TASK_PICKUP_ADDRESS";
export const UPDATE_TASK_DROPOFF_ADDRESS = "UPDATE_TASK_DROPOFF_ADDRESS";
export const UPDATE_TASK_PICKUP_TIME = "UPDATE_TASK_PICKUP_TIME";
export const UPDATE_TASK_DROPOFF_TIME = "UPDATE_TASK_DROPOFF_TIME";
export const UPDATE_TASK_CANCELLED_TIME = "UPDATE_TASK_CANCELLED_TIME";
export const UPDATE_TASK_REJECTED_TIME = "UPDATE_TASK_REJECTED_TIME";
export const UPDATE_TASK_ASSIGNED_RIDER = "UPDATE_TASK_ASSIGNED_RIDER";
export const UPDATE_TASK_PRIORITY = "UPDATE_TASK_PRIORITY";

export const UPDATE_TASK_REQUEST = 'UPDATE_TASK_REQUEST';
export const UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS';
export const GET_TASKS_REQUEST = 'GET_TASKS_REQUEST';
export const GET_TASKS_SUCCESS = 'GET_TASKS_SUCCESS';
export const GET_MY_TASKS_REQUEST = 'GET_MY_TASKS_REQUEST';
export const GET_MY_TASKS_SUCCESS = 'GET_MY_TASKS_SUCCESS';

export function restoreTask(data) {
    return { type: RESTORE_TASK_REQUEST, data }
}

export function restoreTaskSuccess(data) {
    return { type: RESTORE_TASK_SUCCESS, data }
}

export function getTask(data) {
    return { type: GET_TASK_REQUEST, data }
}

export function getTaskSuccess(data) {
    return { type: GET_TASK_SUCCESS, data }
}

export function addTask(data) {
    return { type: ADD_TASK_REQUEST, data }
}

export function addTaskSuccess(data) {
    return { type: ADD_TASK_SUCCESS, data }
}

export function deleteTask(data) {
    return { type: DELETE_TASK_REQUEST, data }
}

export function deleteTaskSuccess(data) {
    return { type: DELETE_TASK_SUCCESS, data }
}

export function updateTask(data) {
    return { type: UPDATE_TASK_REQUEST, data }
}


export function updateTaskContactName(data) {
    return { type: UPDATE_TASK_CONTACT_NAME, data }
}
export function updateTaskContactNumber(data) {
    return { type: UPDATE_TASK_CONTACT_NUMBER, data }
}
export function updateTaskPickupAddress(data) {
    return { type: UPDATE_TASK_PICKUP_ADDRESS, data }
}
export function updateTaskDropoffAddress(data) {
    return { type: UPDATE_TASK_DROPOFF_ADDRESS, data }
}
export function updateTaskPickupTime(data) {
    return { type: UPDATE_TASK_PICKUP_TIME, data }
}
export function updateTaskDropoffTime(data) {
    return { type: UPDATE_TASK_DROPOFF_TIME, data }
}
export function updateTaskCancelledTime(data) {
    return { type: UPDATE_TASK_CANCELLED_TIME, data }
}
export function updateTaskRejectedTime(data) {
    return { type: UPDATE_TASK_REJECTED_TIME, data }
}
export function updateTaskAssignedRider(data) {
    return { type: UPDATE_TASK_ASSIGNED_RIDER, data }
}
export function updateTaskPriority(data) {
    return { type: UPDATE_TASK_PRIORITY, data }
}

export function updateTaskSuccess(data) {
    return { type: UPDATE_TASK_SUCCESS, data }
}

export function getAllTasks(data) {
    return { type: GET_TASKS_REQUEST, data }
}

export function getAllTasksSuccess(data) {
    return { type: GET_TASKS_SUCCESS, data }
}

export function getAllMyTasks(data) {
    return { type: GET_MY_TASKS_REQUEST, data }
}

export function getAllMyTasksSuccess(data) {
    return { type: GET_MY_TASKS_SUCCESS, data }
}

// VEHICLES

export const ADD_VEHICLE_REQUEST = 'ADD_VEHICLE_REQUEST';
export const ADD_VEHICLE_SUCCESS = 'ADD_VEHICLE_SUCCESS';
export const UPDATE_VEHICLE_REQUEST = 'UPDATE_VEHICLE_REQUEST';
export const UPDATE_VEHICLE_SUCCESS = 'UPDATE_VEHICLE_SUCCESS';
export const GET_VEHICLES_REQUEST = 'GET_VEHICLES_REQUEST';
export const GET_VEHICLES_SUCCESS = 'GET_VEHICLES_SUCCESS';
export const GET_VEHICLE_REQUEST = 'GET_VEHICLE_REQUEST';
export const GET_VEHICLE_SUCCESS = 'GET_VEHICLE_SUCCESS';

export function addVehicle(data) {
    return { type: ADD_VEHICLE_REQUEST, data }
}

export function addVehicleSuccess(data) {
    return { type: ADD_VEHICLE_SUCCESS, data }
}

export function updateVehicle(data) {
    return { type: UPDATE_VEHICLE_REQUEST, data }
}

export function updateVehicleSuccess(data) {
    return { type: UPDATE_VEHICLE_SUCCESS, data }
}

export function getVehicle(data) {
    return { type: GET_VEHICLE_REQUEST, data }
}

export function getVehicleSuccess(data) {
    return { type: GET_VEHICLE_SUCCESS, data }
}

export function getAllVehicles(data) {
    return { type: GET_VEHICLES_REQUEST, data }
}

export function getAllVehiclesSuccess(data) {
    return { type: GET_VEHICLES_SUCCESS, data }
}

// SESSIONS

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


// DELIVERABLES

export const ADD_DELIVERABLE_REQUEST = 'ADD_DELIVERABLE_REQUEST';
export const ADD_DELIVERABLE_SUCCESS = 'ADD_DELIVERABLE_SUCCESS';
export const UPDATE_DELIVERABLE_REQUEST = 'UPDATE_DELIVERABLE_REQUEST';
export const UPDATE_DELIVERABLE_SUCCESS = 'UPDATE_DELIVERABLE_SUCCESS';
export const GET_DELIVERABLES_REQUEST = 'GET_DELIVERABLES_REQUEST';
export const GET_DELIVERABLES_SUCCESS = 'GET_DELIVERABLES_SUCCESS';
export const GET_AVAILABLE_DELIVERABLES_REQUEST = 'GET_AVAILABLE_DELIVERABLES_REQUEST';
export const GET_AVAILABLE_DELIVERABLES_SUCCESS = 'GET_AVAILABLE_DELIVERABLES_SUCCESS';

export function addDeliverable(data) {
    return { type: ADD_DELIVERABLE_REQUEST, data }
}

export function addDeliverableSuccess(data) {
    return { type: ADD_DELIVERABLE_SUCCESS, data }
}

export function getDeliverables(data) {
    return { type: GET_DELIVERABLES_REQUEST, data }
}

export function getDeliverablesSuccess(data) {
    return { type: GET_DELIVERABLES_SUCCESS, data }
}

export function updateDeliverable(data) {
    return { type: UPDATE_DELIVERABLE_REQUEST, data }
}

export function updateDeliverableSuccess(data) {
    return { type: UPDATE_DELIVERABLE_SUCCESS, data }
}

export function getAvailableDeliverables() {
    return { type: GET_AVAILABLE_DELIVERABLES_REQUEST }
}

export function getAvailableDeliverablesSuccess(data) {
    return { type: GET_AVAILABLE_DELIVERABLES_SUCCESS, data }
}


// LOGIN

export const LOGIN_REQUEST = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';

export function loginUser(data) {
    return { type: LOGIN_REQUEST, data }
}

export function loginUserSuccess(data) {
    return { type: LOGIN_SUCCESS, data }
}

export function logoutUser() {
    return { type: LOGOUT }
}

// PRIORITIES

export const GET_AVAILABLE_PRIORITIES_REQUEST = 'GET_AVAILABLE_PRIORITIES_REQUEST';
export const GET_AVAILABLE_PRIORITIES_SUCCESS = 'GET_AVAILABLE_PRIORITIES_SUCCESS';

export function getAvailablePriorities() {
    return { type: GET_AVAILABLE_PRIORITIES_REQUEST }
}

export function getAvailablePrioritiesSuccess(data) {
    return { type: GET_AVAILABLE_PRIORITIES_SUCCESS, data }
}


// LOCATIONS

export const GET_AVAILABLE_LOCATIONS_REQUEST = 'GET_AVAILABLE_LOCATIONS_REQUEST';
export const GET_AVAILABLE_LOCATIONS_SUCCESS = 'GET_AVAILABLE_LOCATIONS_SUCCESS';

export function getAvailableLocations() {
    return { type: GET_AVAILABLE_LOCATIONS_REQUEST }
}

export function getAvailableLocationsSuccess(data) {
    return { type: GET_AVAILABLE_LOCATIONS_SUCCESS, data }
}


// USERS

export const GET_USERS_REQUEST = 'GET_USERS_REQUEST';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';

export function getUsers() {
    return { type: GET_USERS_REQUEST }
}

export function getUsersSuccess(data) {
    return { type: GET_USERS_SUCCESS, data }
}

export const GET_ACTIVE_TASK_UUID = 'GET_ACTIVE_TASK_UUID';
export const SET_ACTIVE_TASK_UUID = 'GET_ACTIVE_TASK_UUID';

export function getActiveTaskUUID() {
    return { type: GET_ACTIVE_TASK_UUID }
}

export function setActiveTaskUUID() {
    return { type: SET_ACTIVE_TASK_UUID }
}

export const CLEAR_LOADING = 'CLEAR_LOADING';

export function clearLoading() {
    return { type: CLEAR_LOADING }
}

export const GET_WHOAMI = 'GET_WHOAMI';
export const GET_WHOAMI_SUCCESS = 'GET_WHOAMI_SUCCESS';

export function getWhoami() {
    return { type: GET_WHOAMI }
}

export function getWhoamiSuccess(data) {
    return { type: GET_WHOAMI_SUCCESS, data }
}
