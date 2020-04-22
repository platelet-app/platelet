import Control from "../../ApiControl"
import {
    LOGIN_INCORRECT_PASSWORD,
    LOGIN_SUCCESS,
    LOGOUT, REMOVE_API_URL, SET_API_URL, LOGIN_AUTHORISED
} from './LoginActions'
import {deleteLogin, getApiURL, saveApiURL, getLogin, saveLogin, deleteApiURL} from "../../utilities";

export function apiControl(state = new Control(getApiURL(), getLogin()), action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            state.initialiseClasses(action.data.access_token);
            saveLogin(action.data.access_token);
            return state;
        case LOGOUT:
            state.logout();
            deleteLogin();
            return state;
        case SET_API_URL:
            state.setApiURL(action.data);
            saveApiURL(action.data);
            return state;
        case REMOVE_API_URL:
            state.deleteApiURL();
            deleteLogin();
            deleteApiURL();
            return state;

        default:
            return state;
    }
}

export function authStatus(state = 0, action) {
    switch (action.type) {
        case LOGIN_INCORRECT_PASSWORD:
            return 401;
        default:
            return 0
    }
}
