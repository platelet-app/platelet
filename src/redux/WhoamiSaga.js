import { throttle, call, put, takeEvery , takeLatest, select} from 'redux-saga/effects'
import {GET_WHOAMI_REQUEST, getWhoamiFailure, getWhoamiSuccess, REFRESH_WHOAMI_REQUEST} from "./Actions";
import { getApiControl } from "./Api";

function* getWhoami() {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.users.whoami]);
        yield put(getWhoamiSuccess(result))
    } catch(error) {
        yield put(getWhoamiFailure(error))
    }
}

export function* watchGetWhoami() {
    yield takeLatest(GET_WHOAMI_REQUEST, getWhoami)
}

export function* watchRefreshWhoami() {
    yield takeLatest(REFRESH_WHOAMI_REQUEST, getWhoami)
}
