import {GET_USERS_SUCCESS} from "./Actions";

export function users(state = [], action) {
    switch (action.type) {
        case GET_USERS_SUCCESS:
            return action.data;
        default:
            return state
    }
}

