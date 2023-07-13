export const SELECTION_MODE = "SELECTION_MODE";
export const SELECT_ITEM = "SELECT_ITEM";
export const UNSELECT_ITEM = "UNSELECT_ITEM";
export const SELECT_MULTIPLE_ITEMS = "SELECT_MULTIPLE_ITEMS";
export const UNSELECT_MULTIPLE_ITEMS = "UNSELECT_MULTIPLE_ITEMS";
export const SET_SELECTED_ITEMS = "SET_SELECTED_ITEMS";
export const CLEAR_ITEMS = "CLEAR_ITEMS";
export const SELECT_ALL_ITEMS = "SELECT_ALL_ITEMS";
export const UNSELECT_ALL_ITEMS = "UNSELECT_ALL_ITEMS";

export function selectAllItems() {
    return {
        type: SELECT_ALL_ITEMS,
    };
}

export function unSelectAllItems() {
    return {
        type: UNSELECT_ALL_ITEMS,
    };
}

export function selectItem(item, tabIndex) {
    return {
        type: SELECT_ITEM,
        item,
        tabIndex,
    };
}

export function unselectItem(itemId, tabIndex) {
    return {
        type: UNSELECT_ITEM,
        itemId,
        tabIndex,
    };
}

export function selectMultipleItems(items, tabIndex) {
    return {
        type: SELECT_MULTIPLE_ITEMS,
        items,
        tabIndex,
    };
}

export function unselectMultipleItems(itemIds, tabIndex) {
    return {
        type: UNSELECT_MULTIPLE_ITEMS,
        itemIds,
        tabIndex,
    };
}

export function setSelectedItems(items, tabIndex) {
    return {
        type: SET_SELECTED_ITEMS,
        items,
        tabIndex,
    };
}

export function clearItems(tabIndex) {
    return {
        type: CLEAR_ITEMS,
        tabIndex,
    };
}

export const SET_AVAILABLE_ITEMS = "SET_AVAILABLE_ITEMS";
export const ADD_TO_AVAILABLE_ITEMS = "ADD_TO_AVAILABLE_ITEMS";
export const REMOVE_FROM_AVAILABLE_ITEMS = "REMOVE_FROM_AVAILABLE_ITEMS";
export const APPEND_AVAILABLE_ITEMS = "APPEND_AVAILABLE_ITEMS";
export const FILTER_FROM_AVAILABLE_ITEMS = "FILTER_FROM_AVAILABLE_ITEMS";
export const CLEAR_AVAILABLE_ITEMS = "CLEAR_AVAILABLE_ITEMS";

export function setAvailableItems(availableItems) {
    return {
        type: SET_AVAILABLE_ITEMS,
        availableItems,
    };
}

export function addToAvailableItems(item) {
    return {
        type: ADD_TO_AVAILABLE_ITEMS,
        item,
    };
}

export function removeFromAvailableItems(itemId) {
    return {
        type: REMOVE_FROM_AVAILABLE_ITEMS,
        itemId,
    };
}

export function clearAvailableItems() {
    return {
        type: CLEAR_AVAILABLE_ITEMS,
    };
}

export const SET_SELECTION_ACTIONS_PENDING = "SET_SELECTION_ACTIONS_PENDING";

export function setSelectionActionsPending(pending) {
    return {
        type: SET_SELECTION_ACTIONS_PENDING,
        pending,
    };
}
