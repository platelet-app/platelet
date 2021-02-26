import {getAvailableLocationsActions, getLocationActions} from "./LocationsActions";

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
        contact: {
            name: "",
            telephone_number: "",
            email_address: "",
            mobile_number: "",
            address:
                {
                    "ward": null, "line1": null, "line2": null, "town": null,
                    "county": null, "country": null, "postcode": null,
                    "what3words": null
                }

        }
    },
    address: {},
    links: {},
    time_created: null,
    time_modified: null
}

export function location(state = initialLocationState, action) {
    switch (action.type) {
        case getLocationActions.success:
            return {location: action.data, error: null};
        default:
            return state
    }
}
