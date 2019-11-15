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
            console.log("IS UPDATING LOL")
            console.log(action.data)
            let result = state.filter(task => task.uuid === action.data.taskId);
            if (result.length === 1) {
                console.log(result)
                const updated_item = {...result[0], ...action.data.updateData};
                const index = state.indexOf(result[0]);
                const update_result = update(state, {[index]: {$set: updated_item}});
                console.log(update_result)
                return update_result
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
