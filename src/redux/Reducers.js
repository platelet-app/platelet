import {combineReducers} from 'redux'
import {
    GET_ACTIVE_TASK_UUID,
    SET_ACTIVE_TASK_UUID,
    CLEAR_LOADING,
    GET_WHOAMI_SUCCESS,
    SET_VIEW_MODE,
    SET_MOBILE_VIEW,
    SET_MENU_INDEX, SET_COMMENTS_OBJECT_UUID
} from './Actions'
import {task, tasks} from "./tasks/TasksReducers"
import {session, sessions, sessionStatistics} from "./sessions/SessionsReducers"
import {availableDeliverables, deliverables} from "./deliverables/DeliverablesReducers"
import {availableLocations} from "./locations/LocationsReducers"
import {apiControl, authStatus} from "./login/LoginReducers";
import {availablePatches} from "./patches/PatchesReducers";
import {availablePriorities} from "./priorities/PrioritiesReducers";
import {users, user} from "./users/UsersReducers";
import {vehicle, vehicles} from "./vehicles/VehiclesReducers";
import {comments, sessionComments} from "./comments/CommentsReducers";
import {serverSettings} from "./ServerSettings/ServerSettingsReducers";


function viewMode(state = null, action) {
    switch (action.type) {
        case SET_VIEW_MODE:
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

function whoami(state = {roles: "", name: ""}, action) {
    switch (action.type) {
        case GET_WHOAMI_SUCCESS:
            return action.data;
        default:
            return state
    }
}

function sessionActiveTaskUUID(state = "", action) {
    switch (action.type) {
        case GET_ACTIVE_TASK_UUID:
            return state;
        case SET_ACTIVE_TASK_UUID:
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
    const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type);

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
    console.log(type)

    // not a *_REQUEST / *_SUCCESS /  *_FAILURE actions, so we ignore them
    if (!matches) return state;

    const [, requestName, requestState] = matches;
    return {
        ...state,
        // Store whether a request is happening at the moment or not
        // e.g. will be true when receiving GET_TODOS_REQUEST
        //      and false when receiving GET_TODOS_SUCCESS / GET_TODOS_FAILURE
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
    console.log(error)
    return error ? error : state;
}

const rootReducer = combineReducers({
    task,
    tasks,
    sessions,
    session,
    sessionStatistics,
    deliverables,
    availableDeliverables,
    availablePriorities,
    availablePatches,
    availableLocations,
    vehicles,
    vehicle,
    users,
    user,
    whoami,
    comments,
    sessionComments,
    sessionActiveTaskUUID,
    loadingReducer,
    postingReducer,
    notFoundReducer,
    errorReducer,
    error,
    apiControl,
    authStatus,
    viewMode,
    mobileView,
    menuIndex,
    commentsObjectUUID,
    serverSettings,
});

export default rootReducer
