export const SET_DASHBOARD_FILTER = "SET_DASHBOARD_FILTER";
export const SET_DASHBOARD_FILTER_TEXTBOX_VALUE =
    "SET_DASHBOARD_FILTER_TEXTBOX_VALUE";

export function setDashboardFilter(data) {
    return { type: SET_DASHBOARD_FILTER, data };
}
export function setDashboardFilterTextboxValue(data) {
    return { type: SET_DASHBOARD_FILTER_TEXTBOX_VALUE, data };
}
