import {GET_AVAILABLE_PRIORITIES_SUCCESS} from "./PrioritiesActions";

const initialState = {
    priorities: [],
    error: null
}

export function availablePriorities(state = initialState, action) {
    switch (action.type) {
        case GET_AVAILABLE_PRIORITIES_SUCCESS:
            return {priorities: action.data, error: null};
        default:
            return state
    }
}

