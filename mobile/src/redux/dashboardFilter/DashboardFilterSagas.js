import {
    setDashboardFilter,
    SET_DASHBOARD_FILTER_TEXTBOX_VALUE,
} from "./DashboardFilterActions";
import { debounce, put } from "redux-saga/effects";

function* dashboardFilter(action) {
    yield put(setDashboardFilter(action.data));
}

export function* watchDebounceDashboardFilter() {
    yield debounce(300, SET_DASHBOARD_FILTER_TEXTBOX_VALUE, dashboardFilter);
}
