import {CLEAR_SERVER_SETTINGS, getServerSettingsActions} from "./ServerSettingsActions";

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
        case getServerSettingsActions.success:
            return {...action.data, error: null};
        case getServerSettingsActions.failure:
            return {...initialState, error: action.error};
        case CLEAR_SERVER_SETTINGS:
            return initialState;
        default:
            return state
    }
}
