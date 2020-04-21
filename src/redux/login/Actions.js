export const LOGIN_REQUEST = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const SET_API_URL = 'SET_API_URL';
export const REMOVE_API_URL = 'REMOVE_API_URL';

export function loginUser(data) {
    return { type: LOGIN_REQUEST, data }
}

export function loginUserSuccess(data) {
    return { type: LOGIN_SUCCESS, data }
}

export function logoutUser() {
    return { type: LOGOUT }
}

export function setApiURL(data) {
    return { type: SET_API_URL, data }
}

export function removeApiURL() {
    return { type: REMOVE_API_URL }
}
