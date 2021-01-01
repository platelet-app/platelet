import Control from "../../ApiControl"
import {
    LOGIN_INCORRECT_PASSWORD,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS, REFRESH_TOKEN_SUCCESS
} from './LoginActions'
import {getApiURL, getLogin} from "../../utilities";

const initialState = new Control(getApiURL(), getLogin())

export function apiControl(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
        case REFRESH_TOKEN_SUCCESS:
            return new Control(getApiURL(), action.token)
        case LOGOUT_SUCCESS:
            return new Control(getApiURL())
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
