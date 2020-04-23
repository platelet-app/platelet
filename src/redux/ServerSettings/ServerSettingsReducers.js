import {GET_SERVER_SETTINGS_SUCCESS} from "./ServerSettingsActions";

export function serverSettings(state = null, action) {
    switch (action.type) {
        case GET_SERVER_SETTINGS_SUCCESS:
            return action.data;
        default:
            return state
    }
}
