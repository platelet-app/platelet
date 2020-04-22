import { throttle, call, put, takeEvery , select, takeLatest} from 'redux-saga/effects'
import {
    LOGIN_REQUEST,
    loginUserSuccess,
    loginIncorrectPassword,
    loginAuthorised
} from "./LoginActions"

import { getApiControl } from "../Api";

function* login(action) {
    const api = yield select(getApiControl);
    try {
        const result = yield call([api, api.login], action.data.username, action.data.password);
        yield put(loginUserSuccess(result))
        yield put(loginAuthorised())
    }
        catch(error) {
            if (error.status_code === 401) {
                yield put(loginIncorrectPassword());
            }
            else {
                throw error;
            }
        }
}

export function* watchLogin() {
    yield takeLatest(LOGIN_REQUEST, login)
}
