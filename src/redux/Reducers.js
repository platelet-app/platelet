import {combineReducers} from 'redux'
import {
    GET_ACTIVE_TASK_UUID,
    SET_ACTIVE_TASK_UUID,
    CLEAR_LOADING,
    GET_WHOAMI_SUCCESS,
    SET_VIEW_MODE,
    SET_MOBILE_VIEW,
    SET_MENU_INDEX, GET_COMMENTS_OBJECT_UUID, SET_COMMENTS_OBJECT_UUID
} from './Actions'
import {task, tasks} from "./tasks/Reducers"
import {session, sessions, sessionStatistics} from "./sessions/Reducers"
import {availableDeliverables, deliverables} from "./deliverables/Reducers"
import {availableLocations} from "./locations/Reducers"
import {apiControl} from "./login/Reducers";
import {availablePatches} from "./patches/Reducers";
import {availablePriorities} from "./priorities/Reducers";
import {users, user} from "./users/Reducers";
import {vehicle, vehicles} from "./vehicles/Reducers";
import {comments, sessionComments} from "./comments/Reducers";


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

function whoami(state = {roles: [], name: ""}, action) {
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
export const errorReducer = (state = {}, action) => {
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
        [requestName]: requestState === 'FAILURE' ? error : '',
    };
};

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
    errorReducer,
    apiControl,
    viewMode,
    mobileView,
    menuIndex,
    commentsObjectUUID
});

export default rootReducer
