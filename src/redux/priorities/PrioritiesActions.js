export const GET_AVAILABLE_PRIORITIES_REQUEST = 'GET_AVAILABLE_PRIORITIES_REQUEST';
export const GET_AVAILABLE_PRIORITIES_SUCCESS = 'GET_AVAILABLE_PRIORITIES_SUCCESS';
export const GET_AVAILABLE_PRIORITIES_FAILURE = 'GET_AVAILABLE_PRIORITIES_FAILURE';

export function getAvailablePriorities() {
    return { type: GET_AVAILABLE_PRIORITIES_REQUEST }
}

export function getAvailablePrioritiesFailure(error) {
    return { type: GET_AVAILABLE_PRIORITIES_FAILURE, error }
}

export function getAvailablePrioritiesSuccess(data) {
    return { type: GET_AVAILABLE_PRIORITIES_SUCCESS, data }
}

