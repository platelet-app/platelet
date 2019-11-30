import { combineReducers } from 'redux'
import Control from "../ApiControl"
import update from 'immutability-helper';
import {
    ADD_TASK_SUCCESS,
    GET_TASKS_SUCCESS,
    ADD_SESSION_SUCCESS,
    GET_SESSIONS_SUCCESS,
    UPDATE_TASK_SUCCESS,
    GET_MY_TASKS_SUCCESS,
    ADD_DELIVERABLE_SUCCESS,
    GET_DELIVERABLES_SUCCESS,
    UPDATE_DELIVERABLE_SUCCESS,
    LOGIN,
    LOGIN_SUCCESS
} from './Actions'

const apiUrl = 'http://localhost:5000/api/v0.1/';

function apiControl(state = new Control(apiUrl), action) {
    switch (action.type) {
        case LOGIN:
            return

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

const rootReducer = combineReducers({
    tasks,
    sessions,
    deliverables,
    login
});

export default rootReducer
