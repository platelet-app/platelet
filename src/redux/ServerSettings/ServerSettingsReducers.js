import {CLEAR_SERVER_SETTINGS, GET_SERVER_SETTINGS_FAILURE, GET_SERVER_SETTINGS_SUCCESS} from "./ServerSettingsActions";

export function serverSettings(state = null, action) {
    switch (action.type) {
        case GET_SERVER_SETTINGS_SUCCESS:
            return action.data;
        case GET_SERVER_SETTINGS_FAILURE:
            return action.data;
        case CLEAR_SERVER_SETTINGS:
            return null;
        default:
            return state
    }
}
