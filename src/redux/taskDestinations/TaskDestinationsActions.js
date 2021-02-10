export const GET_TASK_DESTINATIONS_REQUEST = "GET_TASK_DESTINATIONS_REQUEST";
export const SET_TASK_PICKUP_DESTINATION_REQUEST = "SET_TASK_PICKUP_DESTINATION_REQUEST";
export const SET_TASK_DROPOFF_DESTINATION_REQUEST = "SET_TASK_DROPOFF_DESTINATION_REQUEST";
export const UNSET_TASK_PICKUP_DESTINATION_REQUEST = "UNSET_TASK_PICKUP_DESTINATION_REQUEST";
export const UNSET_TASK_DROPOFF_DESTINATION_REQUEST = "UNSET_TASK_DROPOFF_DESTINATION_REQUEST";
export const GET_TASK_PICKUP_DESTINATION_REQUEST = "GET_TASK_PICKUP_DESTINATION_REQUEST";
export const GET_TASK_DROPOFF_DESTINATION_REQUEST = "GET_TASK_DROPOFF_DESTINATION_REQUEST";

export const GET_TASK_DESTINATIONS_SUCCESS = "GET_TASK_DESTINATIONS_SUCCESS";
export const SET_TASK_PICKUP_DESTINATION_SUCCESS = "SET_TASK_PICKUP_DESTINATION_SUCCESS";
export const SET_TASK_DROPOFF_DESTINATION_SUCCESS = "SET_TASK_DROPOFF_DESTINATION_SUCCESS";
export const UNSET_TASK_PICKUP_DESTINATION_SUCCESS = "UNSET_TASK_PICKUP_DESTINATION_SUCCESS";
export const UNSET_TASK_DROPOFF_DESTINATION_SUCCESS = "UNSET_TASK_DROPOFF_DESTINATION_SUCCESS";
export const GET_TASK_PICKUP_DESTINATION_SUCCESS = "GET_TASK_PICKUP_DESTINATION_SUCCESS";
export const GET_TASK_DROPOFF_DESTINATION_SUCCESS = "GET_TASK_DROPOFF_DESTINATION_SUCCESS";


export const GET_TASK_DESTINATIONS_FAILURE = "GET_TASK_DESTINATIONS_FAILURE";
export const SET_TASK_PICKUP_DESTINATION_FAILURE = "SET_TASK_PICKUP_DESTINATION_FAILURE";
export const SET_TASK_DROPOFF_DESTINATION_FAILURE = "SET_TASK_DROPOFF_DESTINATION_FAILURE";
export const UNSET_TASK_PICKUP_DESTINATION_FAILURE = "UNSET_TASK_PICKUP_DESTINATION_FAILURE";
export const UNSET_TASK_DROPOFF_DESTINATION_FAILURE = "UNSET_TASK_DROPOFF_DESTINATION_FAILURE";
export const GET_TASK_PICKUP_DESTINATION_FAILURE = "GET_TASK_PICKUP_DESTINATION_FAILURE";
export const GET_TASK_DROPOFF_DESTINATION_FAILURE = "GET_TASK_DROPOFF_DESTINATION_FAILURE";

export const ADD_NEW_PICKUP_LOCATION_AND_SET_TASK = "ADD_NEW_PICKUP_LOCATION_AND_SET_TASK";
export const ADD_NEW_DROPOFF_LOCATION_AND_SET_TASK = "ADD_NEW_DROPOFF_LOCATION_AND_SET_TASK";
export const UPDATE_TASK_PICKUP_LOCATION_AND_UPDATE_TASK = "UPDATE_TASK_PICKUP_LOCATION_AND_UPDATE_TASK";
export const UPDATE_TASK_DROPOFF_LOCATION_AND_UPDATE_TASK = "UPDATE_TASK_DROPOFF_LOCATION_AND_UPDATE_TASK";

export function getTaskDestinationRequest(locationUUID) {
    return { type: GET_TASK_DROPOFF_DESTINATION_REQUEST, data: {location_uuid: locationUUID} }
}

export function getTaskDestinationFailure(error) {
    return { type: GET_TASK_DROPOFF_DESTINATION_FAILURE, error }
}

export function getTaskDestinationSuccess(data) {
    return { type: GET_TASK_DROPOFF_DESTINATION_SUCCESS, data }
}

export function setTaskDropoffDestinationRequest(taskUUID, locationUUID) {
    return { type: SET_TASK_DROPOFF_DESTINATION_REQUEST, data: {taskUUID, payload: {location_uuid: locationUUID}} }
}

export function setTaskDropoffDestinationFailure(error) {
    return { type: SET_TASK_DROPOFF_DESTINATION_FAILURE, error }
}

export function setTaskDropoffDestinationSuccess(data) {
    return { type: SET_TASK_DROPOFF_DESTINATION_SUCCESS, data }
}

export function unsetTaskDropoffDestinationRequest(taskUUID) {
    return { type: UNSET_TASK_DROPOFF_DESTINATION_REQUEST, data: {taskUUID} }
}

export function unsetTaskDropoffDestinationFailure(error) {
    return { type: UNSET_TASK_DROPOFF_DESTINATION_FAILURE, error }
}

export function unsetTaskDropoffDestinationSuccess(data) {
    return { type: UNSET_TASK_DROPOFF_DESTINATION_SUCCESS, data }
}

export function setTaskPickupDestinationRequest(taskUUID, locationUUID) {
    return { type: SET_TASK_PICKUP_DESTINATION_REQUEST, data: {taskUUID, payload: {location_uuid: locationUUID}} }
}

export function setTaskPickupDestinationFailure(error) {
    return { type: SET_TASK_PICKUP_DESTINATION_FAILURE, error }
}

export function setTaskPickupDestinationSuccess(data) {
    return { type: SET_TASK_PICKUP_DESTINATION_SUCCESS, data }
}

export function unsetTaskPickupDestinationRequest(taskUUID) {
    return { type: UNSET_TASK_PICKUP_DESTINATION_REQUEST, data: {taskUUID} }
}

export function unsetTaskPickupDestinationFailure(error) {
    return { type: UNSET_TASK_PICKUP_DESTINATION_FAILURE, error }
}

export function unsetTaskPickupDestinationSuccess(data) {
    return { type: UNSET_TASK_PICKUP_DESTINATION_SUCCESS, data }
}

export function addNewPickupLocationAndSetTask(taskUUID, payload) {
    return {type: ADD_NEW_PICKUP_LOCATION_AND_SET_TASK, data: {taskUUID, payload}}
}

export function addNewDropoffLocationAndSetTask(taskUUID, payload) {
    return {type: ADD_NEW_DROPOFF_LOCATION_AND_SET_TASK, data: {taskUUID, payload}}
}

export function updateTaskPickupLocationAndUpdateTask(taskUUID, payload) {
    return {type: UPDATE_TASK_PICKUP_LOCATION_AND_UPDATE_TASK, data: {taskUUID, payload}}
}
