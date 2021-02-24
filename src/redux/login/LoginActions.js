import {createRequestFunctions, createRequestActions} from "../reduxActionsFactory";

export const LOGOUT = "LOGOUT";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const SET_API_URL = "SET_API_URL";
export const REMOVE_API_URL = "REMOVE_API_URL";
export const LOGIN_INCORRECT_PASSWORD = "LOGIN_INCORRECT_PASSWORD";
export const LOGIN_AUTHORISED = "LOGIN_AUTHORISED";

export const loginUserPrefix = "LOGIN_USER";
export const loginUserActions = createRequestActions(loginUserPrefix);
export const {loginUserSuccess, loginUserFailure} = createRequestFunctions(loginUserActions);

export function loginRequest(username, password) {
    return { type: loginUserActions.request, username, password }
}

export const refreshUserTokenPrefix = "REFRESH_USER_TOKEN";
export const refreshUserTokenActions = createRequestActions(refreshUserTokenPrefix);
export const {refreshUserTokenSuccess, refreshUserTokenFailure} = createRequestFunctions(refreshUserTokenActions);

export function refreshTokenRequest() {
    return { type: refreshUserTokenActions.request }
}

export function logoutUser() {
    return { type: LOGOUT }
}

export function logoutUserSuccess() {
    return { type: LOGOUT_SUCCESS }
}

export function loginIncorrectPassword() {
    return { type: LOGIN_INCORRECT_PASSWORD }
}

export function setApiURL(data) {
    return { type: SET_API_URL, data }
}

export function removeApiURL() {
    return { type: REMOVE_API_URL }
}

