import { throttle, call, put, takeEvery , takeLatest} from 'redux-saga/effects'
import api from "./Api"
import {
    ADD_PRIORITIY,
    addPrioritySuccess,
    UPDATE_PRIORITY,
    updatePrioritySuccess,
    GET_AVAILABLE_LOCATIONS_REQUEST,
    getAvailableLocationsSuccess,
    getAvailableDeliverablesSuccess
} from "./Actions"


export function* getAvailableLocations() {
    const result = yield call([api, api.locations.getAvailableLocations]);
    yield put(getAvailableLocationsSuccess(result))
}

export function* watchGetAvailableLocations() {
    yield takeLatest(GET_AVAILABLE_LOCATIONS_REQUEST, getAvailableLocations)
}
