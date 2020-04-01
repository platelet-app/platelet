import {ADD_VEHICLE_SUCCESS, GET_VEHICLE_SUCCESS, GET_VEHICLES_SUCCESS, UPDATE_VEHICLE_SUCCESS} from "./Actions";

export function vehicles(state = [], action) {
    switch (action.type) {
        case GET_VEHICLES_SUCCESS:
            return action.data;
        default:
            return state
    }
}


export function vehicle(state = {}, action) {
    switch (action.type) {
        case ADD_VEHICLE_SUCCESS:
            return [
                ...state,
                {
                    ...action.data
                }
            ];
        case UPDATE_VEHICLE_SUCCESS:
            return Object.assign(state, action.data.payload);

        case GET_VEHICLE_SUCCESS:
            return action.data;

        default:
            return state
    }
}

