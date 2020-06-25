import {call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import {
    ADD_DELIVERABLE_REQUEST,
    addDeliverableSuccess,
    UPDATE_DELIVERABLE_REQUEST,
    updateDeliverableSuccess,
    GET_DELIVERABLES_REQUEST,
    getDeliverablesSuccess,
    GET_AVAILABLE_DELIVERABLES_REQUEST,
    getAvailableDeliverablesSuccess,
    addDeliverableFailure,
    updateDeliverableFailure,
    getDeliverablesFailure,
    getAvailableDeliverablesFailure, deleteDeliverableSuccess, deleteDeliverableFailure, DELETE_DELIVERABLE_REQUEST
} from "./DeliverablesActions"

import {getApiControl} from "../Api";

export function* postNewDeliverable(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.deliverables.createDeliverable], action.data);
        const deliverable = {...action.data, "uuid": result.uuid};
        yield put(addDeliverableSuccess(deliverable))
    } catch (error) {
        yield put(addDeliverableFailure(error))
    }
}

export function* watchPostNewDeliverable() {
    yield takeEvery(ADD_DELIVERABLE_REQUEST, postNewDeliverable)
}

export function* deleteDeliverable(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.deliverables.deleteDeliverable], action.data);
        yield put(deleteDeliverableSuccess(action.data))
    } catch (error) {
        yield put(deleteDeliverableFailure(error))
    }
}

export function* watchDeleteDeliverable() {
    yield takeEvery(DELETE_DELIVERABLE_REQUEST, deleteDeliverable)
}

export function* updateDeliverable(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.deliverables.updateDeliverable], action.data.deliverableUUID, action.data.payload);
        yield put(updateDeliverableSuccess(action.data))
    } catch (error) {
        yield put(updateDeliverableFailure(error))
    }
}

export function* watchUpdateDeliverable() {
    yield takeEvery(UPDATE_DELIVERABLE_REQUEST, updateDeliverable)
}

export function* getDeliverables(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.deliverables.getDeliverables], action.data);
        yield put(getDeliverablesSuccess(result))
    } catch (error) {
        yield put(getDeliverablesFailure(error))
    }
}

export function* watchGetDeliverables() {
    yield takeLatest(GET_DELIVERABLES_REQUEST, getDeliverables)
}

export function* getAvailableDeliverables() {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.deliverables.getAvailableDeliverables]);
        yield put(getAvailableDeliverablesSuccess(result))
    } catch (error) {
        yield put(getAvailableDeliverablesFailure(error))
    }
}

export function* watchGetAvailableDeliverables() {
    yield takeLatest(GET_AVAILABLE_DELIVERABLES_REQUEST, getAvailableDeliverables)
}
