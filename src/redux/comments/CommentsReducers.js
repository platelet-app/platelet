import update from "immutability-helper";
import {
    GET_COMMENTS_SUCCESS,
    ADD_COMMENT_SUCCESS,
    UPDATE_COMMENT_SUCCESS,
    CLEAR_COMMENTS,
    DELETE_COMMENT_SUCCESS,
    RESTORE_COMMENT_SUCCESS,
    ADD_COMMENT_FROM_SOCKET,
    DELETE_COMMENT_FROM_SOCKET, RESTORE_COMMENT_FROM_SOCKET
} from "./CommentsActions";

const initialState = {
    comments: [],
    error: null
}

export function comments(state = initialState, action) {
    switch (action.type) {
        case ADD_COMMENT_FROM_SOCKET:
        case ADD_COMMENT_SUCCESS:
            return {comments: [
                ...state.comments,
                {
                    ...action.data
                }
            ], error: null};
        case UPDATE_COMMENT_SUCCESS:
            let result = state.comments.find(comment => comment.uuid === action.data.commentUUID);
            if (result) {
                const updated_item = {...result, ...action.data.payload};
                const index = state.comments.indexOf(result);
                return update(state.comments, {[index]: {$set: updated_item}});
            } else {
                return state
            }
        case DELETE_COMMENT_FROM_SOCKET:
        case DELETE_COMMENT_SUCCESS:
            const newComments = state.comments.filter(comment => comment.uuid !== action.data)
            return {comments: newComments, error: null}
        case RESTORE_COMMENT_FROM_SOCKET:
        case RESTORE_COMMENT_SUCCESS:
            return {comments: [
                    {
                        ...action.data
                    },
                    ...state.comments
                ], error: null};
        case GET_COMMENTS_SUCCESS:
            return {comments: action.data, error: null};
        case CLEAR_COMMENTS:
            return initialState;

        default:
            return state
    }
}

