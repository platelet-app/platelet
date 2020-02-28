import { throttle, call, put, takeEvery , takeLatest} from 'redux-saga/effects'
import api from "./Api"
import {
    LOGIN_REQUEST,
    loginUserSuccess
} from "./Actions"


function* login(action) {
    const result = yield call([api, api.login], action.data.username, action.data.password);
    yield put(loginUserSuccess(result))
}

export function* watchLogin() {
    yield takeLatest(LOGIN_REQUEST, login)
}
