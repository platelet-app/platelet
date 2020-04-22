export const GET_AVAILABLE_PATCHES_REQUEST = 'GET_AVAILABLE_PATCHES_REQUEST';
export const GET_AVAILABLE_PATCHES_SUCCESS = 'GET_AVAILABLE_PATCHES_SUCCESS';

export function getAvailablePatches() {
    return { type: GET_AVAILABLE_PATCHES_REQUEST }
}

export function getAvailablePatchesSuccess(data) {
    return { type: GET_AVAILABLE_PATCHES_SUCCESS, data }
}


