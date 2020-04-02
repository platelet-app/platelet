import {
    ADD_SESSION_SUCCESS,
    DELETE_SESSION_REQUEST, DELETE_SESSION_SUCCESS,
    GET_SESSION_SUCCESS,
    GET_SESSIONS_SUCCESS,
    RESTORE_SESSION_SUCCESS
} from "./Actions";
import {DELETE_TASK_SUCCESS, RESTORE_TASK_SUCCESS, UPDATE_TASK_SUCCESS} from "../tasks/Actions";
import update from "immutability-helper";

export function sessions(state = [], action) {
    switch (action.type) {
        case ADD_SESSION_SUCCESS:
            return [
                {
                    ...action.data
                },
                ...state
            ];
        case GET_SESSIONS_SUCCESS:
            return action.data;

        case RESTORE_SESSION_SUCCESS:
            return [
                {
                    ...action.data
                },
                ...state
            ];

        case DELETE_SESSION_SUCCESS:
            let result_delete = state.filter(session => session.uuid === action.data);
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

export function session(state = {}, action) {
    switch (action.type) {
        case GET_SESSION_SUCCESS:
            return action.data;
        default:
            return state

    }
}

