export const GET_USERS_REQUEST = 'GET_USERS_REQUEST';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const GET_USERS_FAILURE = 'GET_USERS_FAILURE';
export const ADD_USER_REQUEST = 'ADD_USER_REQUEST';
export const ADD_USER_SUCCESS = 'ADD_USER_SUCCESS';
export const ADD_USER_FAILURE = 'ADD_USER_FAILURE';
export const DELETE_USER_REQUEST = 'DELETE_USER_REQUEST';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';
export const RESTORE_USER_REQUEST = 'RESTORE_USER_REQUEST';
export const RESTORE_USER_SUCCESS = 'RESTORE_USER_SUCCESS';
export const RESTORE_USER_FAILURE = 'RESTORE_USER_FAILURE';
export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_NOTFOUND = 'GET_USER_NOTFOUND';
export const GET_USER_FAILURE = 'GET_USER_FAILURE';
export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_NOTFOUND = 'UPDATE_USER_NOTFOUND';
export const UPDATE_USER_USERNAME_REQUEST = 'UPDATE_USER_USERNAME_REQUEST';
export const UPDATE_USER_NAME_REQUEST = 'UPDATE_USER_NAME_REQUEST';
export const UPDATE_USER_DISPLAY_NAME_REQUEST = 'UPDATE_USER_DISPLAY_NAME_REQUEST';
export const UPDATE_USER_EMAIL_ADDRESS_REQUEST = 'UPDATE_USER_EMAIL_ADDRESS_REQUEST';
export const UPDATE_USER_CONTACT_NUMBER_REQUEST = 'UPDATE_USER_CONTACT_NUMBER_REQUEST';
export const UPDATE_USER_ADDRESS_REQUEST = 'UPDATE_USER_ADDRESS_REQUEST';
export const UPDATE_USER_ROLES_REQUEST = 'UPDATE_USER_ROLES_REQUEST';
export const UPDATE_USER_PATCH_REQUEST = 'UPDATE_USER_PATCH_REQUEST';
export const UPDATE_USER_PASSWORD_REQUEST = 'UPDATE_USER_PASSWORD_REQUEST';

export function getUsers() {
    return { type: GET_USERS_REQUEST }
}

export function getUsersSuccess(data) {
    return { type: GET_USERS_SUCCESS, data }
}

export function getUser(data) {
    return { type: GET_USER_REQUEST, data }
}

export function getUserSuccess(data) {
    return { type: GET_USER_SUCCESS, data }
}

export function deleteUser(data) {
    return { type: DELETE_USER_REQUEST, data }
}

export function deleteUserSuccess(data) {
    return { type: DELETE_USER_SUCCESS, data }
}

export function addUser(data) {
    return { type: ADD_USER_REQUEST, data }
}

export function restoreUser(data) {
    return { type: RESTORE_USER_REQUEST, data }
}

export function restoreUserSuccess(data) {
    return { type: RESTORE_USER_SUCCESS, data }
}

export function addUserSuccess(data) {
    return { type: ADD_USER_SUCCESS, data }
}

export function updateUserSuccess(data) {
    return { type: UPDATE_USER_SUCCESS, data }
}
export function updateUserName(data) {
    return { type: UPDATE_USER_NAME_REQUEST, data }
}
export function updateUserUsername(data) {
    return { type: UPDATE_USER_USERNAME_REQUEST, data }
}
export function updateUserDisplayName(data) {
    return { type: UPDATE_USER_DISPLAY_NAME_REQUEST, data }
}
export function updateUserEmailAddress(data) {
    return { type: UPDATE_USER_EMAIL_ADDRESS_REQUEST, data }
}
export function updateUserContactNumber(data) {
    return { type: UPDATE_USER_CONTACT_NUMBER_REQUEST, data }
}
export function updateUserAddress(data) {
    return { type: UPDATE_USER_ADDRESS_REQUEST, data }
}
export function updateUserRoles(data) {
    return { type: UPDATE_USER_ROLES_REQUEST, data }
}
export function updateUserPatch(data) {
    return { type: UPDATE_USER_PATCH_REQUEST, data }
}
export function updateUserPassword(data) {
    return { type: UPDATE_USER_PASSWORD_REQUEST, data }
}
