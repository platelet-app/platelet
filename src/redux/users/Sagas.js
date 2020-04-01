import { throttle, call, put, takeEvery , takeLatest, select} from 'redux-saga/effects'
import {
    GET_USERS_REQUEST,
    getUsersSuccess,
    updateUserSuccess,
    UPDATE_USER_NAME_REQUEST,
    UPDATE_USER_USERNAME_REQUEST,
    UPDATE_USER_CONTACT_NUMBER_REQUEST,
    UPDATE_USER_DISPLAY_NAME_REQUEST,
    UPDATE_USER_PASSWORD_REQUEST,
    UPDATE_USER_EMAIL_ADDRESS_REQUEST,
    UPDATE_USER_ROLES_REQUEST,
    UPDATE_USER_PATCH_REQUEST,
    UPDATE_USER_ADDRESS_REQUEST,
} from "./Actions";
import { getApiControl } from "../Api"

function* getUsers() {
    const api = yield select(getApiControl);
    const result = yield call([api, api.users.getUsers]);
    yield put(getUsersSuccess(result))
}

export function* watchGetUsers() {
    yield takeLatest(GET_USERS_REQUEST, getUsers)
}

function* updateUser(action) {
    const api = yield select(getApiControl);
    yield call([api, api.tasks.updateUser], action.data.userUUID, action.data.payload);
    yield put(updateUserSuccess(action.data))
}
export function* watchUpdateUserName() {
    yield throttle(500, UPDATE_USER_NAME_REQUEST, updateUser)
}
export function* watchUpdateUserUsername() {
    yield throttle(500, UPDATE_USER_USERNAME_REQUEST, updateUser)
}
export function* watchUpdateUserContactNumber() {
    yield throttle(500, UPDATE_USER_CONTACT_NUMBER_REQUEST, updateUser)
}
export function* watchUpdateUserDisplayName() {
    yield throttle(500, UPDATE_USER_DISPLAY_NAME_REQUEST, updateUser)
}
export function* watchUpdateUserEmail() {
    yield throttle(500, UPDATE_USER_EMAIL_ADDRESS_REQUEST, updateUser)
}
export function* watchUpdateUserPassword() {
    yield throttle(500, UPDATE_USER_PASSWORD_REQUEST, updateUser)
}
export function* watchUpdateUserRoles() {
    yield throttle(500, UPDATE_USER_ROLES_REQUEST, updateUser)
}
export function* watchUpdateUserPatch() {
    yield throttle(500, UPDATE_USER_PATCH_REQUEST, updateUser)
}
export function* watchUpdateUserAddress() {
    yield throttle(500, UPDATE_USER_ADDRESS_REQUEST, updateUser)
}
