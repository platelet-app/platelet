import {
    ADD_VEHICLE_SUCCESS,
    GET_VEHICLE_SUCCESS,
    GET_VEHICLES_SUCCESS,
    UPDATE_VEHICLE_SUCCESS,
    RESTORE_VEHICLE_SUCCESS,
    DELETE_VEHICLE_SUCCESS, GET_VEHICLE_FAILURE, GET_VEHICLES_FAILURE
} from "./VehiclesActions";
import update from "immutability-helper";

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
            return {
                vehicles: [
                    {
                        ...action.data
                    },
                    ...state.vehicles
                ], error: null
            };
        case RESTORE_VEHICLE_SUCCESS:
            return {
                vehicles: [
                    {
                        ...action.data
                    },
                    ...state.vehicles
                ], error: null
            };
        case DELETE_VEHICLE_SUCCESS:
            let result_delete = state.vehicles.filter(vehicle => vehicle.uuid === action.data);
            if (result_delete.length === 1) {
                const index = state.vehicles.indexOf(result_delete[0]);
                return {vehicles: update(state.vehicles, {$splice: [[index, 1]]}), error: null};
            } else {
                return state;
            }
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
            return {vehicle: Object.assign(state, action.data.payload), error: null};
        case GET_VEHICLE_SUCCESS:
            return {vehicle: action.data, error: null};
        case GET_VEHICLE_FAILURE:
            return {...initialVehicleState, error: action.error};
        default:
            return state
    }
}
