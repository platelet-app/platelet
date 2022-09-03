import { combineReducers } from "redux";
import { whoami } from "./whoami/whoamiReducers";
import {
    CLEAR_LOADING,
    SET_VIEW_MODE,
    SET_NEW_TASK_ADDED_VIEW,
    SET_MOBILE_VIEW,
    SET_MENU_INDEX,
    SET_COMMENTS_OBJECT_UUID,
    SET_ROLE_VIEW,
    SET_IDLE_STATUS,
} from "./Actions";
import { dashboardFilter } from "./dashboardFilter/DashboardFilterReducers";
import { notification } from "./notifications/NotificationsReducers";
import {
    awsHubDataStoreEventsReducer,
    awsHubDataStoreModelsSyncedStatusReducer,
} from "./awsHubListener/awsHubListenerReducers";
import { taskAssigneesReducer } from "./taskAssignees/taskAssigneesReducers";
import {
    selectionModeReducer,
    selectionModeAvailableItemsReducer,
    selectionActionsPendingReducer,
} from "./selectionMode/selectionModeReducers";

function viewMode(state = null, action) {
    switch (action.type) {
        case SET_VIEW_MODE:
            return action.data;
        default:
            return state;
    }
}

function tenantId(state = null, action) {
    switch (action.type) {
        case "SET_TENANT_ID":
            return action.data;
        default:
            return state;
    }
}

function roleView(state = null, action) {
    switch (action.type) {
        case SET_ROLE_VIEW:
            return action.data;
        default:
            return state;
    }
}

function newTaskAddedView(state = false, action) {
    switch (action.type) {
        case SET_NEW_TASK_ADDED_VIEW:
            return action.data;
        default:
            return state;
    }
}

function menuIndex(state = "dashboard", action) {
    switch (action.type) {
        case SET_MENU_INDEX:
            return action.data;
        default:
            return state;
    }
}

function mobileView(state = false, action) {
    switch (action.type) {
        case SET_MOBILE_VIEW:
            return action.data;
        default:
            return state;
    }
}

function guidedSetupOpen(state = false, action) {
    switch (action.type) {
        case "SET_GUIDED_SETUP_OPEN":
            return action.data;
        default:
            return state;
    }
}

function dashboardTabIndex(state = 0, action) {
    switch (action.type) {
        case "SET_DASHBOARD_TAB_INDEX":
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

function idleStatus(state = false, action) {
    switch (action.type) {
        case SET_IDLE_STATUS:
            return action.data;
        default:
            return state;
    }
}

function commentsObjectUUID(state = null, action) {
    switch (action.type) {
        case SET_COMMENTS_OBJECT_UUID:
            return action.data;
        default:
            return state;
    }
}

function loadingReducer(state = {}, action) {
    if (action.type === CLEAR_LOADING) {
        return {};
    }
    const { type } = action;
    const matches = /(.*)_(REQUEST|SUCCESS|FAILURE|NOT_FOUND)/.exec(type);

    // not a *_REQUEST / *_SUCCESS /  *_FAILURE actions, so we ignore them
    if (!matches) return state;

    const [, requestName, requestState] = matches;
    return {
        ...state,
        // Store whether a request is happening at the moment or not
        // e.g. will be true when receiving GET_TODOS_REQUEST
        //      and false when receiving GET_TODOS_SUCCESS / GET_TODOS_FAILURE
        [requestName]: requestState === "REQUEST",
    };
}

function postingReducer(state = {}, action) {
    const { type } = action;
    const matches = /(.*)_(REQUEST|SUCCESS|FAILURE|NOT_FOUND)/.exec(type);

    // not a *_REQUEST / *_SUCCESS /  *_FAILURE actions, so we ignore them
    if (!matches) return state;

    const [, requestName, requestState] = matches;
    return {
        ...state,
        // Store whether a request is happening at the moment or not
        // e.g. will be true when receiving GET_TODOS_REQUEST
        //      and false when receiving GET_TODOS_SUCCESS / GET_TODOS_FAILURE
        [requestName]: requestState === "REQUEST",
    };
}

function deletingReducer(state = {}, action) {
    const { type } = action;
    const matches = /(.*)_(REQUEST|SUCCESS|FAILURE|NOT_FOUND)/.exec(type);

    // not a *_REQUEST / *_SUCCESS /  *_FAILURE actions, so we ignore them
    if (!matches) return state;

    const [, requestName, requestState] = matches;
    return {
        ...state,
        // Store whether a request is happening at the moment or not
        // e.g. will be true when receiving GET_TODOS_REQUEST
        //      and false when receiving GET_TODOS_SUCCESS / GET_TODOS_FAILURE
        [requestName]: requestState === "REQUEST",
    };
}

function notFoundReducer(state = {}, action) {
    const { type } = action;
    const matches = /(.*)_(REQUEST|SUCCESS|NOT_FOUND)/.exec(type);

    // not a *_REQUEST / *_SUCCESS /  *_NOT_FOUND actions, so we ignore them
    if (!matches) return state;

    const [, requestName, requestState] = matches;
    return {
        ...state,
        [requestName]: requestState === "NOT_FOUND",
    };
}

const errorReducer = (state = {}, action) => {
    const { type, error } = action;
    const matches = /(.*)_(REQUEST|FAILURE)/.exec(type);

    // not a *_REQUEST / *_FAILURE actions, so we ignore them
    if (!matches) return state;

    const [, requestName, requestState] = matches;
    return {
        ...state,
        // Store errorMessage
        // e.g. stores errorMessage when receiving GET_TODOS_FAILURE
        //      else clear errorMessage when receiving GET_TODOS_REQUEST
        [requestName]:
            requestState === "FAILURE" || requestState === "NOT_FOUND"
                ? error
                : "",
    };
};

export function error(state = null, action) {
    const { error } = action;
    return error || state;
}

const appReducer = combineReducers({
    whoami,
    tenantId,
    loadingReducer,
    postingReducer,
    deletingReducer,
    notFoundReducer,
    errorReducer,
    error,
    viewMode,
    guidedSetupOpen,
    roleView,
    newTaskAddedView,
    mobileView,
    menuIndex,
    commentsObjectUUID,
    notification,
    dashboardFilter,
    idleStatus,
    dashboardTabIndex,
    dashboardFilteredUser,
    awsHubDataStoreEventsReducer,
    awsHubDataStoreModelsSyncedStatusReducer,
    taskAssigneesReducer,
    selectionModeReducer,
    selectionModeAvailableItemsReducer,
    selectionActionsPendingReducer,
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;
