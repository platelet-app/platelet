export const GET_AVAILABLE_PRIORITIES_REQUEST = 'GET_AVAILABLE_PRIORITIES_REQUEST';
export const GET_AVAILABLE_PRIORITIES_SUCCESS = 'GET_AVAILABLE_PRIORITIES_SUCCESS';

export function getAvailablePriorities() {
    return { type: GET_AVAILABLE_PRIORITIES_REQUEST }
}

export function getAvailablePrioritiesSuccess(data) {
    return { type: GET_AVAILABLE_PRIORITIES_SUCCESS, data }
}

