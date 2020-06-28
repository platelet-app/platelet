import {throttle, call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import {
    GET_USERS_REQUEST,
    GET_USER_REQUEST,
    getUserSuccess,
    getUsersSuccess,
    updateUserSuccess,
    ADD_USER_REQUEST,
    deleteUserSuccess,
    DELETE_USER_REQUEST,
    UPDATE_USER_REQUEST,
    restoreUserSuccess,
    RESTORE_USER_REQUEST,
    getUsersFailure,
    getUserFailure,
    updateUserFailure,
    deleteUserFailure,
    restoreUserFailure, addUserFailure, UPDATE_USER_PASSWORD_REQUEST, clearForceResetPasswordStatus,
} from "./UsersActions";
import {getApiControl} from "../Api"

function* getUsers() {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.users.getUsers]);
        yield put(getUsersSuccess(result))
    } catch (error) {
        yield put(getUsersFailure(error))
    }
}

function* getUser(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.users.getUser], action.data);
        yield put(getUserSuccess(result))
    } catch (error) {
        yield put(getUserFailure(error))
    }
}

export function* watchGetUsers() {
    yield takeLatest(GET_USERS_REQUEST, getUsers)
}

export function* watchGetUser() {
    yield takeLatest(GET_USER_REQUEST, getUser)
}

function* updateUser(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.users.updateUser], action.data.userUUID, action.data.payload);
        yield put(updateUserSuccess(action.data))
    } catch (error) {
        yield put(updateUserFailure(error))
    }
}

export function* watchUpdateUser() {
    yield takeLatest(UPDATE_USER_REQUEST, updateUser)
}

function* updateUserPassword(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.users.updateUser], action.data.userUUID, action.data.payload);
        yield put(updateUserSuccess(action.data))
        yield put(clearForceResetPasswordStatus())
    } catch (error) {
        yield put(updateUserFailure(error))
    }
}

export function* watchUpdateUserPassword() {
    yield takeLatest(UPDATE_USER_PASSWORD_REQUEST, updateUserPassword)
}

function* deleteUser(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.users.deleteUser], action.data);
        yield put(deleteUserSuccess(action.data))
    } catch (error) {
        yield put(deleteUserFailure(error))
    }
}

export function* watchDeleteUser() {
    yield takeLatest(DELETE_USER_REQUEST, deleteUser)
}

function* restoreUser(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.users.restoreUser], action.data);
        const result = yield call([api, api.users.getUser], action.data);
        yield put(restoreUserSuccess(result))
    } catch (error) {
        yield put(restoreUserFailure(error))
    }
}

export function* watchRestoreUser() {
    yield takeLatest(RESTORE_USER_REQUEST, restoreUser)
}

function* addUser(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.users.createUser], action.data.userUUID, action.data.payload);
        yield put(updateUserSuccess(action.data))
    } catch (error) {
        yield put(updateUserFailure(error))
    }
}

export function* watchAddUser() {
    yield takeLatest(ADD_USER_REQUEST, addUser)
}
