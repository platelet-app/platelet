import _ from "lodash"
import {
    addUserActions,
    deleteUserActions, getUserActions,
    getUsersActions,
    restoreUserActions,
    updateUserActions
} from "./UsersActions";

const initialState = {
    users: {},
    error: null
}

export function users(state = initialState, action) {
    switch (action.type) {
        case getUsersActions.success:
            return {users: action.data, error: null};
        case getUsersActions.failure:
            return {...initialState, error: action.error};
        case addUserActions.success:
            return {users: {...state.users, [action.data.uuid]: action.data}, error: null};
        case updateUserActions.success:
            const user = state.users[action.data.userUUID]
            if (user) {
                const updated_item = {...user, ...action.data.payload};
                return {users: {...state.users, [action.data.userUUID]: updated_item}, error: null}
            } else {
                return state;
            }
        case restoreUserActions.success:
            return {users: {...state.users, [action.data.uuid]: action.data}, error: null}
        case deleteUserActions.success: {
            return {users: _.omit(state.users, action.data.userUUID), error: null}
        }
        default:
            return state
    }
}

export const initialUserState = {
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
        case getUserActions.success:
            return {user: action.data, error: null};
        case getUserActions.failure:
            return {...initialUserState, error: action.error};
        case updateUserActions.success:
            return {user: {...state.user, ...action.data.payload}, error: null};
        default:
            return state
    }
}
