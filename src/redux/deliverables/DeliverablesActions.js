import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const addDeliverablePrefix = "ADD_DELIVERABLE";
export const addDeliverableActions = createRequestActions(addDeliverablePrefix);
export const {addDeliverableSuccess, addDeliverableFailure, addDeliverableForbidden, addDeliverableNotFound} = createRequestFunctions(addDeliverableActions);

export function addDeliverableRequest(data) {
    return { type: addDeliverableActions.request, data }
}

export const deleteDeliverablePrefix = "DELETE_DELIVERABLE";
export const deleteDeliverableActions = createRequestActions(deleteDeliverablePrefix);
export const {deleteDeliverableSuccess, deleteDeliverableFailure, deleteDeliverableForbidden, deleteDeliverableNotFound} = createRequestFunctions(deleteDeliverableActions);

export function deleteDeliverableRequest(data) {
    return { type: deleteDeliverableActions.request, data }
}

export const updateDeliverablePrefix = "UPDATE_DELIVERABLE";
export const updateDeliverableActions = createRequestActions(updateDeliverablePrefix);
export const {updateDeliverableSuccess, updateDeliverableFailure, updateDeliverableForbidden, updateDeliverableNotFound} = createRequestFunctions(updateDeliverableActions)

export function updateDeliverableRequest(data) {
    return { type: updateDeliverableActions.request, data }
}

export const getDeliverablesPrefix = "GET_DELIVERABLES";
export const getDeliverablesActions = createRequestActions(getDeliverablesPrefix);
export const {getDeliverablesSuccess, getDeliverablesFailure, getDeliverablesForbidden, getDeliverablesNotFound} = createRequestFunctions(getDeliverablesActions)

export function getDeliverablesRequest(data) {
    return { type: getDeliverablesActions.request, data }
}

export const getAvailableDeliverablesPrefix = "GET_AVAILABLE_DELIVERABLES";
export const getAvailableDeliverablesActions = createRequestActions(getAvailableDeliverablesPrefix);
export const {getAvailableDeliverablesSuccess, getAvailableDeliverablesFailure, getAvailableDeliverablesForbidden} = createRequestFunctions(getAvailableDeliverablesActions)


export function getAvailableDeliverablesRequest() {
    return { type: getAvailableDeliverablesActions.request }
}

