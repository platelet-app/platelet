import {call, put, select, spawn, takeLatest} from "redux-saga/effects";
import {INITIALISE_APP} from "./initialiseActions";
import {loginSuccess, refreshToken, startRefreshTokenLoop} from "../login/LoginActions";
import {createApiControl, getAuthToken} from "../Api";

function* initialiseApp(action) {
    console.log(action.token)
    if (action.token) {
        if (action.tokenExpiry) {
            console.log("EXPIRY GIVEN")
            yield spawn(startRefreshTokenLoop(action.expiry));
        } else {
            console.log("EXPIRY NOT GIVEN")
            const api = yield createApiControl(action.token);
            const result = yield call([api, api.refreshToken]);
            yield put(loginSuccess(result.access_token));
            yield spawn(startRefreshTokenLoop(result.expiry));
        }
    }

}

export function* watchInitialiseApp() {
    yield takeLatest(INITIALISE_APP, initialiseApp)
}
