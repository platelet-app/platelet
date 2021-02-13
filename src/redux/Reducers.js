import {combineReducers} from 'redux'
import {
    CLEAR_LOADING,
    GET_WHOAMI_SUCCESS,
    SET_VIEW_MODE,
    SET_NEW_TASK_ADDED_VIEW,
    SET_MOBILE_VIEW,
    SET_MENU_INDEX,
    SET_COMMENTS_OBJECT_UUID,
    CLEAR_WHOAMI,
    GET_WHOAMI_FAILURE,
    SET_TASK_CONTEXT_MENU_SNACK,
    CLEAR_TASK_CONTEXT_MENU_SNACK,
    SET_DASHBOARD_FILTER,
    SET_ROLE_VIEW,
    SET_IDLE_STATUS,
    SET_DARK_MODE
} from './Actions'
import {tasks} from "./tasks/TasksReducers"
import {task} from "./activeTask/ActiveTaskReducer"
import {userStatistics} from "./statistics/statisticsReducers";
import {taskAssignees} from "./taskAssignees/TaskAssigneesReducers";
import {availableDeliverables, deliverables} from "./deliverables/DeliverablesReducers"
import {availableLocations, location} from "./locations/LocationsReducers"
import {apiControl, authStatus} from "./login/LoginReducers";
import {availablePatches} from "./patches/PatchesReducers";
import {availablePriorities} from "./priorities/PrioritiesReducers";
import {users, user} from "./users/UsersReducers";
import {vehicle, vehicles} from "./vehicles/VehiclesReducers";
import {comments} from "./comments/CommentsReducers";
import {serverSettings} from "./ServerSettings/ServerSettingsReducers";
import {subscription, commentsSubscription, socketCommentsConnectionStatus, socketConnectionStatus} from "./sockets/SocketReducers";
import {notification} from "./notifications/NotificationsReducers";
import {CLEAR_FORCE_RESET_PASSWORD_STATUS} from "./users/UsersActions";
import {actionsRecord, tasksActionsRecord} from "./actionsRecord/ActionsRecordReducers";
import {LOGOUT} from "./login/LoginActions";
import {getDarkModePreference} from "./redux_utilities";

const darkModeInitialState = getDarkModePreference();

function darkMode(state = darkModeInitialState, action) {
    switch (action.type) {
        case SET_DARK_MODE:
            return action.data;
        default:
            return state;
    }
}

function dashboardFilter(state = "", action) {
    switch (action.type) {
        case SET_DASHBOARD_FILTER:
            return action.data;
        default:
            return state;
    }
}

const taskContextMenuSnackInitialState = {snack: () => {}, uuid: ""}

function taskContextMenuSnack(state = taskContextMenuSnackInitialState, action) {
    switch (action.type) {
        case SET_TASK_CONTEXT_MENU_SNACK:
            return {snack: action.func, uuid: action.uuid};
        case CLEAR_TASK_CONTEXT_MENU_SNACK:
            return taskContextMenuSnackInitialState
        default:
            return state;
    }
}

function viewMode(state = null, action) {
    switch (action.type) {
        case SET_VIEW_MODE:
            return action.data;
        default:
            return state;
    }
}

function roleView(state = "coordinator", action) {
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
            return state
    }
}

function menuIndex(state = 1, action) {
    switch (action.type) {
        case SET_MENU_INDEX:
            return action.data;
        default:
            return state
    }
}

function mobileView(state = false, action) {
    switch (action.type) {
        case SET_MOBILE_VIEW:
            return action.data;
        default:
            return state
    }
}

const whoamiInitialState = {
        user: {
            uuid: null,
            username: null,
            address: null,
            password: null,
            password_reset_on_login: false,
            name: null,
            email: null,
            dob: null,
            patch: null,
            roles: [],
            comments: null,
            links: null,
            display_name: null,
            assigned_vehicles: null,
            patch_id: null,
            contact_number: null,
            time_created: null,
            time_modified: null
        }, error: null
}

function whoami(state = whoamiInitialState, action) {
    switch (action.type) {
        case GET_WHOAMI_SUCCESS:
            return {user: action.data, error: null};
        case GET_WHOAMI_FAILURE:
            return {...whoamiInitialState, error: action.error};
        case CLEAR_WHOAMI:
            return whoamiInitialState;
        case CLEAR_FORCE_RESET_PASSWORD_STATUS:
            return {user: {...state.user, password_reset_on_login: false}, error: null}
        default:
            return state
    }
}

function idleStatus(state = false, action) {
    switch (action.type) {
        case SET_IDLE_STATUS:
            return action.data;
        default:
            return state
    }
}


function commentsObjectUUID(state = null, action) {
    switch (action.type) {
        case SET_COMMENTS_OBJECT_UUID:
            return action.data;
        default:
            return state
    }
}

function loadingReducer(state = {}, action) {
    if (action.type === CLEAR_LOADING) {
        return {};
    }
    const {type} = action;
    const matches = /(.*)_(REQUEST|SUCCESS|FAILURE|NOTFOUND)/.exec(type);

    // not a *_REQUEST / *_SUCCESS /  *_FAILURE actions, so we ignore them
    if (!matches) return state;

    const [, requestName, requestState] = matches;
    return {
        ...state,
        // Store whether a request is happening at the moment or not
        // e.g. will be true when receiving GET_TODOS_REQUEST
        //      and false when receiving GET_TODOS_SUCCESS / GET_TODOS_FAILURE
        [requestName]: requestState === 'REQUEST',
    };
}

function postingReducer(state = {}, action) {
    const {type} = action;
    const matches = /(.*)_(REQUEST|SUCCESS|FAILURE|NOTFOUND)/.exec(type);

    // not a *_REQUEST / *_SUCCESS /  *_FAILURE actions, so we ignore them
    if (!matches) return state;

    const [, requestName, requestState] = matches;
    return {
        ...state,
        // Store whether a request is happening at the moment or not
        // e.g. will be true when receiving GET_TODOS_REQUEST
        //      and false when receiving GET_TODOS_SUCCESS / GET_TODOS_FAILURE
        [requestName]: requestState === 'REQUEST',
    };
}

function notFoundReducer(state = {}, action) {
    const {type} = action;
    const matches = /(.*)_(REQUEST|SUCCESS|NOTFOUND)/.exec(type);

    // not a *_REQUEST / *_SUCCESS /  *_NOTFOUND actions, so we ignore them
    if (!matches) return state;

    const [, requestName, requestState] = matches;
    return {
        ...state,
        [requestName]: requestState === 'NOTFOUND',
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
        [requestName]: requestState === 'FAILURE' || requestState === 'NOTFOUND' ? error : '',
    };
};

export function error(state =  null, action){
    const { error } = action;
    return error || state;
}

const appReducer = combineReducers({
    task,
    tasks,
    taskAssignees,
    deliverables,
    availableDeliverables,
    availablePriorities,
    availablePatches,
    availableLocations,
    location,
    vehicles,
    vehicle,
    users,
    user,
    whoami,
    comments,
    loadingReducer,
    postingReducer,
    notFoundReducer,
    errorReducer,
    error,
    apiControl,
    authStatus,
    viewMode,
    roleView,
    newTaskAddedView,
    mobileView,
    menuIndex,
    commentsObjectUUID,
    serverSettings,
    taskContextMenuSnack,
    subscription,
    commentsSubscription,
    socketConnectionStatus,
    socketCommentsConnectionStatus,
    notification,
    dashboardFilter,
    actionsRecord,
    tasksActionsRecord,
    idleStatus,
    userStatistics,
    darkMode
});

const rootReducer = (state, action) => {
    if (action.type === LOGOUT) {
        const { serverSettings } = state;
        state = { serverSettings }
    }
    return appReducer(state, action)
}

export default rootReducer
