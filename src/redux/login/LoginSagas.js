import { call, put, select, takeLatest, delay} from 'redux-saga/effects'
import {
    LOGIN_REQUEST,
    loginUserSuccess,
    loginAuthorised, logoutUser, loginFailure, LOGOUT, logoutUserSuccess, START_TOKEN_REFRESH_LOOP
} from "./LoginActions"

import {getApiControl} from "../Api";
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
            yield put(loginFailure(error));
            yield put(displayWarningNotification("Login failed, please check your details."))
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

function* refreshTokenLoop(action) {
    console.log("START REFRESH LOOP")
    console.log(action.data.expiresIn)
    console.log(+ new Date())
    let expireIn = action.data.expiresIn - + new Date();
    while (true) {
        try {
            console.log(expireIn)
            yield delay(expireIn + 1000);
            const api = yield select(getApiControl)
            const result = yield call([api, api.refreshToken]);
            saveLogin(result.access_token);
            yield put(loginUserSuccess(result.access_token))
            expireIn = result.login_expiry - + new Date();
        } catch(error) {
            yield put(loginFailure(error))
        }
    }
}

export function* watchRefreshTokenLoop() {
    yield takeLatest(START_TOKEN_REFRESH_LOOP, refreshTokenLoop)
}
