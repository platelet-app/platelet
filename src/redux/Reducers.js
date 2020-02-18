import { combineReducers } from 'redux'
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
    GET_ACTIVE_TASK_UUID,
    SET_ACTIVE_TASK_UUID,
    LOGIN_SUCCESS, GET_SESSION_SUCCESS, CLEAR_LOADING
} from './Actions'

const apiUrl = 'http://localhost:5000/api/v0.1/';

function apiControl(state = new Control(apiUrl), action) {
    switch (action.type) {
        case LOGIN:
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
        case UPDATE_TASK_SUCCESS:
            let result = state.filter(task => task.uuid === action.data.taskId);
            if (result.length === 1) {
                const updated_item = {...result[0], ...action.data.updateData};
                const index = state.indexOf(result[0]);
                return update(state, {[index]: {$set: updated_item}});
                }
            else {
                return state
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
                console.log(action.data)
                const updated_item = {...result[0], ...action.data.payload};
                const index = state.indexOf(result[0]);
                return update(state, {[index]: {$set: updated_item}});
            }
            else {
                return state
            }
        case GET_DELIVERABLES_SUCCESS:
            return action.data;

        default:
            return state
}}

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
            let result = state.filter(vehicle => vehicle.uuid === action.data.vehicleId);
            if (result.length === 1) {
                const updated_item = {...result[0], ...action.data.updateData};
                const index = state.indexOf(result[0]);
                return update(state, {[index]: {$set: updated_item}});
            }
            else {
                return state
            }

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

const loadingReducer = (state = {}, action) => {
    if (action.type === CLEAR_LOADING) {
        return {}
    }
    const { type } = action;
    const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type);
    console.log("LOADING REDUCER")
    console.log(type)

    // not a *_REQUEST / *_SUCCESS /  *_FAILURE actions, so we ignore them
    if (!matches) return state;

    const [, requestName, requestState] = matches;
    console.log(requestState)
    return {
        ...state,
        // Store whether a request is happening at the moment or not
        // e.g. will be true when receiving GET_TODOS_REQUEST
        //      and false when receiving GET_TODOS_SUCCESS / GET_TODOS_FAILURE
        [requestName]: requestState === 'REQUEST',
    };
};

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
    sessionActiveTaskUUID,
    loadingReducer,
    apiControl
});

export default rootReducer
