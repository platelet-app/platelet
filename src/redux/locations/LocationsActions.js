export const GET_AVAILABLE_LOCATIONS_REQUEST = 'GET_AVAILABLE_LOCATIONS_REQUEST';
export const GET_AVAILABLE_LOCATIONS_SUCCESS = 'GET_AVAILABLE_LOCATIONS_SUCCESS';
export const GET_AVAILABLE_LOCATIONS_FAILURE = 'GET_AVAILABLE_LOCATIONS_FAILURE';

export function getAvailableLocationsRequest() {
    return { type: GET_AVAILABLE_LOCATIONS_REQUEST }
}

export function getAvailableLocationsSuccess(data) {
    return { type: GET_AVAILABLE_LOCATIONS_SUCCESS, data }
}

export function getAvailableLocationsFailure(error) {
    return { type: GET_AVAILABLE_LOCATIONS_FAILURE, error }
}

export const GET_LOCATION_REQUEST = 'GET_LOCATION_REQUEST';
export const GET_LOCATION_SUCCESS = 'GET_LOCATION_SUCCESS';
export const GET_LOCATION_FAILURE = 'GET_LOCATION_FAILURE';
export const GET_LOCATION_NOTFOUND = 'GET_LOCATION_NOTFOUND';

export function getLocationRequest(data) {
    return { type: GET_LOCATION_REQUEST, data }
}

export function getLocationSuccess(data) {
    return { type: GET_LOCATION_SUCCESS, data }
}

export function getLocationFailure(error) {
    return { type: GET_LOCATION_FAILURE, error }
}

export function getLocationNotFound(error) {
    return { type: GET_LOCATION_NOTFOUND, error }
}
