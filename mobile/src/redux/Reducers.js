import { combineReducers } from "redux";
import { whoami } from "./whoami/whoamiReducers";
import { taskDeliverablesReducer } from "./taskDeliverables/taskDeliverablesReducers";
import { commentsReducer } from "./comments/commentsReducers";
import { SET_DASHBOARD_TAB_INDEX } from "./Actions";
import {
    dashboardFilter,
    dashboardFilterTextboxValue,
} from "./dashboardFilter/DashboardFilterReducers";
import {
    awsHubDataStoreEventsReducer,
    awsHubDataStoreModelsSyncedStatusReducer,
} from "./awsHubListener/awsHubListenerReducers";
import {
    selectionModeReducer,
    selectionModeAvailableItemsReducer,
    selectionActionsPendingReducer,
} from "./selectionMode/selectionModeReducers";

function tenantId(state = null, action) {
    switch (action.type) {
        case "SET_TENANT_ID":
            return action.data;
        default:
            return state;
    }
}

function dashboardTabIndex(state = 0, action) {
    switch (action.type) {
        case SET_DASHBOARD_TAB_INDEX:
            console.log("SET_DASHBOARD_TAB_INDEX", action.data);
            return action.data;
        default:
            return state;
    }
}

function dashboardFilteredUser(state = null, action) {
    switch (action.type) {
        case "SET_DASHBOARD_FILTERED_USER":
            return action.data;
        default:
            return state;
    }
}

export function error(state = null, action) {
    const { error } = action;
    return error || state;
}

const appReducer = combineReducers({
    whoami,
    tenantId,
    error,
    dashboardFilter,
    dashboardTabIndex,
    dashboardFilteredUser,
    dashboardFilterTextboxValue,
    awsHubDataStoreEventsReducer,
    awsHubDataStoreModelsSyncedStatusReducer,
    selectionModeReducer,
    selectionModeAvailableItemsReducer,
    selectionActionsPendingReducer,
    taskDeliverablesReducer,
    commentsReducer,
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;
