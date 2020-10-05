import {GET_VEHICLE_NOTFOUND} from "../vehicles/VehiclesActions";

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
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';
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
export const UPDATE_USER_PASSWORD_SUCCESS = 'UPDATE_USER_PASSWORD_SUCCESS';
export const UPDATE_USER_PASSWORD_FAILURE = 'UPDATE_USER_PASSWORD_FAILURE';
export const UPLOAD_USER_PROFILE_PICTURE_REQUEST = 'UPLOAD_USER_PROFILE_PICTURE_REQUEST'
export const UPLOAD_USER_PROFILE_PICTURE_FAILURE = 'UPLOAD_USER_PROFILE_PICTURE_FAILURE'
export const UPLOAD_USER_PROFILE_PICTURE_SUCCESS = 'UPLOAD_USER_PROFILE_PICTURE_SUCCESS'

export const CLEAR_FORCE_RESET_PASSWORD_STATUS = 'CLEAR_FORCE_RESET_PASSWORD_STATUS';

export function getUsersRequest() {
    return { type: GET_USERS_REQUEST }
}

export function getUsersSuccess(data) {
    return { type: GET_USERS_SUCCESS, data }
}

export function getUsersFailure(error) {
    return { type: GET_USERS_FAILURE, error }
}

export function getUserRequest(data) {
    return { type: GET_USER_REQUEST, data }
}

export function getUserSuccess(data) {
    return { type: GET_USER_SUCCESS, data }
}

export function getUserFailure(error) {
    return { type: GET_USER_FAILURE, error }
}
export function getUserNotFound() {
    return { type: GET_USER_NOTFOUND }
}

export function deleteUserRequest(data) {
    return { type: DELETE_USER_REQUEST, data }
}

export function deleteUserSuccess(data) {
    return { type: DELETE_USER_SUCCESS, data }
}

export function deleteUserFailure(error) {
    return { type: DELETE_USER_FAILURE, error }
}

export function addUserRequest(data) {
    return { type: ADD_USER_REQUEST, data }
}

export function addUserSuccess(data) {
    return { type: ADD_USER_SUCCESS, data }
}

export function addUserFailure(error) {
    return { type: ADD_USER_FAILURE, error }
}

export function restoreUserRequest(data) {
    return { type: RESTORE_USER_REQUEST, data }
}

export function restoreUserSuccess(data) {
    return { type: RESTORE_USER_SUCCESS, data }
}

export function restoreUserFailure(error) {
    return { type: RESTORE_USER_FAILURE, error }
}

export function updateUserRequest(data) {
    return { type: UPDATE_USER_REQUEST, data }
}

export function updateUserSuccess(data) {
    return { type: UPDATE_USER_SUCCESS, data }
}

export function updateUserFailure(error) {
    return { type: UPDATE_USER_FAILURE, error }
}

export function updateUserPasswordRequest(data) {
    return { type: UPDATE_USER_PASSWORD_REQUEST, data }
}

export function updateUserPasswordSuccess(data) {
    return { type: UPDATE_USER_PASSWORD_SUCCESS, data }
}

export function updateUserPasswordFailure(error) {
    return { type: UPDATE_USER_PASSWORD_FAILURE, error }
}

export function uploadUserProfilePictureRequest(data) {
    return { type: UPLOAD_USER_PROFILE_PICTURE_REQUEST, data }
}

export function uploadUserProfilePictureSuccess(data) {
    return { type: UPLOAD_USER_PROFILE_PICTURE_SUCCESS, data }
}

export function uploadUserProfilePictureFailure(error) {
    return { type: UPLOAD_USER_PROFILE_PICTURE_FAILURE, error }
}

export function clearForceResetPasswordStatus() {
    return { type: CLEAR_FORCE_RESET_PASSWORD_STATUS }
}
