import {
    ADD_VEHICLE_SUCCESS,
    GET_VEHICLE_SUCCESS,
    GET_VEHICLES_SUCCESS,
    UPDATE_VEHICLE_SUCCESS,
    RESTORE_VEHICLE_SUCCESS,
    DELETE_VEHICLE_SUCCESS
} from "./Actions";
import update from "immutability-helper";

export function vehicles(state = [], action) {
    switch (action.type) {
        case GET_VEHICLES_SUCCESS:
            return action.data;
        case ADD_VEHICLE_SUCCESS:
            return [
                {
                    ...action.data
                },
                ...state
            ];
        case RESTORE_VEHICLE_SUCCESS:
            return [
                {
                    ...action.data
                },
                ...state
            ];
        case DELETE_VEHICLE_SUCCESS:
            let result_delete = state.filter(vehicle => vehicle.uuid === action.data);
            if (result_delete.length === 1) {
                const index = state.indexOf(result_delete[0]);
                return update(state, {$splice: [[index, 1]]});
            } else {
                return state;
            }
        default:
            return state
    }
}


export function vehicle(state = {}, action) {
    switch (action.type) {
        case UPDATE_VEHICLE_SUCCESS:
            return Object.assign(state, action.data.payload);

        case GET_VEHICLE_SUCCESS:
            return action.data;

        default:
            return state
    }
}
