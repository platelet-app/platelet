import {
    GET_USERS_SUCCESS,
    GET_USER_SUCCESS,
    ADD_USER_SUCCESS,
    RESTORE_USER_SUCCESS,
    DELETE_USER_SUCCESS, UPDATE_USER_SUCCESS
} from "./UsersActions";
import {
    RESTORE_TASK_SUCCESS,
    UPDATE_TASK_DROPOFF_TIME_SUCCESS,
    UPDATE_TASK_PICKUP_TIME_SUCCESS
} from "../tasks/TasksActions";
import {DELETE_SESSION_SUCCESS} from "../sessions/SessionsActions";
import update from "immutability-helper";

export function users(state = [], action) {
    switch (action.type) {
        case GET_USERS_SUCCESS:
            return action.data;
        case ADD_USER_SUCCESS:
            return [
                {
                    ...action.data
                },
                ...state
            ];
        case UPDATE_USER_SUCCESS:
            let result = state.filter(user => user.uuid === action.data.userUUID);
            if (result.length === 1) {
                const updated_item = {...result[0], ...action.data.payload};
                const index = state.indexOf(result[0]);
                return update(state, {[index]: {$set: updated_item}});
            } else {
                return state;
            }
        case RESTORE_USER_SUCCESS:
            return [
                ...state,
                {
                    ...action.data
                }
            ];
        case DELETE_USER_SUCCESS:
            let result_delete = state.filter(user => user.uuid === action.data);
            if (result_delete.length === 1) {
                const index = state.indexOf(result_delete[0]);
                return update(state, { $splice: [[index, 1]] });
            } else {
                return state;
            }

        default:
            return state
    }
}

export function user(state = {}, action) {
    switch (action.type) {
        case GET_USER_SUCCESS:
            return action.data;
        case UPDATE_USER_SUCCESS:
            return Object.assign(state, action.data.payload);
        default:
            return state
    }
}
