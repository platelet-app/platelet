export const GET_USERS_REQUEST = 'GET_USERS_REQUEST';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const GET_USERS_FAILURE = 'GET_USERS_FAILURE';
export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_NOTFOUND = 'GET_USER_NOTFOUND';
export const GET_USER_FAILURE = 'GET_USER_FAILURE';
export const UPDATE_USER_USERNAME_REQUEST = 'UPDATE_USER_USERNAME_REQUEST';
export const UPDATE_USER_NAME_REQUEST = 'UPDATE_USER_NAME_REQUEST';
export const UPDATE_USER_DISPLAY_NAME_REQUEST = 'UPDATE_USER_DISPLAY_NAME_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
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
