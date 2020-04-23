import {call, put, select, takeLatest} from "redux-saga/effects";
import {getApiControl} from "../Api";
import {GET_SERVER_SETTINGS_REQUEST, getServerSettingsSuccess} from "./ServerSettingsActions";

export function* getServerSettings() {
    const api = yield select(getApiControl);
    const result = yield call([api, api.getServerSettings]);
    yield put(getServerSettingsSuccess(result))
}

export function* watchGetServerSettings() {
    yield takeLatest(GET_SERVER_SETTINGS_REQUEST, getServerSettings)
}
