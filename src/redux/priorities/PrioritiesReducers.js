import {getAvailablePrioritiesActions} from "./PrioritiesActions";

const initialState = {
    priorities: [],
    error: null
}

export function availablePriorities(state = initialState, action) {
    switch (action.type) {
        case getAvailablePrioritiesActions.success:
            return {priorities: action.data, error: null};
        default:
            return state
    }
}

