import {combineReducers} from 'redux'
import Control from "../ApiControl"
import update from 'immutability-helper';
import {
    GET_TASK_SUCCESS,
    ADD_TASK_SUCCESS,
    GET_TASKS_SUCCESS,
    ADD_SESSION_SUCCESS,
    GET_SESSIONS_SUCCESS,
    UPDATE_TASK_SUCCESS,
    GET_MY_TASKS_SUCCESS,
    ADD_DELIVERABLE_SUCCESS,
    GET_DELIVERABLES_SUCCESS,
    UPDATE_DELIVERABLE_SUCCESS,
    GET_AVAILABLE_DELIVERABLES_SUCCESS,
    GET_AVAILABLE_PRIORITIES_SUCCESS,
    GET_AVAILABLE_LOCATIONS_SUCCESS,
    ADD_VEHICLE_SUCCESS,
    UPDATE_VEHICLE_SUCCESS,
    GET_VEHICLES_SUCCESS,
    GET_VEHICLE_SUCCESS,
    GET_USERS_SUCCESS,
    LOGIN,
    LOGIN_SUCCESS,
    LOGOUT,
    GET_ACTIVE_TASK_UUID,
    SET_ACTIVE_TASK_UUID,
    GET_SESSION_SUCCESS,
    CLEAR_LOADING,
    GET_WHOAMI_SUCCESS, DELETE_TASK_SUCCESS, RESTORE_TASK_SUCCESS
} from './Actions'
import {store} from "react-notifications-component";
import {deleteLogin, saveLogin} from "../utilities";
import { getLogin } from "../utilities";

const apiUrl = 'http://localhost:5000/api/v0.1/';

function apiControl(state = new Control(apiUrl, getLogin()), action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            state.initialiseClasses(action.data.access_token);
            saveLogin(action.data.access_token);
            return state;
        case LOGOUT:
            state.logout();
            deleteLogin();
            return state;
        default:
            return state;
    }
}

function task(state = {}, action) {
    switch (action.type) {
        case GET_TASK_SUCCESS:
            return action.data;

        default:
            return state
    }
}

function tasks(state = [], action) {
    switch (action.type) {
        case ADD_TASK_SUCCESS:
            return [
                ...state,
                {
                    ...action.data
                }
            ];
        case RESTORE_TASK_SUCCESS:
            //TODO: should this check that the task matches the session? it's unlikely a task will be deleted from anything other than it's own session view
            return [
                ...state,
                {
                    ...action.data
                }
            ];
        case UPDATE_TASK_SUCCESS:
            let result = state.filter(task => task.uuid === action.data.taskUUID);
            if (result.length === 1) {
                const updated_item = {...result[0], ...action.data.payload};
                const index = state.indexOf(result[0]);
                return update(state, {[index]: {$set: updated_item}});
            } else {
                return state;
            }

        case DELETE_TASK_SUCCESS:
            let result_delete = state.filter(task => task.uuid === action.data);
            if (result_delete.length === 1) {
                const index = state.indexOf(result_delete[0]);
                return update(state, { $splice: [[index, 1]] });
            } else {
                return state;
            }

        case GET_TASKS_SUCCESS:
            return action.data;

        case GET_MY_TASKS_SUCCESS:
            return action.data;

        default:
            return state
    }
}

function deliverables(state = [], action) {
    switch (action.type) {
        case ADD_DELIVERABLE_SUCCESS:
            return [
                ...state,
                {
                    ...action.data
                }
            ];
        case UPDATE_DELIVERABLE_SUCCESS:
            let result = state.filter(deliverable => deliverable.uuid === action.data.deliverableUUID);
            if (result.length === 1) {
                const updated_item = {...result[0], ...action.data.payload};
                const index = state.indexOf(result[0]);
                return update(state, {[index]: {$set: updated_item}});
            } else {
                return state
            }
        case GET_DELIVERABLES_SUCCESS:
            return action.data;

        default:
            return state
    }
}

function availableDeliverables(state = [], action) {
    switch (action.type) {
        case GET_AVAILABLE_DELIVERABLES_SUCCESS:
            return action.data;
        default:
            return state
    }

}

function availablePriorities(state = [], action) {
    switch (action.type) {
        case GET_AVAILABLE_PRIORITIES_SUCCESS:
            return action.data;
        default:
            return state
    }
}

function availableLocations(state = [], action) {
    switch (action.type) {
        case GET_AVAILABLE_LOCATIONS_SUCCESS:
            return action.data;
        default:
            return state
    }
}

function sessions(state = [], action) {
    switch (action.type) {
        case ADD_SESSION_SUCCESS:
            return [
                {
                    ...action.data
                },
                ...state
            ];
        case GET_SESSIONS_SUCCESS:
            return action.data;
        default:
            return state

    }
}

function session(state = {}, action) {
    switch (action.type) {
        case GET_SESSION_SUCCESS:
            return action.data;
        default:
            return state

    }
}

function vehicles(state = [], action) {
    switch (action.type) {
        case GET_VEHICLES_SUCCESS:
            return action.data;
        default:
            return state
    }
}


function vehicle(state = {}, action) {
    switch (action.type) {
        case ADD_VEHICLE_SUCCESS:
            return [
                ...state,
                {
                    ...action.data
                }
            ];
        case UPDATE_VEHICLE_SUCCESS:
            return Object.assign(state, action.data.payload);

        case GET_VEHICLE_SUCCESS:
            return action.data;

        default:
            return state
    }
}

function users(state = [], action) {
    switch (action.type) {
        case GET_USERS_SUCCESS:
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
    availableLocations,
    vehicles,
    vehicle,
    users,
    whoami,
    sessionActiveTaskUUID,
    loadingReducer,
    postingReducer,
    apiControl
});

export default rootReducer
