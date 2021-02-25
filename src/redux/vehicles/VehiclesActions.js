import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const addVehiclePrefix = "ADD_VEHICLE";
export const addVehicleActions = createRequestActions(addVehiclePrefix);
export const {addVehicleSuccess, addVehicleFailure, addVehicleForbidden} = createRequestFunctions(addVehicleActions);

export function addVehicleRequest(payload) {
    return { type: addVehicleActions.request, data: {payload} }
}


export const updateVehiclePrefix = "UPDATE_VEHICLE";
export const updateVehicleActions = createRequestActions(updateVehiclePrefix);
export const {updateVehicleSuccess, updateVehicleFailure, updateVehicleForbidden} = createRequestFunctions(updateVehicleActions);

export function updateVehicleRequest(vehicleUUID, payload) {
    return { type: updateVehicleActions.request, data: {vehicleUUID, payload} }
}


export const getVehiclesPrefix = "GET_VEHICLES";
export const getVehiclesActions = createRequestActions(getVehiclesPrefix);
export const {getVehiclesRequest, getVehiclesSuccess, getVehiclesFailure, getVehiclesForbidden} = createRequestFunctions(getVehiclesActions);

export const getVehiclePrefix = "GET_VEHICLE";
export const getVehicleActions = createRequestActions(getVehiclePrefix);
export const {getVehicleSuccess, getVehicleFailure, getVehicleNotFound, getVehicleForbidden} = createRequestFunctions(getVehicleActions);

export function getVehicleRequest(vehicleUUID) {
    return { type: getVehicleActions.request, data: {vehicleUUID} }
}


export const restoreVehiclePrefix = "RESTORE_VEHICLE";
export const restoreVehicleActions = createRequestActions(restoreVehiclePrefix);
export const {restoreVehicleSuccess, restoreVehicleFailure, restoreVehicleForbidden} = createRequestFunctions(restoreVehicleActions);

export function restoreVehicleRequest(vehicleUUID) {
    return { type: restoreVehicleActions.request, data: {vehicleUUID} }
}


export const deleteVehiclePrefix = "DELETE_VEHICLE";
export const deleteVehicleActions = createRequestActions(deleteVehiclePrefix);
export const {deleteVehicleSuccess, deleteVehicleFailure, deleteVehicleForbidden} = createRequestFunctions(deleteVehicleActions);


export function deleteVehicleRequest(vehicleUUID) {
    return { type: deleteVehicleActions.request, data: {vehicleUUID} }
}

