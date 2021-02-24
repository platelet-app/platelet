import {getAvailableLocationsActions} from "./LocationsActions";

const initialState = {
    locations: {},
    error: null
}

export function availableLocations(state = initialState, action) {
    switch (action.type) {
        case getAvailableLocationsActions.success:
            return {locations: action.data, error: null};
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
        case getAvailableLocationsActions.success:
            return {location: action.data, error: null};
        default:
            return state
    }
}
