export const GET_SERVER_SETTINGS_SUCCESS = 'GET_SERVER_SETTINGS_SUCCESS';
export const GET_SERVER_SETTINGS_REQUEST = 'GET_SERVER_SETTINGS_REQUEST';

export function getServerSettings() {
    return { type: GET_SERVER_SETTINGS_REQUEST }
}

export function getServerSettingsSuccess(data) {
    return { type: GET_SERVER_SETTINGS_SUCCESS, data }
}

