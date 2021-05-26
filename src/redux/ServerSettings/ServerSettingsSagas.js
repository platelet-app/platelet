import {call, put, select, takeLatest} from "redux-saga/effects";
import {getApiControl} from "../Selectors";
import {getServerSettingsActions, getServerSettingsFailure, getServerSettingsSuccess} from "./ServerSettingsActions";

export function* getServerSettings() {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.getServerSettings]);
        if (result.status === 200)
            yield put(getServerSettingsSuccess(result.data))
        else
            yield put(getServerSettingsFailure(result.error))

    } catch (error) {
        yield put(getServerSettingsFailure(error))
    }
}

export function* watchGetServerSettings() {
    yield takeLatest(getServerSettingsActions.request, getServerSettings)
}
