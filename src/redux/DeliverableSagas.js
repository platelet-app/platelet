import { throttle, call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import {ADD_DELIVERABLE_REQUEST, addDeliverableSuccess, UPDATE_DELIVERABLE_REQUEST, updateDeliverableSuccess, GET_DELIVERABLES_REQUEST, getDeliverablesSuccess, GET_AVAILABLE_DELIVERABLES_REQUEST, getAvailableDeliverablesSuccess} from "./Actions"

import { getApiControl } from "./Api";

export function* postNewDeliverable(action) {
    const api = yield select(getApiControl);
    const result = yield call([api, api.deliverables.createDeliverable], action.data);
    const deliverable = {...action.data, "uuid": result.uuid};
    yield put(addDeliverableSuccess(deliverable))
}

export function* watchPostNewDeliverable() {
    yield takeEvery(ADD_DELIVERABLE_REQUEST, postNewDeliverable)
}

export function* updateDeliverable(action) {
    const api = yield select(getApiControl);
    yield call([api, api.deliverables.updateDeliverable], action.data.deliverableUUID, action.data.payload);
    yield put(updateDeliverableSuccess(action.data))
}

export function* watchUpdateDeliverable() {
    yield throttle(200, UPDATE_DELIVERABLE_REQUEST, updateDeliverable)
}

export function* getDeliverables(action) {
    const api = yield select(getApiControl);
    const result = yield call([api, api.deliverables.getDeliverables], action.data);
    yield put(getDeliverablesSuccess(result))
}

export function* watchGetDeliverables() {
    yield takeLatest(GET_DELIVERABLES_REQUEST, getDeliverables)
}

export function* getAvailableDeliverables() {
    const api = yield select(getApiControl);
    const result = yield call([api, api.deliverables.getAvailableDeliverables]);
    yield put(getAvailableDeliverablesSuccess(result))
}

export function* watchGetAvailableDeliverables() {
    yield takeLatest(GET_AVAILABLE_DELIVERABLES_REQUEST, getAvailableDeliverables)
}
