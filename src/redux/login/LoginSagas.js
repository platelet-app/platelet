import { call, put, select, takeLatest } from "redux-saga/effects";
import {
    loginUserSuccess,
    loginUserFailure,
    LOGOUT,
    refreshUserTokenFailure,
    refreshUserTokenSuccess,
    loginUserActions,
    refreshUserTokenActions,
} from "./LoginActions";

import { getApiControl } from "../Selectors";
import { saveLogin } from "../../utilities";
import { displayWarningNotification } from "../notifications/NotificationsActions";
import { Auth, DataStore } from "aws-amplify";

function* login(action) {
    const api = yield select(getApiControl);
    try {
        const result = yield call(
            [api, api.login],
            action.username,
            action.password
        );
        yield call(saveLogin, result.access_token);
        yield put(loginUserSuccess(result.access_token));
    } catch (error) {
        if (error.status_code === 401) {
            yield put(
                displayWarningNotification(
                    "Login failed, please check your details."
                )
            );
            yield put(loginUserFailure(error));
        } else {
            yield put(loginUserFailure(error));
        }
    }
}

export function* watchLogin() {
    yield takeLatest(loginUserActions.request, login);
}

function* logout(action) {
    try {
        yield call([DataStore, DataStore.stop]);
        yield call([DataStore, DataStore.clear]);
        yield call([Auth, Auth.signOut]);
        if (action.data.broadcast) {
            const channel = yield new BroadcastChannel(
                "platelet-broadcast-channel"
            );
            yield call([channel, channel.postMessage], "logout");
        }
    } catch (error) {
        console.log(error);
    } finally {
        yield call([window, window.location.reload.bind(window.location)]);
    }
}

export function* watchLogout() {
    yield takeLatest(LOGOUT, logout);
}

function* refreshToken(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.refreshToken]);
        yield call(saveLogin, result.access_token);
        yield put(refreshUserTokenSuccess(result.access_token));
    } catch (error) {
        yield put(refreshUserTokenFailure(error));
    }
}

export function* watchRefreshToken() {
    yield takeLatest(refreshUserTokenActions.request, refreshToken);
}
