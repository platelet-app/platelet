import {GET_AVAILABLE_LOCATIONS_FAILURE, GET_AVAILABLE_LOCATIONS_SUCCESS} from "./LocationsActions";

const initialState = {
    locations: [],
    error: null
}

export function availableLocations(state = initialState, action) {
    switch (action.type) {
        case GET_AVAILABLE_LOCATIONS_SUCCESS:
            return {locations: action.data, error: null};
        case GET_AVAILABLE_LOCATIONS_FAILURE:
            return {...initialState, error: action.error};
        default:
            return state
    }
}
