import Control from "../../ApiControl"
import {
    LOGIN_SUCCESS,
    LOGOUT,
} from './Actions'
import {deleteLogin, getLogin, saveLogin} from "../../utilities";

const apiUrl = 'http://localhost:5000/api/v0.1/';

export function apiControl(state = new Control(apiUrl, getLogin()), action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            state.initialiseClasses(action.data.access_token);
            saveLogin(action.data.access_token);
            return state;
        case LOGOUT:
            state.logout();
            deleteLogin();
            return state;
        default:
            return state;
    }
}
