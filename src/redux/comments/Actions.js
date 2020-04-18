export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const UPDATE_COMMENT_REQUEST = 'UPDATE_COMMENT_REQUEST';
export const UPDATE_COMMENT_SUCCESS = 'UPDATE_COMMENT_SUCCESS';
export const GET_COMMENTS_REQUEST = 'GET_COMMENTS_REQUEST';
export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS';
export const CLEAR_COMMENTS = 'CLEAR_COMMENTS';

export function addComment(data) {
    console.log(data)
    return { type: ADD_COMMENT_REQUEST, data }
}

export function addCommentSuccess(data) {
    return { type: ADD_COMMENT_SUCCESS, data }
}

export function clearComments() {
    return { type: CLEAR_COMMENTS }
}

export function getComments(data) {
    return { type: GET_COMMENTS_REQUEST, data }
}

export function getCommentsSuccess(data) {
    return { type: GET_COMMENTS_SUCCESS, data }
}

export function updateComment(data) {
    return { type: UPDATE_COMMENT_REQUEST, data }
}

export function updateCommentSuccess(data) {
    return { type: UPDATE_COMMENT_SUCCESS, data }
}
