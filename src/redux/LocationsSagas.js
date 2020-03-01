import { throttle, call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import {
    ADD_PRIORITIY,
    addPrioritySuccess,
    UPDATE_PRIORITY,
    updatePrioritySuccess,
    GET_AVAILABLE_LOCATIONS_REQUEST,
    getAvailableLocationsSuccess,
    getAvailableDeliverablesSuccess
} from "./Actions"

import { getApiControl } from "./Api";

export function* getAvailableLocations() {
    const api = yield select(getApiControl);
    const result = yield call([api, api.locations.getAvailableLocations]);
    yield put(getAvailableLocationsSuccess(result))
}

export function* watchGetAvailableLocations() {
    yield takeLatest(GET_AVAILABLE_LOCATIONS_REQUEST, getAvailableLocations)
}
