import {combineReducers} from 'redux'
import {
    GET_ACTIVE_TASK_UUID,
    SET_ACTIVE_TASK_UUID,
    CLEAR_LOADING,
    GET_WHOAMI_SUCCESS,
    SET_VIEW_MODE,
    SET_MOBILE_VIEW,
} from './Actions'
import {task, tasks} from "./tasks/Reducers"
import {session, sessions} from "./sessions/Reducers"
import {availableDeliverables, deliverables} from "./deliverables/Reducers"
import {availableLocations} from "./locations/Reducers"
import {apiControl} from "./login/Reducers";
import {availablePatches} from "./patches/Reducers";
import {availablePriorities} from "./priorities/Reducers";
import {users} from "./users/Reducers";
import {vehicle, vehicles} from "./vehicles/Reducers";


//TODO: Figure out why it doesn't work to get this from localstorage..
function viewMode(state = "kanban", action) {
    switch (action.type) {
        case SET_VIEW_MODE:
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


const rootReducer = combineReducers({
    task,
    tasks,
    sessions,
    session,
    deliverables,
    availableDeliverables,
    availablePriorities,
    availablePatches,
    availableLocations,
    vehicles,
    vehicle,
    users,
    whoami,
    sessionActiveTaskUUID,
    loadingReducer,
    postingReducer,
    apiControl,
    viewMode,
    mobileView
});

export default rootReducer
