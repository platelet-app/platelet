export const GET_SERVER_SETTINGS_SUCCESS = 'GET_SERVER_SETTINGS_SUCCESS';
export const GET_SERVER_SETTINGS_REQUEST = 'GET_SERVER_SETTINGS_REQUEST';
export const GET_SERVER_SETTINGS_FAILURE = 'GET_SERVER_SETTINGS_FAILURE';
export const CLEAR_SERVER_SETTINGS = 'CLEAR_SERVER_SETTINGS';

export function getServerSettings() {
    return { type: GET_SERVER_SETTINGS_REQUEST }
}

export function clearServerSettings() {
    return { type: CLEAR_SERVER_SETTINGS }
}

export function getServerSettingsSuccess(data) {
    return { type: GET_SERVER_SETTINGS_SUCCESS, data, error: null}
}

export function getServerSettingsFailure(error) {
    return { type: GET_SERVER_SETTINGS_FAILURE, data: null, error }
}
