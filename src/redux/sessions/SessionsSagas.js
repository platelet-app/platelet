import {all, call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import {
    ADD_SESSION_REQUEST,
    addSessionSuccess,
    GET_SESSIONS_REQUEST,
    getAllSessionsSuccess,
    GET_SESSION_REQUEST,
    getSessionSuccess,
    GET_SESSION_STATISTICS_REQUEST,
    getSessionStatisticsSuccess,
    addSessionFailure,
    getAllSessionsFailure,
    getSessionNotFound,
    getSessionStatisticsFailure,
    getSessionFailure,
    getSessionStatisticsNotFound,
    deleteSessionFailure,
    restoreSessionFailure,
    setCurrentSession,
    ADD_SESSION_AND_SET_CURRENT_REQUEST,
    REFRESH_CURRENT_SESSION_REQUEST,
    refreshCurrentSessionSuccess,
    refreshCurrentSessionFailure
} from "./SessionsActions"
import {getApiControl} from "../Api";
import {
    DELETE_SESSION_REQUEST,
    deleteSessionSuccess,
    RESTORE_SESSION_REQUEST,
    restoreSessionSuccess
} from "./SessionsActions";
import {getCurrentSessionSelector} from "../selectors";


export function* postNewSession(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.sessions.createSession], action.data);
        const session = {...action.data, "uuid": result.uuid};
        yield put(addSessionSuccess(session));
        yield put(setCurrentSession(session));
    } catch (error) {
        yield put(addSessionFailure(error));

    }
}

export function* watchPostNewSession() {
    yield takeEvery(ADD_SESSION_REQUEST, postNewSession);
}

export function* getSessions(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.sessions.getSessions], action.data);
        yield put(getAllSessionsSuccess(result));
    } catch (error) {
        yield put(getAllSessionsFailure(error));
    }
}

export function* watchGetSessions() {
    yield takeLatest(GET_SESSIONS_REQUEST, getSessions)
}

export function* getSession(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.sessions.getSession], action.data);
        yield put(getSessionSuccess(result))
    } catch (error) {
        if (error.response.status === 404)
            yield put(getSessionNotFound(error))
        else
            yield put(getSessionFailure(error));
    }
}

export function* watchGetSession() {
    yield takeLatest(GET_SESSION_REQUEST, getSession)
}

export function* refreshCurrentSession(action) {
    try {
        const api = yield select(getApiControl);
        const currentSession = yield select(getCurrentSessionSelector);
        const result = yield call([api, api.sessions.getSession], action.data);
        if (new Date(result.last_active) !== new Date(currentSession.time_active))
            yield put(refreshCurrentSessionSuccess(result))
    } catch (error) {
        yield put(refreshCurrentSessionFailure(error));
    }
}

export function* watchRefreshCurrentSession() {
    yield takeLatest(REFRESH_CURRENT_SESSION_REQUEST, refreshCurrentSession)
}

export function* getSessionStatistics(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.sessions.getStatistics], action.data);
        yield put(getSessionStatisticsSuccess(result))
    } catch (error) {
        if (error.response.status === 404)
            yield put(getSessionStatisticsNotFound(error))
        else
            yield put(getSessionStatisticsFailure(error));
    }
}

export function* watchGetSessionStatistics() {
    yield takeLatest(GET_SESSION_STATISTICS_REQUEST, getSessionStatistics)
}


function* deleteSession(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.sessions.deleteSession], action.data);
        yield put(deleteSessionSuccess(action.data))
    } catch (error) {
        yield put(deleteSessionFailure(error));
    }
}

export function* watchDeleteSession() {
    yield takeEvery(DELETE_SESSION_REQUEST, deleteSession)
}

function* restoreSession(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.sessions.restoreSession], action.data);
        const result = yield call([api, api.sessions.getSession], action.data);
        yield put(restoreSessionSuccess(result))
    } catch (error) {
        yield put(restoreSessionFailure(error));
    }
}

export function* watchRestoreSession() {
    yield takeEvery(RESTORE_SESSION_REQUEST, restoreSession)
}
