import {
    GET_COMMENTS_SUCCESS,
    ADD_COMMENT_SUCCESS,
    UPDATE_COMMENT_SUCCESS,
    CLEAR_COMMENTS,
    DELETE_COMMENT_SUCCESS,
    RESTORE_COMMENT_SUCCESS,
    ADD_COMMENT_FROM_SOCKET,
    DELETE_COMMENT_FROM_SOCKET, RESTORE_COMMENT_FROM_SOCKET, UPDATE_COMMENT_FROM_SOCKET
} from "./CommentsActions";
import _ from "lodash"

const initialState = {
    comments: {},
    error: null
}

export function comments(state = initialState, action) {
    switch (action.type) {
        case ADD_COMMENT_FROM_SOCKET:
        case ADD_COMMENT_SUCCESS:
            return {
                comments: {...state.comments, [action.data.uuid]: action.data},
                error: null
            };
        case UPDATE_COMMENT_SUCCESS:
        case UPDATE_COMMENT_FROM_SOCKET:
            let result = state.comments[action.data.commentUUID];
            if (result) {
                const updated_item = {
                    ...result, ...action.data.payload,
                    num_edits: result.num_edits ? result.num_edits + 1 : 1
                };
                return {comments: {...state.comments, [action.data.commentUUID]: updated_item},
                error: null
                };
            } else {
                return state
            }
        case DELETE_COMMENT_FROM_SOCKET:
        case DELETE_COMMENT_SUCCESS:
            const newComments = _.omit(state.comments, action.data)
            return {comments: newComments, error: null}
        case RESTORE_COMMENT_FROM_SOCKET:
        case RESTORE_COMMENT_SUCCESS:
            return {
                comments: {...state.comments, [action.data.uuid]: action.data},
                error: null
            };
        case GET_COMMENTS_SUCCESS:
            return {comments: action.data, error: null};
        case CLEAR_COMMENTS:
            return initialState;
        default:
            return state
    }
}

