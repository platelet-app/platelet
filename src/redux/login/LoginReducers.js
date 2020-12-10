import Control from "../../ApiControl"
import {
    LOGIN_INCORRECT_PASSWORD,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS, REMOVE_API_URL, SET_API_URL
} from './LoginActions'
import {getApiURL, getLogin} from "../../utilities";

const initialState = new Control(getApiURL(), getLogin())

export function apiControl(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return new Control(getApiURL(), action.token)
        case LOGOUT_SUCCESS:
            return new Control(getApiURL())
        case SET_API_URL:
            return new Control(action.data, getLogin())
        case REMOVE_API_URL:
            return new Control(getApiURL(), getLogin())
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
