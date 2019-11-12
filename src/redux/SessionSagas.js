import { all, call, put, takeEvery } from 'redux-saga/effects'
import api from "./Api"
import {ADD_SESSION, addSessionSuccess} from "./Actions"


export function* postNewSession(action) {
    const result = yield call([api, api.sessions.createSession], action.data);
    const session = {...action.data, "uuid": result.uuid};
    yield put(addSessionSuccess(session))
}

export function* watchPostNewSession() {
    const action = yield takeEvery(ADD_SESSION, postNewSession)
}

