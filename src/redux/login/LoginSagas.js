import {throttle, call, put, takeEvery, select, takeLatest} from 'redux-saga/effects'
import {
    LOGIN_REQUEST,
    loginUserSuccess,
    loginIncorrectPassword,
    loginAuthorised,
    logoutUser,
    loginFailure,
    LOGOUT,
    logoutUserSuccess,
    loginSuccess,
    REFRESH_TOKEN_REQUEST,
    refreshTokenFailure, refreshTokenSuccess
} from "./LoginActions"

import {createApiControl, getApiControl} from "../Api";
import {deleteLogin, saveLogin} from "../../utilities";
import {displayWarningNotification} from "../notifications/NotificationsActions";


function* login(action) {
    const api = yield select(getApiControl);
    try {
        const result = yield call([api, api.login], action.username, action.password);
        yield saveLogin(result.access_token);
        yield put(loginUserSuccess(result.access_token))
    } catch (error) {
        if (error.status_code === 401) {
            yield put(displayWarningNotification("Login failed, please check your details."))
            yield put(loginFailure(error));
        } else {
            yield put(loginFailure(error));
        }
    }
}

export function* watchLogin() {
    yield takeLatest(LOGIN_REQUEST, login)
}

function* logout() {
    yield deleteLogin();
    yield put(logoutUserSuccess());
}

export function* watchLogout() {
    yield takeLatest(LOGOUT, logout)
}

function* refreshToken(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.refreshToken]);
        yield saveLogin(result.access_token);
        yield put(refreshTokenSuccess(result.access_token))
    } catch (error) {
        yield put(refreshTokenFailure(error))
    }
}

export function* watchRefreshToken() {
    yield takeLatest(REFRESH_TOKEN_REQUEST, refreshToken)
}
