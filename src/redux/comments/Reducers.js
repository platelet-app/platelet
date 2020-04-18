import update from "immutability-helper";
import {
    GET_COMMENTS_SUCCESS,
    ADD_COMMENT_SUCCESS,
    UPDATE_COMMENT_SUCCESS, CLEAR_COMMENTS,
} from "./Actions";

export function comments(state = [], action) {
    switch (action.type) {
        case ADD_COMMENT_SUCCESS:
            return [
                ...state,
                {
                    ...action.data
                }
            ];
        case UPDATE_COMMENT_SUCCESS:
            let result = state.filter(comment => comment.uuid === action.data.commentUUID);
            if (result.length === 1) {
                const updated_item = {...result[0], ...action.data.payload};
                const index = state.indexOf(result[0]);
                return update(state, {[index]: {$set: updated_item}});
            } else {
                return state
            }
        case GET_COMMENTS_SUCCESS:
            return action.data;
        case CLEAR_COMMENTS:
            return [];

        default:
            return state
    }
}
