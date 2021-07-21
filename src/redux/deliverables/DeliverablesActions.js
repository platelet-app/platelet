import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const addDeliverablePrefix = "ADD_DELIVERABLE";
export const addDeliverableActions = createRequestActions(addDeliverablePrefix);
export const {addDeliverableSuccess, addDeliverableFailure, addDeliverableForbidden, addDeliverableNotFound} = createRequestFunctions(addDeliverableActions);

export function addDeliverableRequest(payload) {
    return { type: addDeliverableActions.request, data: {payload} }
}

export const deleteDeliverablePrefix = "DELETE_DELIVERABLE";
export const deleteDeliverableActions = createRequestActions(deleteDeliverablePrefix);
export const {deleteDeliverableSuccess, deleteDeliverableFailure, deleteDeliverableForbidden, deleteDeliverableNotFound} = createRequestFunctions(deleteDeliverableActions);

export function deleteDeliverableRequest(deliverableUUID) {
    return { type: deleteDeliverableActions.request, data: {deliverableUUID} }
}

export const updateDeliverablePrefix = "UPDATE_DELIVERABLE";
export const updateDeliverableActions = createRequestActions(updateDeliverablePrefix);
export const {updateDeliverableSuccess, updateDeliverableFailure, updateDeliverableForbidden, updateDeliverableNotFound} = createRequestFunctions(updateDeliverableActions)

export function updateDeliverableRequest(deliverableUUID, payload) {
    return { type: updateDeliverableActions.request, data: {deliverableUUID, payload} }
}

export const getDeliverablesPrefix = "GET_DELIVERABLES";
export const getDeliverablesActions = createRequestActions(getDeliverablesPrefix);
export const {getDeliverablesSuccess, getDeliverablesFailure, getDeliverablesForbidden, getDeliverablesNotFound} = createRequestFunctions(getDeliverablesActions)

export const updateDeliverableCountPrefix = "UPDATE_DELIVERABLE_COUNT";
export const updateDeliverableCountActions = createRequestActions(updateDeliverableCountPrefix);
export const {updateDeliverableCountSuccess, updateDeliverableCountFailure, updateDeliverableCountForbidden, updateDeliverableCountNotFound} = createRequestFunctions(updateDeliverableCountActions)

export function updateDeliverableCountRequest(deliverableUUID, value) {
    return {type: updateDeliverableCountActions.request, data: {deliverableUUID, payload: {count: value}}};
}

export function getDeliverablesRequest(parentUUID) {
    return { type: getDeliverablesActions.request, data: {parentUUID}}
}

export const getAvailableDeliverablesPrefix = "GET_AVAILABLE_DELIVERABLES";
export const getAvailableDeliverablesActions = createRequestActions(getAvailableDeliverablesPrefix);
export const {getAvailableDeliverablesSuccess, getAvailableDeliverablesFailure, getAvailableDeliverablesForbidden} = createRequestFunctions(getAvailableDeliverablesActions)


export function getAvailableDeliverablesRequest() {
    return { type: getAvailableDeliverablesActions.request }
}

export const SET_DELIVERABLES_SORTED = "SET_DELIVERABLES_SORTED";
export const DELIVERABLES_SORTED = "DELIVERABLES_SORTED";

export function deliverablesSorted(data) {
    return {type: DELIVERABLES_SORTED, data}
}

export function setDeliverablesSorted() {
    return {type: SET_DELIVERABLES_SORTED}
}
