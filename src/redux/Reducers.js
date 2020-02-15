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
    ADD_VEHICLE_SUCCESS,
    UPDATE_VEHICLE_SUCCESS,
    GET_VEHICLES_SUCCESS,
    GET_VEHICLE_SUCCESS,
    LOGIN,
    LOGIN_SUCCESS
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
    console.log("TASK")
    console.log(action.type)
    switch (action.type) {
        case GET_TASK_SUCCESS:
            return action.data;

        default:
            return state
    }
}
function tasks(state = [], action) {
    console.log("TASKS")
    console.log(action.type)
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
    console.log("DELIVERABLES")
    console.log(action.type)
    switch (action.type) {
        case ADD_DELIVERABLE_SUCCESS:
            return [
                ...state,
                {
                    ...action.data
                }
            ];
        case UPDATE_DELIVERABLE_SUCCESS:
            let result = state.filter(deliverable => deliverable.uuid === action.data.deliverableId);
            if (result.length === 1) {
                const updated_item = {...result[0], ...action.data.updateData};
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

function sessions(state = [], action) {
    console.log("SESSIONS")
    console.log(action.type)
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

function vehicles(state = [], action) {
    switch (action.type) {
        case GET_VEHICLES_SUCCESS:
            return action.data;
        default:
            return state
    }
}


    function vehicle(state = [], action) {
    console.log("VEHICLES")
    console.log(action.type)
    switch (action.type) {
        case ADD_VEHICLE_SUCCESS:
            console.log("AAA")
            return [
                ...state,
                {
                    ...action.data
                }
            ];
        case UPDATE_VEHICLE_SUCCESS:
            console.log("bbb")
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
            console.log(action)
            return action.data;

        default:
            return state
    }
}

const rootReducer = combineReducers({
    task,
    tasks,
    sessions,
    deliverables,
    vehicles,
    vehicle,
    apiControl
});

export default rootReducer
