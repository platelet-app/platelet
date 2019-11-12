import { combineReducers } from 'redux'
import {
    ADD_TASK
} from './actions'


function tasks(state = [], action) {
    switch (action.type) {
        case ADD_TASK:
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
    tasks
});

export default rootReducer
