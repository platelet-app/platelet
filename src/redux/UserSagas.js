import { throttle, call, put, takeEvery , takeLatest, select} from 'redux-saga/effects'
import {GET_USERS_REQUEST, getUsersSuccess} from "./Actions";
import { getApiControl } from "./Api"

function* getUsers() {
    const api = yield select(getApiControl);
    const result = yield call([api, api.users.getUsers]);
    yield put(getUsersSuccess(result))
}

export function* watchGetUsers() {
    yield takeLatest(GET_USERS_REQUEST, getUsers)
}
