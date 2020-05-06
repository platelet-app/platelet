import {
    GET_USERS_SUCCESS,
    GET_USER_SUCCESS,
    ADD_USER_SUCCESS,
    RESTORE_USER_SUCCESS,
    DELETE_USER_SUCCESS, UPDATE_USER_SUCCESS, GET_USERS_FAILURE, GET_USER_FAILURE
} from "./UsersActions";
import update from "immutability-helper";

const initialState = {
    users: [],
    error: null
}

export function users(state = initialState, action) {
    switch (action.type) {
        case GET_USERS_SUCCESS:
            return {users: action.data, error: null};
        case GET_USERS_FAILURE:
            return {...initialState, error: action.error};
        case ADD_USER_SUCCESS:
            return {
                users: [
                    {
                        ...action.data
                    },
                    ...state.users
                ], error: null
            };
        case UPDATE_USER_SUCCESS:
            let result = state.users.filter(user => user.uuid === action.data.userUUID);
            if (result.length === 1) {
                const updated_item = {...result[0], ...action.data.payload};
                const index = state.users.indexOf(result[0]);
                return {users: update(state.users, {[index]: {$set: updated_item}}), error: null};
            } else {
                return state;
            }
        case RESTORE_USER_SUCCESS:
            return {
                users: [
                    ...state.users,
                    {
                        ...action.data
                    }
                ], error: null
            };
        case DELETE_USER_SUCCESS:
            let result_delete = state.users.filter(user => user.uuid === action.data);
            if (result_delete.length === 1) {
                const index = state.users.indexOf(result_delete[0]);
                return {users: update(state.users, {$splice: [[index, 1]]}), error: null};
            } else {
                return state;
            }
        default:
            return state
    }
}

const initialUserState = {
    user: {
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

export function user(state = initialUserState, action) {
    switch (action.type) {
        case GET_USER_SUCCESS:
            return {user: action.data, error: null};
        case GET_USER_FAILURE:
            return {...initialUserState, error: action.error};
        case UPDATE_USER_SUCCESS:
            return {user: Object.assign(state.user, action.data.payload), error: null};
        default:
            return state
    }
}
