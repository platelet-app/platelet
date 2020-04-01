import {GET_AVAILABLE_LOCATIONS_SUCCESS} from "./Actions";

export function availableLocations(state = [], action) {
    switch (action.type) {
        case GET_AVAILABLE_LOCATIONS_SUCCESS:
            return action.data;
        default:
            return state
    }
}

