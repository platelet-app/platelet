import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import api from "./Api"
import {ADD_SESSION, addSessionSuccess, SAVE_SESSIONS, saveAllSessions, saveAllSessionsSuccess} from "./Actions"


export function* postNewSession(action) {
    const result = yield call([api, api.sessions.createSession], action.data);
    const session = {...action.data, "uuid": result.uuid};
    yield put(addSessionSuccess(session))
}

export function* watchPostNewSession() {
    const action = yield takeEvery(ADD_SESSION, postNewSession)
}

export function* getAllSessions(action) {
    const result = yield call([api, api.sessions.getSessions], action.data.user_id);
    yield put(saveAllSessionsSuccess(result))
}

export function* watchGetAllSessions() {
    const action = yield takeLatest(SAVE_SESSIONS, getAllSessions)
}
