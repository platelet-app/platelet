import { throttle, call, put, takeEvery , takeLatest} from 'redux-saga/effects'
import api from "./Api";
import {GET_USERS_REQUEST, getUsersSuccess} from "./Actions";

function* getUsers() {
    const result = yield call([api, api.users.getUsers]);
    yield put(getUsersSuccess(result))
}

export function* watchGetUsers() {
    yield takeLatest(GET_USERS_REQUEST, getUsers)
}
