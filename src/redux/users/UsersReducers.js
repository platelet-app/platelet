import {
    GET_USERS_SUCCESS,
    GET_USER_SUCCESS,
    ADD_USER_SUCCESS,
    RESTORE_USER_SUCCESS,
    DELETE_USER_SUCCESS, UPDATE_USER_SUCCESS, GET_USERS_FAILURE, GET_USER_FAILURE, GET_USER_NOTFOUND
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
            let result = state.users.find(user => user.uuid === action.data.userUUID);
            if (result) {
                const updated_item = {...result, ...action.data.payload};
                const index = state.users.indexOf(result);
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
            let result_delete = state.users.find(user => user.uuid === action.data);
            if (result_delete) {
                const index = state.users.indexOf(result_delete);
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
        roles: "",
        comments: null,
        links: null,
        display_name: null,
        assigned_vehicles: null,
        patch_id: null,
        contact_number: null,
        time_created: null,
        time_modified: null,
        profile_picture_url: "",
        profile_picture_thumbnail_url: ""
    }, error: null

}

export function user(state = initialUserState, action) {
    switch (action.type) {
        case GET_USER_SUCCESS:
            return {user: action.data, error: null};
        case GET_USER_FAILURE:
        case GET_USER_NOTFOUND:
            return {...initialUserState, error: action.error};
        case UPDATE_USER_SUCCESS:
            return {user: Object.assign(state.user, action.data.payload), error: null};
        default:
            return state
    }
}
