import { throttle, call, put, takeEvery , takeLatest} from 'redux-saga/effects'
import api from "./Api";
import {GET_WHOAMI, getWhoamiSuccess} from "./Actions";

function* getWhoami() {
    const result = yield call([api, api.users.whoami]);
    yield put(getWhoamiSuccess(result))
}

export function* watchGetWhoami() {
    yield takeLatest(GET_WHOAMI, getWhoami)
}
