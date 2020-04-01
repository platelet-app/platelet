import {GET_AVAILABLE_PRIORITIES_SUCCESS} from "./Actions";

export function availablePriorities(state = [], action) {
    switch (action.type) {
        case GET_AVAILABLE_PRIORITIES_SUCCESS:
            return action.data;
        default:
            return state
    }
}

