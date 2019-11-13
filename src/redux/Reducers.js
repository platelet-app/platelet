import { combineReducers } from 'redux'
import update from 'immutability-helper';
import {
    ADD_TASK_SUCCESS, GET_TASKS_SUCCESS, ADD_SESSION_SUCCESS, GET_SESSIONS_SUCCESS, UPDATE_TASK_SUCCESS
} from './Actions'


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
            let result = state.filter(task => task.uuid === action.data.task_id);
            if (result.length === 1) {
                const updated_item = {...result[0], ...action.data};
                const index = tasks.indexOf(result[0]);
                return update(tasks, {[index]: {$set: updated_item}});
                }
            else {
                return state
            }

        case GET_TASKS_SUCCESS:
            return action.data;
        default:
            return state
    }
}

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
    sessions
});

export default rootReducer
