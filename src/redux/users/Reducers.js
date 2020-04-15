import {GET_USERS_SUCCESS, GET_USER_SUCCESS} from "./Actions";

export function users(state = [], action) {
    switch (action.type) {
        case GET_USERS_SUCCESS:
            return action.data;
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

