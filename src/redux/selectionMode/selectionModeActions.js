export const SELECTION_MODE = "SELECTION_MODE";
export const SELECT_ALL = "SELECT_ALL";
export const UNSELECT_ALL = "UNSELECT_ALL";
export const SELECT_ITEM = "SELECT_ITEM";
export const UNSELECT_ITEM = "UNSELECT_ITEM";
export const CLEAR_ITEMS = "CLEAR_ITEMS";

export function selectAll() {
    return {
        type: SELECT_ALL,
    };
}

export function unSelectAll() {
    return {
        type: UNSELECT_ALL,
    };
}

export function selectItem(item) {
    return {
        type: SELECT_ITEM,
        item,
    };
}

export function unselectItem(itemId) {
    return {
        type: UNSELECT_ITEM,
        itemId,
    };
}

export function clearItems() {
    return {
        type: CLEAR_ITEMS,
    };
}
