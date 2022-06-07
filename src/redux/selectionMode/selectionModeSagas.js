import { put, select, takeLatest } from "redux-saga/effects";
import {
    availableSelectionItemsSelector,
    dashboardTabIndexSelector,
} from "../Selectors";
import * as actions from "./selectionModeActions";

function* selectAllItems() {
    const availableItems = yield select(availableSelectionItemsSelector);
    const tabIndex = yield select(dashboardTabIndexSelector);
    yield put(actions.setSelectedItems(availableItems, tabIndex));
}

export function* watchSelectAllItems() {
    yield takeLatest(actions.SELECT_ALL_ITEMS, selectAllItems);
}

function* filterFromAvailableItems(action) {
    const availableItems = yield select(availableSelectionItemsSelector);
    const filtered = availableItems.filter((item) => {
        return !action.filterItems.map((t) => t.id).includes(item.id);
    });
    console.log(filtered);
    yield put(actions.setAvailableItems(filtered));
}

export function* watchFilterFromAvailableItems() {
    yield takeLatest(
        actions.FILTER_FROM_AVAILABLE_ITEMS,
        filterFromAvailableItems
    );
}
