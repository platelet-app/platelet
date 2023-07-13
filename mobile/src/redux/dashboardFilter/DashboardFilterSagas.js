import {
    DEBOUNCE_DASHBOARD_FILTER,
    setDashboardFilter,
} from "./DashboardFilterActions";
import { debounce, put } from "redux-saga/effects";

function* dashboardFilter(action) {
    yield put(setDashboardFilter(action.data));
}

export function* watchDebounceDashboardFilter() {
    yield debounce(300, DEBOUNCE_DASHBOARD_FILTER, dashboardFilter);
}
