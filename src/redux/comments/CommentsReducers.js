import {
    addCommentActions,
    CLEAR_COMMENTS,
    ADD_COMMENT_FROM_SOCKET,
    DELETE_COMMENT_FROM_SOCKET,
    RESTORE_COMMENT_FROM_SOCKET,
    UPDATE_COMMENT_FROM_SOCKET,
    updateCommentActions,
    deleteCommentActions, restoreCommentActions, getCommentsActions
} from "./CommentsActions";
import _ from "lodash"

const initialState = {
    comments: {},
    error: null
}

export function comments(state = initialState, action) {
    switch (action.type) {
        case ADD_COMMENT_FROM_SOCKET:
        case addCommentActions.success:
            return {
                comments: {...state.comments, [action.data.uuid]: action.data},
                error: null
            };
        case updateCommentActions.success:
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
        case deleteCommentActions.success:
        case DELETE_COMMENT_FROM_SOCKET:
            const newComments = _.omit(state.comments, action.data)
            return {comments: newComments, error: null}
        case restoreCommentActions.success:
        case RESTORE_COMMENT_FROM_SOCKET:
            return {
                comments: {...state.comments, [action.data.uuid]: action.data},
                error: null
            };
        case getCommentsActions.success:
            return {comments: action.data, error: null};
        case CLEAR_COMMENTS:
            return initialState;
        default:
            return state
    }
}

