import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const getTaskDestinationActions = createRequestActions("GET_TASK_DESTINATIONS")
export const setTaskPickupDestinationActions = createRequestActions("SET_TASK_PICKUP_DESTINATION")
export const setTaskDropoffDestinationActions = createRequestActions("SET_TASK_DROPOFF_DESTINATION")
export const unsetTaskPickupDestinationActions = createRequestActions("UNSET_TASK_PICKUP_DESTINATION")
export const unsetTaskDropoffDestinationActions = createRequestActions("UNSET_TASK_DROPOFF_DESTINATION")
export const addNewPickupLocationAndSetTaskActions = createRequestActions("ADD_NEW_PICKUP_LOCATION_AND_SET_TASK")
export const addNewDropoffLocationAndSetTaskActions = createRequestActions("ADD_NEW_DROPOFF_LOCATION_AND_SET_TASK")
export const updatePickupLocationAndUpdateTaskActions = createRequestActions("UPDATE_PICKUP_LOCATION_AND_UPDATE_TASK")
export const updateDropoffLocationAndUpdateTaskActions = createRequestActions("UPDATE_DROPOFF_LOCATION_AND_UPDATE_TASK")

export const {getTaskDestinationFailure, getTaskDestinationSuccess} = createRequestFunctions(getTaskDestinationActions);
export const {setTaskPickupDestinationFailure, setTaskPickupDestinationSuccess} = createRequestFunctions(setTaskPickupDestinationActions);
export const {setTaskDropoffDestinationFailure, setTaskDropoffDestinationSuccess} = createRequestFunctions(setTaskDropoffDestinationActions);
export const {unsetTaskDropoffDestinationFailure, unsetTaskDropoffDestinationSuccess} = createRequestFunctions(unsetTaskDropoffDestinationActions);
export const {unsetTaskPickupDestinationFailure, unsetTaskPickupDestinationSuccess} = createRequestFunctions(unsetTaskPickupDestinationActions);
export const {addNewPickupLocationAndSetTaskFailure, addNewPickupLocationAndSetTaskSuccess} = createRequestFunctions(addNewPickupLocationAndSetTaskActions);
export const {addNewDropoffLocationAndSetTaskFailure, addNewDropoffLocationAndSetTaskSuccess} = createRequestFunctions(addNewDropoffLocationAndSetTaskActions);
export const {updatePickupLocationAndUpdateTaskFailure, updatePickupLocationAndUpdateTaskSuccess} = createRequestFunctions(updatePickupLocationAndUpdateTaskActions);
export const {updateDropoffLocationAndUpdateTaskFailure, updateDropoffLocationAndUpdateTaskSuccess} = createRequestFunctions(updateDropoffLocationAndUpdateTaskActions);

export function setTaskDropoffDestinationRequest(taskUUID, locationUUID) {
    return { type: setTaskDropoffDestinationActions.request, data: {taskUUID, payload: {location_uuid: locationUUID}} }
}

export function unsetTaskDropoffDestinationRequest(taskUUID) {
    return { type: unsetTaskDropoffDestinationActions.request, data: {taskUUID} }
}

export function setTaskPickupDestinationRequest(taskUUID, locationUUID) {
    return { type: setTaskPickupDestinationActions.request, data: {taskUUID, payload: {location_uuid: locationUUID}} }
}

export function unsetTaskPickupDestinationRequest(taskUUID) {
    return { type: unsetTaskPickupDestinationActions.request, data: {taskUUID} }
}
export function addNewPickupLocationAndSetTaskRequest(taskUUID, payload) {
    return {type: addNewPickupLocationAndSetTaskActions.request, data: {taskUUID, payload}}
}

export function addNewDropoffLocationAndSetTaskRequest(taskUUID, payload) {
    return {type: addNewDropoffLocationAndSetTaskActions.request, data: {taskUUID, payload}}
}

export function updatePickupLocationAndUpdateTaskRequest(taskUUID, payload) {
    return {type: updatePickupLocationAndUpdateTaskActions.request, data: {taskUUID, payload}}
}

export function updateDropoffLocationAndUpdateTaskRequest(taskUUID, payload) {
    return {type: updateDropoffLocationAndUpdateTaskActions.request, data: {taskUUID, payload}}
}
