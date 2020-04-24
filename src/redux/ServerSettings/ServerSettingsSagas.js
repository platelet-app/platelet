import {call, put, select, takeLatest} from "redux-saga/effects";
import {getApiControl} from "../Api";
import {GET_SERVER_SETTINGS_REQUEST, getServerSettingsFailure, getServerSettingsSuccess} from "./ServerSettingsActions";

export function* getServerSettings() {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.getServerSettings]);
        if (result.status === 200)
            yield put(getServerSettingsSuccess(result.data))
        else
            yield put(getServerSettingsFailure(result.error))

    } catch (e) {
        yield put(getServerSettingsFailure(e))
    }
}

export function* watchGetServerSettings() {
    yield takeLatest(GET_SERVER_SETTINGS_REQUEST, getServerSettings)
}
