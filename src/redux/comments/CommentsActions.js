import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const addCommentPrefix = "ADD_COMMENT";
export const addCommentActions = createRequestActions(addCommentPrefix);
export const {addCommentSuccess, addCommentFailure} = createRequestFunctions(addCommentActions);
export const ADD_COMMENT_FROM_SOCKET = "ADD_COMMENT_FROM_SOCKET";

export const deleteCommentPrefix = "DELETE_COMMENT";
export const deleteCommentActions = createRequestActions(deleteCommentPrefix);
export const {deleteCommentSuccess, deleteCommentFailure} = createRequestFunctions(deleteCommentActions);
export const DELETE_COMMENT_FROM_SOCKET = "DELETE_COMMENT_FROM_SOCKET";

export const restoreCommentPrefix = "RESTORE_COMMENT";
export const restoreCommentActions = createRequestActions(restoreCommentPrefix);
export const {restoreCommentSuccess, restoreCommentFailure} = createRequestFunctions(restoreCommentActions);
export const RESTORE_COMMENT_FROM_SOCKET = "RESTORE_COMMENT_FROM_SOCKET";

export const updateCommentPrefix = "UPDATE_COMMENT";
export const updateCommentActions = createRequestActions(updateCommentPrefix);
export const {updateCommentSuccess, updateCommentFailure} = createRequestFunctions(updateCommentActions);
export const UPDATE_COMMENT_FROM_SOCKET = "UPDATE_COMMENT_FROM_SOCKET";

export const getCommentsPrefix = "GET_COMMENTS";
export const getCommentsActions = createRequestActions(getCommentsPrefix);
export const {getCommentsSuccess, getCommentsFailure, getCommentsNotFound, getCommentsForbidden} = createRequestFunctions(getCommentsActions);

export const CLEAR_COMMENTS = "CLEAR_COMMENTS";

export function addCommentRequest(data) {
    return { type: addCommentActions.request, data }
}

export function addCommentFromSocket(data) {
    return { type: ADD_COMMENT_FROM_SOCKET, data }
}

export function restoreCommentRequest(data) {
    return { type: restoreCommentActions.request, data }
}

export function restoreCommentFromSocket(data) {
    return { type: RESTORE_COMMENT_FROM_SOCKET, data }
}

export function updateCommentRequest(data) {
    return { type: updateCommentActions.request, data }
}

export function updateCommentFromSocket(data) {
    return { type: UPDATE_COMMENT_FROM_SOCKET, data }
}

export function deleteCommentRequest(data) {
    return { type: deleteCommentActions.request, data }
}

export function deleteCommentFromSocket(data) {
    return { type: DELETE_COMMENT_FROM_SOCKET, data }
}

export function getCommentsRequest(data) {
    return { type: getCommentsActions.request, data }
}

export function clearComments() {
    return { type: CLEAR_COMMENTS }
}

