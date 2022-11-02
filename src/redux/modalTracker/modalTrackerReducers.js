import * as actions from "./modalTrackerActions";

export function modalTrackerReducer(state = [], action) {
    switch (action.type) {
        case actions.APPEND_MODAL:
            return [...state, action.modalId];
        case actions.REMOVE_MODAL:
            return state.filter((modalId) => modalId !== action.modalId);
        case actions.CLEAR_MODALS:
            return [];
        default:
            return state;
    }
}
