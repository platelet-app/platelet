export const SET_DASHBOARD_FILTER = "SET_DASHBOARD_FILTER";
export const CLEAR_DASHBOARD_FILTER = "CLEAR_DASHBOARD_FILTER";
export const DEBOUNCE_DASHBOARD_FILTER = "DEBOUNCE_DASHBOARD_FILTER";

export function setDashboardFilter(data) {
    return { type: SET_DASHBOARD_FILTER, data }
}
export function clearDashboardFilter() {
    return { type: CLEAR_DASHBOARD_FILTER }
}
export function debounceDashboardFilter(data) {
    return { type: DEBOUNCE_DASHBOARD_FILTER, data }
}
