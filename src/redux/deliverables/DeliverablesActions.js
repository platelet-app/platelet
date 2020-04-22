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

