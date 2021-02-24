import { call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import {
    addLocationActions,
    addLocationFailure,
    addLocationSuccess, getAvailableLocationsActions,
    getAvailableLocationsFailure,
    getAvailableLocationsSuccess, getLocationActions,
    getLocationFailure,
    getLocationNotFound,
    getLocationSuccess, updateLocationActions,
    updateLocationFailure,
    updateLocationNotFound,
    updateLocationSuccess,
} from "./LocationsActions"

import { getApiControl } from "../Api";
import {convertListDataToObjects} from "../redux_utilities";

function* getAvailableLocations() {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.locations.getAvailableLocations]);
        yield put(getAvailableLocationsSuccess(convertListDataToObjects(result)))
    } catch(error) {
        yield put(getAvailableLocationsFailure(error))
    }
}

export function* watchGetAvailableLocations() {
    yield takeLatest(getAvailableLocationsActions.request, getAvailableLocations)
}

function* getLocation(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.locations.getLocation], action.data.locationUUID);
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
    yield takeLatest(getLocationActions.request, getLocation)
}

export function* updateLocation(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.locations.updateLocation], action.data.locationUUID, action.data.payload);
        yield put(updateLocationSuccess(result))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(updateLocationNotFound(error))
            }
        }
        yield put(updateLocationFailure(error))
    }
}

export function* watchUpdateLocation() {
    yield takeEvery(updateLocationActions.request, updateLocation)
}

function* addNewLocation(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.locations.createLocation], action.data.payload);
        yield put(addLocationSuccess(result))
    } catch (error) {
        yield put(addLocationFailure(error))
    }
}

export function* watchAddNewLocation() {
    yield takeEvery(addLocationActions.request, addNewLocation)
}
