import {CLEAR_SERVER_SETTINGS, GET_SERVER_SETTINGS_FAILURE, GET_SERVER_SETTINGS_SUCCESS} from "./ServerSettingsActions";

const initialState = {
    organisation_name: null,
    image_url: null,
    version: null,
    hostname: null,
    favicon: null,
    locale: {code: null, id: null},
    locale_id: null,
    error: null,
}

export function serverSettings(state = initialState, action) {
    switch (action.type) {
        case GET_SERVER_SETTINGS_SUCCESS:
            return {...action.data, error: null};
        case GET_SERVER_SETTINGS_FAILURE:
            return {...initialState, error: action.error};
        case CLEAR_SERVER_SETTINGS:
            return initialState;
        default:
            return state
    }
}
