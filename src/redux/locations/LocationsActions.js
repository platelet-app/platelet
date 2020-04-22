export const GET_AVAILABLE_LOCATIONS_REQUEST = 'GET_AVAILABLE_LOCATIONS_REQUEST';
export const GET_AVAILABLE_LOCATIONS_SUCCESS = 'GET_AVAILABLE_LOCATIONS_SUCCESS';

export function getAvailableLocations() {
    return { type: GET_AVAILABLE_LOCATIONS_REQUEST }
}

export function getAvailableLocationsSuccess(data) {
    return { type: GET_AVAILABLE_LOCATIONS_SUCCESS, data }
}


