import { call, put, takeLatest, select} from 'redux-saga/effects'
import {
    getAvailablePrioritiesActions,
    getAvailablePrioritiesFailure,
    getAvailablePrioritiesSuccess,
} from "./PrioritiesActions"

import { getApiControl } from "../Api";

export function* getAvailablePriorities() {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.priorities.getAvailablePriorities]);
        yield put(getAvailablePrioritiesSuccess(result))
    } catch (error) {
        yield put(getAvailablePrioritiesFailure(error))
    }
}

export function* watchGetAvailablePriorities() {
    yield takeLatest(getAvailablePrioritiesActions.request, getAvailablePriorities)
}
