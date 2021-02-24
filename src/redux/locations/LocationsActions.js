import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const getAvailableLocationsPrefix = "GET_AVAILABLE_LOCATIONS";
export const getAvailableLocationsActions = createRequestActions(getAvailableLocationsPrefix);
export const {getAvailableLocationsSuccess, getAvailableLocationsFailure, getAvailableLocationsForbidden} = createRequestFunctions(getAvailableLocationsActions);

export function getAvailableLocationsRequest() {
    return { type: getAvailableLocationsActions.request }
}

export const getLocationPrefix = "GET_LOCATION";
export const getLocationActions = createRequestActions(getLocationPrefix);
export const {getLocationSuccess, getLocationFailure, getLocationForbidden, getLocationNotFound} = createRequestFunctions(getLocationActions);

export function getLocationRequest(locationUUID) {
    return { type: getLocationActions.request, data: {locationUUID} }
}

export const updateLocationPrefix = "UPDATE_LOCATION";
export const updateLocationActions = createRequestActions(updateLocationPrefix);
export const {updateLocationSuccess, updateLocationFailure, updateLocationForbidden, updateLocationNotFound} = createRequestFunctions(updateLocationActions);

export function updateLocationRequest(locationUUID, payload) {
    return { type: updateLocationActions.request, data: {locationUUID, payload} }
}

export const addLocationPrefix = "ADD_LOCATION";
export const addLocationActions = createRequestActions(addLocationPrefix);
export const {addLocationSuccess, addLocationFailure, addLocationForbidden} = createRequestFunctions(addLocationActions);

export function addLocationRequest(payload) {
    return { type: addLocationActions.request, data: {payload} }
}
