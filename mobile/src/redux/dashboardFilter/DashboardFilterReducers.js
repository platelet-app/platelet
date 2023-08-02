import {
    SET_DASHBOARD_FILTER,
    SET_DASHBOARD_FILTER_TEXTBOX_VALUE,
} from "./DashboardFilterActions";

export function dashboardFilter(state = "", action) {
    switch (action.type) {
        case SET_DASHBOARD_FILTER:
            return action.data;
        default:
            return state;
    }
}

export function dashboardFilterTextboxValue(state = "", action) {
    switch (action.type) {
        case SET_DASHBOARD_FILTER_TEXTBOX_VALUE:
            return action.data;
        default:
            return state;
    }
}
