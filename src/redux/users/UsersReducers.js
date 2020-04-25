import {
    GET_USERS_SUCCESS,
    GET_USER_SUCCESS,
    ADD_USER_SUCCESS,
    RESTORE_USER_SUCCESS,
    DELETE_USER_SUCCESS
} from "./UsersActions";
import {RESTORE_TASK_SUCCESS} from "../tasks/TasksActions";
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
        default:
            return state
    }
}
