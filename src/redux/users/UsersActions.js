import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const getUsersPrefix = "GET_USERS";
export const getUsersActions = createRequestActions(getUsersPrefix);
export const {getUsersRequest, getUsersSuccess, getUsersFailure, getUsersForbidden} = createRequestFunctions(getUsersActions);


export const addUserPrefix = "ADD_USER";
export const addUserActions = createRequestActions(addUserPrefix);
export const {addUserSuccess, addUserFailure, addUserForbidden} = createRequestFunctions(addUserActions);

export function addUserRequest(data) {
    return { type: addUserActions.request, data }
}


export const deleteUserPrefix = "DELETE_USER";
export const deleteUserActions = createRequestActions(deleteUserPrefix);
export const {deleteUserSuccess, deleteUserFailure, deleteUserForbidden, deleteUserNotFound} = createRequestFunctions(deleteUserActions);

export function deleteUserRequest(data) {
    return { type: deleteUserActions.request, data }
}


export const restoreUserPrefix = "RESTORE_USER";
export const restoreUserActions = createRequestActions(restoreUserPrefix);
export const {restoreUserSuccess, restoreUserFailure, restoreUserForbidden, restoreUserNotFound} = createRequestFunctions(restoreUserActions);

export function restoreUserRequest(data) {
    return { type: restoreUserActions.request, data }
}


export const getUserPrefix = "GET_USER";
export const getUserActions = createRequestActions(getUserPrefix);
export const {getUserSuccess, getUserFailure, getUserForbidden, getUserNotFound} = createRequestFunctions(getUserActions);

export function getUserRequest(userUUID) {
    return { type: getUserActions.request, data: {userUUID} }
}


export const updateUserPrefix = "UPDATE_USER";
export const updateUserActions = createRequestActions(updateUserPrefix);
export const {updateUserSuccess, updateUserFailure, updateUserForbidden, updateUserNotFound} = createRequestFunctions(updateUserActions);

export function updateUserRequest(data) {
    return { type: updateUserActions.request, data }
}


export const updateUserPasswordPrefix = "UPDATE_USER_PASSWORD";
export const updateUserPasswordActions = createRequestActions(updateUserPasswordPrefix);
export const {updateUserPasswordSuccess, updateUserPasswordFailure, updateUserPasswordForbidden, updateUserPasswordNotFound} = createRequestFunctions(updateUserPasswordActions);

export function updateUserPasswordRequest(data) {
    return { type: updateUserPasswordActions.request, data }
}


export const uploadUserProfilePicturePrefix = "UPLOAD_USER_PROFILE_PICTURE"
export const uploadUserProfilePictureActions = createRequestActions(uploadUserProfilePicturePrefix);
export const {uploadUserProfilePictureSuccess, uploadUserProfilePictureFailure, uploadUserProfilePictureForbidden, uploadUserProfilePictureNotFound} = createRequestFunctions(uploadUserProfilePictureActions);

export function uploadUserProfilePictureRequest(data) {
    return { type: uploadUserProfilePictureActions.request, data }
}


export const CLEAR_FORCE_RESET_PASSWORD_STATUS = 'CLEAR_FORCE_RESET_PASSWORD_STATUS';

export function clearForceResetPasswordStatus() {
    return { type: CLEAR_FORCE_RESET_PASSWORD_STATUS }
}
