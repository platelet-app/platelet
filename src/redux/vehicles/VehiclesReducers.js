import _ from "lodash";
import {
    addVehicleActions,
    deleteVehicleActions,
    getVehicleActions,
    getVehiclesActions,
    restoreVehicleActions, updateVehicleActions
} from "./VehiclesActions";

const initialState = {
    vehicles: [],
    error: null
}

export function vehicles(state = initialState, action) {
    switch (action.type) {
        case getVehiclesActions.success:
            return {vehicles: action.data, error: null};
        case getVehiclesActions.failure:
            return {...initialState, error: action.error};
        case addVehicleActions.success:
            return {vehicles: {...state.vehicles, [action.data.uuid]: action.data}, error: null}
        case restoreVehicleActions.success:
            return {vehicles: {...state.vehicles, [action.data.uuid]: action.data}, error: null}
        case deleteVehicleActions.success:
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
        case updateVehicleActions.success:
            // TODO: this should be immutable
            return {vehicle: {...state, ...action.data.payload}, error: null}
        case getVehicleActions.success:
            return {vehicle: action.data, error: null};
        case getVehicleActions.failure:
            return {...initialVehicleState, error: action.error};
        default:
            return state
    }
}
