export const ADD_VEHICLE_REQUEST = 'ADD_VEHICLE_REQUEST';
export const ADD_VEHICLE_SUCCESS = 'ADD_VEHICLE_SUCCESS';
export const UPDATE_VEHICLE_REQUEST = 'UPDATE_VEHICLE_REQUEST';
export const UPDATE_VEHICLE_SUCCESS = 'UPDATE_VEHICLE_SUCCESS';
export const UPDATE_VEHICLE_FAILURE = 'UPDATE_VEHICLE_FAILURE';
export const UPDATE_VEHICLE_NAME_REQUEST = 'UPDATE_VEHICLE_NAME_REQUEST';
export const UPDATE_VEHICLE_NAME_SUCCESS = 'UPDATE_VEHICLE_NAME_SUCCESS';
export const UPDATE_VEHICLE_MANUFACTURER_REQUEST = 'UPDATE_VEHICLE_MANUFACTURER_REQUEST';
export const UPDATE_VEHICLE_MANUFACTURER_SUCCESS = 'UPDATE_VEHICLE_MANUFACTURER_SUCCESS';
export const UPDATE_VEHICLE_MODEL_REQUEST = 'UPDATE_VEHICLE_MODEL_REQUEST';
export const UPDATE_VEHICLE_MODEL_SUCCESS = 'UPDATE_VEHICLE_MODEL_SUCCESS';
export const UPDATE_VEHICLE_REGISTRATION_REQUEST = 'UPDATE_VEHICLE_REGISTRATION_REQUEST';
export const UPDATE_VEHICLE_REGISTRATION_SUCCESS = 'UPDATE_VEHICLE_REGISTRATION_SUCCESS';
export const GET_VEHICLES_REQUEST = 'GET_VEHICLES_REQUEST';
export const GET_VEHICLES_SUCCESS = 'GET_VEHICLES_SUCCESS';
export const GET_VEHICLES_FAILURE = 'GET_VEHICLES_FAILURE';
export const GET_VEHICLE_REQUEST = 'GET_VEHICLE_REQUEST';
export const GET_VEHICLE_FAILURE = 'GET_VEHICLE_FAILURE';
export const GET_VEHICLE_SUCCESS = 'GET_VEHICLE_SUCCESS';
export const RESTORE_VEHICLE_REQUEST = 'RESTORE_VEHICLE_REQUEST';
export const RESTORE_VEHICLE_SUCCESS = 'RESTORE_VEHICLE_SUCCESS';
export const RESTORE_VEHICLE_FAILURE = 'RESTORE_VEHICLE_FAILURE';
export const DELETE_VEHICLE_REQUEST = 'DELETE_VEHICLE_REQUEST';
export const DELETE_VEHICLE_SUCCESS = 'DELETE_VEHICLE_SUCCESS';
export const DELETE_VEHICLE_FAILURE = 'DELETE_VEHICLE_FAILURE';

export const GET_VEHICLE_NOTFOUND = 'GET_VEHICLE_NOTFOUND'

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

export function updateVehicleFailure(error) {
    return { type: UPDATE_VEHICLE_FAILURE, error }
}

export function getVehicle(data) {
    return { type: GET_VEHICLE_REQUEST, data }
}

export function getVehicleSuccess(data) {
    return { type: GET_VEHICLE_SUCCESS, data }
}

export function getVehicleFailure(error) {
    return { type: GET_VEHICLE_FAILURE, error }
}

export function vehicleNotFound() {
    return {type: GET_VEHICLE_NOTFOUND}
}

export function restoreVehicle(data) {
    return { type: RESTORE_VEHICLE_REQUEST, data }
}

export function restoreVehicleSuccess(data) {
    return { type: RESTORE_VEHICLE_SUCCESS, data }
}

export function restoreVehicleFailure(error) {
    return { type: RESTORE_VEHICLE_FAILURE, error }
}

export function deleteVehicle(data) {
    return { type: DELETE_VEHICLE_REQUEST, data }
}

export function deleteVehicleFailure(error) {
    return { type: DELETE_VEHICLE_FAILURE, error }
}

export function deleteVehicleSuccess(data) {
    return { type: DELETE_VEHICLE_SUCCESS, data }
}

export function getAllVehicles(data) {
    return { type: GET_VEHICLES_REQUEST, data }
}

export function getAllVehiclesSuccess(data) {
    return { type: GET_VEHICLES_SUCCESS, data }
}

export function getAllVehiclesFailure(error) {
    return { type: GET_VEHICLES_FAILURE, error }
}
