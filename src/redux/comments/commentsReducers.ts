import * as actions from "./commentsActions";

const initialState = { items: [], isSynced: false, ready: false };

export function commentsReducer(
    state = initialState,
    action: actions.CommentsActionType
) {
    switch (action.type) {
        case actions.SET_COMMENTS:
            return action.comments;
        default:
            return state;
    }
}
