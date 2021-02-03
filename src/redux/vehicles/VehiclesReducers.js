import {
    ADD_VEHICLE_SUCCESS,
    GET_VEHICLE_SUCCESS,
    GET_VEHICLES_SUCCESS,
    UPDATE_VEHICLE_SUCCESS,
    RESTORE_VEHICLE_SUCCESS,
    DELETE_VEHICLE_SUCCESS, GET_VEHICLE_FAILURE, GET_VEHICLES_FAILURE
} from "./VehiclesActions";
import _ from "lodash";

const initialState = {
    vehicles: [],
    error: null
}

export function vehicles(state = initialState, action) {
    switch (action.type) {
        case GET_VEHICLES_SUCCESS:
            return {vehicles: action.data, error: null};
        case GET_VEHICLES_FAILURE:
            return {...initialState, error: action.error};
        case ADD_VEHICLE_SUCCESS:
            return {vehicles: {...state.vehicles, [action.data.uuid]: action.data}, error: null}
        case RESTORE_VEHICLE_SUCCESS:
            return {vehicles: {...state.vehicles, [action.data.uuid]: action.data}, error: null}
        case DELETE_VEHICLE_SUCCESS:
            return {vehicles: _.omit(state.vehicles, action.data), error: null}
        default:
            return state
    }
}

const initialVehicleState = {
    vehicle: {
        uuid: null,
        username: null,
        address: null,
        password: null,
        name: null,
        email: null,
        dob: null,
        patch: null,
        roles: null,
        comments: null,
        links: null,
        display_name: null,
        assigned_vehicles: null,
        patch_id: null,
        contact_number: null,
        time_created: null,
        time_modified: null
    }, error: null
}

export function vehicle(state = initialVehicleState, action) {
    switch (action.type) {
        case UPDATE_VEHICLE_SUCCESS:
            // TODO: this should be immutable
            return {vehicle: Object.assign(state, action.data.payload), error: null};
        case GET_VEHICLE_SUCCESS:
            return {vehicle: action.data, error: null};
        case GET_VEHICLE_FAILURE:
            return {...initialVehicleState, error: action.error};
        default:
            return state
    }
}
