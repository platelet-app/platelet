export const LOGIN_REQUEST = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';

export function loginUser(data) {
    return { type: LOGIN_REQUEST, data }
}

export function loginUserSuccess(data) {
    return { type: LOGIN_SUCCESS, data }
}

export function logoutUser() {
    return { type: LOGOUT }
}
