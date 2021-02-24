import Control from "../../ApiControl"
import {
    LOGIN_INCORRECT_PASSWORD,
    loginUserActions,
    LOGOUT_SUCCESS,
    refreshUserTokenActions
} from './LoginActions'
import {getApiURL, getLogin} from "../../utilities";

const initialState = new Control(getApiURL(), getLogin())

export function apiControl(state = initialState, action) {
    switch (action.type) {
        case loginUserActions.success:
        case refreshUserTokenActions.success:
            return new Control(getApiURL(), action.data)
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
