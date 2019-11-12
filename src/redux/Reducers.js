import { combineReducers } from 'redux'
import {
    ADD_TASK, ADD_TASK_SUCCESS, ADD_SESSION, ADD_SESSION_SUCCESS
} from './Actions'


function tasks(state = [], action) {
    console.log("TASKS")
    switch (action.type) {
        case ADD_TASK_SUCCESS:
            return [
                ...state,
                {
                    ...action.data
                }
            ];
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
                ...state,
                {
                    ...action.data
                }
            ];
        default:
            return state

    }
}

const rootReducer = combineReducers({
    tasks,
    sessions
});

export default rootReducer
