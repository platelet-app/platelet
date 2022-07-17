import _ from "lodash";
import * as actions from "./selectionModeActions";

export function selectionModeReducer(state = [], action) {
    switch (action.type) {
        case actions.SET_SELECTED_ITEMS:
            return { ...state, [action.tabIndex]: action.items };
        case actions.SELECT_ITEM:
            return {
                ...state,
                [action.tabIndex]: {
                    ...state[action.tabIndex],
                    [action.item.id]: action.item,
                },
            };
        case actions.UNSELECT_ITEM:
            return {
                ...state,
                [action.tabIndex]: _.omit(
                    state[action.tabIndex],
                    action.itemId
                ),
            };
        case actions.SELECT_MULTIPLE_ITEMS:
            return {
                ...state,
                [action.tabIndex]: {
                    ...state[action.tabIndex],
                    ...action.items,
                },
            };
        case actions.UNSELECT_MULTIPLE_ITEMS:
            return {
                ...state,
                [action.tabIndex]: _.omit(
                    state[action.tabIndex],
                    ...action.itemIds
                ),
            };
        case actions.CLEAR_ITEMS:
            return { ...state, [action.tabIndex]: {} };
        default:
            return state;
    }
}

export function selectionModeAvailableItemsReducer(state = {}, action) {
    switch (action.type) {
        case actions.SET_AVAILABLE_ITEMS:
            return action.availableItems;
        case actions.ADD_TO_AVAILABLE_ITEMS:
            return { ...state, [action.item.id]: action.item };
        case actions.REMOVE_FROM_AVAILABLE_ITEMS:
            return _.omit(state, action.itemId);
        case actions.CLEAR_AVAILABLE_ITEMS:
            return [];
        default:
            return state;
    }
}

export function selectionActionsPendingReducer(state = false, action) {
    switch (action.type) {
        case actions.SET_SELECTION_ACTIONS_PENDING:
            return action.pending;
        default:
            return state;
    }
}
