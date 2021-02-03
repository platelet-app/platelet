import {
    GET_TASK_DROPOFF_DESTINATION_SUCCESS,
    GET_TASK_DESTINATIONS_SUCCESS, GET_TASK_PICKUP_DESTINATION_SUCCESS,
    SET_TASK_DROPOFF_DESTINATION_SUCCESS,
    SET_TASK_PICKUP_DESTINATION_SUCCESS
} from "./TaskDestinationsActions";

const taskDestinationsInitialState = {pickup: {}, delivery: {}, error: null}

export function taskDestinations(state = taskDestinationsInitialState, action) {
    switch (action.type) {
        case GET_TASK_DESTINATIONS_SUCCESS:
            return action.data;
        case SET_TASK_PICKUP_DESTINATION_SUCCESS:
        case GET_TASK_PICKUP_DESTINATION_SUCCESS:
            return {...state, pickup: action.data};
        case SET_TASK_DROPOFF_DESTINATION_SUCCESS:
        case GET_TASK_DROPOFF_DESTINATION_SUCCESS:
            return {...state, delivery: action.data};
        default:
            return state;

        }

}
