import { combineReducers } from 'redux'
import {
    ADD_TASK_SUCCESS, ADD_SESSION_SUCCESS, SAVE_SESSIONS_SUCCESS
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
    console.log("SESSIONSfasdjkljfksal")
    console.log(action.type)
    console.log(state)
    switch (action.type) {
        case ADD_SESSION_SUCCESS:
            return [
                {
                    ...action.data
                },
                ...state
            ];
        case SAVE_SESSIONS_SUCCESS:
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
