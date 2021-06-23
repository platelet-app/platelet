import {call, put, takeEvery, takeLatest, select, debounce} from 'redux-saga/effects'
import {
    addDeliverableSuccess,
    updateDeliverableSuccess,
    getDeliverablesSuccess,
    getAvailableDeliverablesSuccess,
    addDeliverableFailure,
    updateDeliverableFailure,
    getDeliverablesFailure,
    getAvailableDeliverablesFailure,
    deleteDeliverableSuccess,
    deleteDeliverableFailure,
    addDeliverableActions,
    deleteDeliverableActions,
    updateDeliverableActions,
    getDeliverablesActions,
    getAvailableDeliverablesActions,
    updateDeliverableCountPrefix,
    updateDeliverableCountActions,
    updateDeliverableCountSuccess, updateDeliverableCountFailure
} from "./DeliverablesActions"

import {getApiControl} from "../Selectors";
import {convertListDataToObjects} from "../redux_utilities";

export function* postNewDeliverable(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.deliverables.createDeliverable], action.data.payload);
        const deliverable = {...action.data.payload, "uuid": result.uuid};
        yield put(addDeliverableSuccess(deliverable))
    } catch (error) {
        yield put(addDeliverableFailure(error))
    }
}

export function* watchPostNewDeliverable() {
    yield takeEvery(addDeliverableActions.request, postNewDeliverable)
}

export function* deleteDeliverable(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.deliverables.deleteDeliverable], action.data.deliverableUUID);
        yield put(deleteDeliverableSuccess(action.data.deliverableUUID))
    } catch (error) {
        yield put(deleteDeliverableFailure(error))
    }
}

export function* watchDeleteDeliverable() {
    yield takeEvery(deleteDeliverableActions.request, deleteDeliverable)
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
    yield takeEvery(updateDeliverableActions.request, updateDeliverable)
}

export function* updateDeliverableCount(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.deliverables.updateDeliverable], action.data.deliverableUUID, action.data.payload);
        yield put(updateDeliverableCountSuccess(action.data))
    } catch (error) {
        yield put(updateDeliverableCountFailure(error))
    }
}

export function* watchUpdateDeliverableCount() {
    yield debounce(300, updateDeliverableCountActions.request, updateDeliverableCount);
}

export function* getDeliverables(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.deliverables.getDeliverables], action.data.parentUUID);
        const converted = yield convertListDataToObjects(result);
        yield put(getDeliverablesSuccess(converted))
    } catch (error) {
        yield put(getDeliverablesFailure(error))
    }
}

export function* watchGetDeliverables() {
    yield takeLatest(getDeliverablesActions.request, getDeliverables)
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
    yield takeLatest(getAvailableDeliverablesActions.request, getAvailableDeliverables)
}
