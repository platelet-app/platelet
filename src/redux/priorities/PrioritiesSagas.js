import { throttle, call, put, takeEvery , takeLatest, select} from 'redux-saga/effects'
import {
    ADD_PRIORITIY,
    addPrioritySuccess,
    UPDATE_PRIORITY,
    updatePrioritySuccess,
    GET_AVAILABLE_PRIORITIES_REQUEST,
    getAvailablePrioritiesSuccess,
} from "./PrioritiesActions"

import { getApiControl } from "../Api";

export function* getAvailablePriorities() {
    const api = yield select(getApiControl);
    const result = yield call([api, api.priorities.getAvailablePriorities]);
    yield put(getAvailablePrioritiesSuccess(result))
}

export function* watchGetAvailablePriorities() {
    yield takeLatest(GET_AVAILABLE_PRIORITIES_REQUEST, getAvailablePriorities)
}
