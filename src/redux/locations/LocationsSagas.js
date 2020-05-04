import { throttle, call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import {
    GET_AVAILABLE_LOCATIONS_REQUEST, getAvailableLocationsFailure,
    getAvailableLocationsSuccess,
} from "./LocationsActions"

import { getApiControl } from "../Api";

export function* getAvailableLocations() {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.locations.getAvailableLocations]);
        yield put(getAvailableLocationsSuccess(result))
    } catch(error) {
        yield put(getAvailableLocationsFailure(error))
    }
}

export function* watchGetAvailableLocations() {
    yield takeLatest(GET_AVAILABLE_LOCATIONS_REQUEST, getAvailableLocations)
}
