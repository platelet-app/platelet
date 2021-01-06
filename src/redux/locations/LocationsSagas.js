import { throttle, call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import {
    GET_AVAILABLE_LOCATIONS_REQUEST, GET_LOCATION_REQUEST, getAvailableLocationsFailure,
    getAvailableLocationsSuccess, getLocationFailure, getLocationNotFound, getLocationSuccess,
} from "./LocationsActions"

import { getApiControl } from "../Api";
import {convertListDataToObjects} from "../redux_utilities";

export function* getAvailableLocations() {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.locations.getAvailableLocations]);
        yield put(getAvailableLocationsSuccess(convertListDataToObjects(result)))
    } catch(error) {
        yield put(getAvailableLocationsFailure(error))
    }
}

export function* watchGetAvailableLocations() {
    yield takeLatest(GET_AVAILABLE_LOCATIONS_REQUEST, getAvailableLocations)
}

export function* getLocation(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.locations.getLocation], action.data);
        yield put(getLocationSuccess(result))
    } catch(error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(getLocationNotFound(error))
            }
        }
        yield put(getLocationFailure(error))
    }
}

export function* watchGetLocation() {
    yield takeLatest(GET_LOCATION_REQUEST, getLocation)
}
