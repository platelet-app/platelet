import {
    GET_AVAILABLE_LOCATIONS_FAILURE,
    GET_AVAILABLE_LOCATIONS_SUCCESS, GET_LOCATION_FAILURE, GET_LOCATION_NOTFOUND,
    GET_LOCATION_SUCCESS
} from "./LocationsActions";

const initialState = {
    locations: {},
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

const initialLocationState = {
    location: {
        uuid: "",
        name: "",
        contact_name: "",
        contact_number: "",
        address: {},
        links: {},
        time_created: null,
        time_modified: null
    }

}

export function location(state = initialLocationState, action) {
    switch (action.type) {
        case GET_LOCATION_SUCCESS:
            return {location: action.data, error: null};
        case GET_LOCATION_FAILURE:
        case GET_LOCATION_NOTFOUND:
            return {initialLocationState, error: action.error};
        default:
            return state
    }
}
