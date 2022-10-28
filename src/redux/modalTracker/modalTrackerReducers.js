import * as actions from "./modalTrackerActions";

export function modalTrackerReducer(state = [], action) {
    console.log(action);
    switch (action.type) {
        case actions.APPEND_MODAL:
            console.log("APPEND_MODAL", action);
            return [...state, action.modalId];
        case actions.REMOVE_MODAL:
            console.log("REMOVE_MODAL", action);
            return state.filter((modalId) => modalId !== action.modalId);
        case actions.CLEAR_MODALS:
            return [];
        default:
            return state;
    }
}
