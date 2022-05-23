import * as actions from "./selectionModeActions";

export function selectionModeReducer(state = [], action) {
    switch (action.type) {
        case actions.SELECT_ITEM:
            return [...state, action.item];
        case actions.UNSELECT_ITEM:
            return state.filter((item) => item.id !== action.itemId);
        case actions.CLEAR_ITEMS:
            return [];
        default:
            return state;
    }
}
