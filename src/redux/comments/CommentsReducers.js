import update from "immutability-helper";
import {
    GET_COMMENTS_SUCCESS,
    ADD_COMMENT_SUCCESS,
    UPDATE_COMMENT_SUCCESS,
    CLEAR_COMMENTS,
    ADD_SIDEBAR_COMMENT_SUCCESS,
    GET_SIDEBAR_COMMENTS_SUCCESS,
    CLEAR_SIDEBAR_COMMENTS,
    UPDATE_SIDEBAR_COMMENT_SUCCESS,
    DELETE_COMMENT_SUCCESS,
    RESTORE_COMMENT_SUCCESS,
    DELETE_SIDEBAR_COMMENT_SUCCESS,
    RESTORE_SIDEBAR_COMMENT_SUCCESS
} from "./CommentsActions";

const initialState = {
    comments: [],
    error: null
}

export function comments(state = initialState, action) {
    switch (action.type) {
        case ADD_COMMENT_SUCCESS:
            return {comments: [
                ...state.comments,
                {
                    ...action.data
                }
            ], error: null};
        case UPDATE_COMMENT_SUCCESS:
            let result = state.comments.filter(comment => comment.uuid === action.data.commentUUID);
            if (result.length === 1) {
                const updated_item = {...result[0], ...action.data.payload};
                const index = state.comments.indexOf(result[0]);
                return update(state.comments, {[index]: {$set: updated_item}});
            } else {
                return state
            }
        case DELETE_COMMENT_SUCCESS:
            let result_delete = state.comments.filter(comment => comment.uuid === action.data);
            if (result_delete.length === 1) {
                const index = state.comments.indexOf(result_delete[0]);
                return {comments: update(state.comments, {$splice: [[index, 1]]}), error: null};
            } else {
                return state;
            }
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

export function sidebarComments(state = initialState, action) {
    switch (action.type) {
        case ADD_SIDEBAR_COMMENT_SUCCESS:
            return {comments: [
                    ...state.comments,
                    {
                        ...action.data
                    }
                ], error: null};
        case UPDATE_SIDEBAR_COMMENT_SUCCESS:
            let result = state.comments.filter(comment => comment.uuid === action.data.commentUUID);
            if (result.length === 1) {
                const updated_item = {...result[0], ...action.data.payload};
                const index = state.comments.indexOf(result[0]);
                return update(state.comments, {[index]: {$set: updated_item}});
            } else {
                return state
            }
        case GET_SIDEBAR_COMMENTS_SUCCESS:
            return {comments: action.data, error: null};
        case DELETE_SIDEBAR_COMMENT_SUCCESS:
            let result_delete = state.comments.filter(comment => comment.uuid === action.data);
            if (result_delete.length === 1) {
                const index = state.comments.indexOf(result_delete[0]);
                return {comments: update(state.comments, {$splice: [[index, 1]]}), error: null};
            } else {
                return state;
            }
        case RESTORE_SIDEBAR_COMMENT_SUCCESS:
            return {comments: [
                    {
                        ...action.data
                    },
                    ...state.comments
                ], error: null};
        case CLEAR_SIDEBAR_COMMENTS:
            return initialState;

        default:
            return state
    }
}
