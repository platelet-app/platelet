import { all, call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import {ADD_SESSION_REQUEST, addSessionSuccess, GET_SESSIONS_REQUEST, getAllSessionsSuccess, GET_SESSION_REQUEST, getSessionSuccess} from "./Actions"
import { getApiControl } from "../Api";
import {DELETE_SESSION_REQUEST, deleteSessionSuccess, RESTORE_SESSION_REQUEST, restoreSessionSuccess} from "./Actions";


export function* postNewSession(action) {
    const api = yield select(getApiControl);
    const result = yield call([api, api.sessions.createSession], action.data);
    const session = {...action.data, "uuid": result.uuid};
    yield put(addSessionSuccess(session))
}

export function* watchPostNewSession() {
    yield takeEvery(ADD_SESSION_REQUEST, postNewSession)
}

export function* getSessions(action) {
    const api = yield select(getApiControl);
    const result = yield call([api, api.sessions.getSessions], action.data);
    yield put(getAllSessionsSuccess(result))
}

export function* watchGetSessions() {
    yield takeLatest(GET_SESSIONS_REQUEST, getSessions)
}

export function* getSession(action) {
    const api = yield select(getApiControl);
    const result = yield call([api, api.sessions.getSession], action.data);
    yield put(getSessionSuccess(result))
}

export function* watchGetSession() {
    yield takeLatest(GET_SESSION_REQUEST, getSession)
}
function* deleteSession(action) {
    const api = yield select(getApiControl);
    yield call([api, api.sessions.deleteSession], action.data);
    yield put(deleteSessionSuccess(action.data))
}

export function* watchDeleteSession() {
    yield takeEvery(DELETE_SESSION_REQUEST, deleteSession)
}

function* restoreSession(action) {
    const api = yield select(getApiControl);
    yield call([api, api.sessions.restoreSession], action.data);
    const result = yield call([api, api.sessions.getSession], action.data);
    yield put(restoreSessionSuccess(result))
}

export function* watchRestoreSession() {
    yield takeEvery(RESTORE_SESSION_REQUEST, restoreSession)
}

