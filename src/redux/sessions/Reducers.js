import {ADD_SESSION_SUCCESS, GET_SESSION_SUCCESS, GET_SESSIONS_SUCCESS} from "./Actions";

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

