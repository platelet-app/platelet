import { throttle, call, put, takeEvery , select, takeLatest} from 'redux-saga/effects'
import {
    LOGIN_REQUEST,
    loginUserSuccess
} from "./Actions"

import { getApiControl } from "../Api";

function* login(action) {
    const api = yield select(getApiControl);
    const result = yield call([api, api.login], action.data.username, action.data.password);
    yield put(loginUserSuccess(result))
}

export function* watchLogin() {
    yield takeLatest(LOGIN_REQUEST, login)
}
