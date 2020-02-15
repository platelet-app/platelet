import { throttle, call, put, takeEvery , takeLatest} from 'redux-saga/effects'
import api from "./Api"
import {ADD_DELIVERABLE, addDeliverableSuccess, UPDATE_DELIVERABLE, updateDeliverableSuccess, GET_DELIVERABLES, getDeliverablesSuccess, GET_AVAILABLE_DELIVERABLES, getAvailableDeliverablesSuccess} from "./Actions"


export function* postNewDeliverable(action) {
    const result = yield call([api, api.deliverables.createDeliverable], action.data);
    const deliverable = {...action.data, "uuid": result.uuid};
    yield put(addDeliverableSuccess(deliverable))
}

export function* watchPostNewDeliverable() {
    yield takeEvery(ADD_DELIVERABLE, postNewDeliverable)
}

export function* updateDeliverable(action) {
    yield call([api, api.deliverables.updateDeliverable], action.data.deliverableUUID, action.data.payload);
    yield put(updateDeliverableSuccess(action.data))
}

export function* watchUpdateDeliverable() {
    yield throttle(200, UPDATE_DELIVERABLE, updateDeliverable)
}

export function* getDeliverables(action) {
    const result = yield call([api, api.deliverables.getDeliverables], action.data);
    yield put(getDeliverablesSuccess(result))
}

export function* watchGetDeliverables() {
    yield takeLatest(GET_DELIVERABLES, getDeliverables)
}

export function* getAvailableDeliverables() {
    const result = yield call([api, api.deliverables.getAvailableDeliverables]);
    yield put(getAvailableDeliverablesSuccess(result))
}

export function* watchGetAvailableDeliverables() {
    yield takeLatest(GET_AVAILABLE_DELIVERABLES, getAvailableDeliverables)
}
