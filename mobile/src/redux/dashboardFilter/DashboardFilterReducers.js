import {CLEAR_DASHBOARD_FILTER, SET_DASHBOARD_FILTER} from "./DashboardFilterActions";

export function dashboardFilter(state = "", action) {
    switch (action.type) {
        case SET_DASHBOARD_FILTER:
            return action.data;
        case CLEAR_DASHBOARD_FILTER:
            return "";
        default:
            return state;
    }
}
