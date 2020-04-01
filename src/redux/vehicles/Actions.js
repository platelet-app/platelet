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
