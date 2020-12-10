import {throttle, call, put, takeEvery, select, takeLatest} from 'redux-saga/effects'
import {
    LOGIN_REQUEST,
    loginUserSuccess,
    loginIncorrectPassword,
    loginAuthorised, logoutUser, loginFailure, LOGOUT, logoutUserSuccess
} from "./LoginActions"

import {getApiControl} from "../Api";
import {deleteLogin, saveLogin} from "../../utilities";

function* login(action) {
    const api = yield select(getApiControl);
    try {
        const result = yield call([api, api.login], action.username, action.password);
        yield saveLogin(result.access_token);
        yield put(loginUserSuccess(result))
        yield put(loginAuthorised())
    } catch (error) {
        if (error.status_code === 401) {
            yield put(loginIncorrectPassword());
            yield put(loginFailure());
        } else {
            throw error;
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
        const result = yield call([api, api.refreshToken], action.data.username, action.data.password);
        yield put(loginUserSuccess(result))
        yield put(loginAuthorised())
    } catch (error) {
        if (error.status_code === 401) {
            yield put(logoutUser());
        } else {
            throw error;
        }
    }
}


