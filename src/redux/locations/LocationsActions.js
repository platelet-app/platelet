export const GET_AVAILABLE_LOCATIONS_REQUEST = 'GET_AVAILABLE_LOCATIONS_REQUEST';
export const GET_AVAILABLE_LOCATIONS_SUCCESS = 'GET_AVAILABLE_LOCATIONS_SUCCESS';
export const GET_AVAILABLE_LOCATIONS_FAILURE = 'GET_AVAILABLE_LOCATIONS_FAILURE';

export function getAvailableLocations() {
    return { type: GET_AVAILABLE_LOCATIONS_REQUEST }
}

export function getAvailableLocationsSuccess(data) {
    return { type: GET_AVAILABLE_LOCATIONS_SUCCESS, data }
}

export function getAvailableLocationsFailure(error) {
    return { type: GET_AVAILABLE_LOCATIONS_FAILURE, error }
}
