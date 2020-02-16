import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import api from "./Api"
import {ADD_SESSION, addSessionSuccess, GET_SESSIONS, getAllSessionsSuccess, GET_SESSION, getSessionSuccess} from "./Actions"


export function* postNewSession(action) {
    const result = yield call([api, api.sessions.createSession], action.data);
    const session = {...action.data, "uuid": result.uuid};
    yield put(addSessionSuccess(session))
}

export function* watchPostNewSession() {
    yield takeEvery(ADD_SESSION, postNewSession)
}

export function* getSessions(action) {
    const result = yield call([api, api.sessions.getSessions], action.data);
    yield put(getAllSessionsSuccess(result))
}

export function* watchGetSessions() {
    yield takeLatest(GET_SESSIONS, getSessions)
}

export function* getSession(action) {
    const result = yield call([api, api.sessions.getSession], action.data);
    yield put(getSessionSuccess(result))
}

export function* watchGetSession() {
    yield takeLatest(GET_SESSION, getSession)
}
