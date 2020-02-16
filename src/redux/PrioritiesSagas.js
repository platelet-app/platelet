import { throttle, call, put, takeEvery , takeLatest} from 'redux-saga/effects'
import api from "./Api"
import {
    ADD_PRIORITIY,
    addPrioritySuccess,
    UPDATE_PRIORITY,
    updatePrioritySuccess,
    GET_AVAILABLE_PRIORITIES_REQUEST,
    getAvailablePrioritiesSuccess,
    getAvailableDeliverablesSuccess
} from "./Actions"


export function* getAvailablePriorities() {
    const result = yield call([api, api.priorities.getAvailablePriorities]);
    yield put(getAvailablePrioritiesSuccess(result))
}

export function* watchGetAvailablePriorities() {
    yield takeLatest(GET_AVAILABLE_PRIORITIES_REQUEST, getAvailablePriorities)
}
