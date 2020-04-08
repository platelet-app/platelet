import { throttle, call, put, takeEvery , takeLatest, select} from 'redux-saga/effects'
import {GET_WHOAMI_REQUEST, getWhoamiSuccess} from "./Actions";
import { getApiControl } from "./Api";

function* getWhoami() {
    const api = yield select(getApiControl);
    const result = yield call([api, api.users.whoami]);
    yield put(getWhoamiSuccess(result))
}

export function* watchGetWhoami() {
    yield takeLatest(GET_WHOAMI_REQUEST, getWhoami)
}
