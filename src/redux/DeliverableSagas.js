import { throttle, call, put, takeEvery , takeLatest} from 'redux-saga/effects'
import api from "./Api"
import {ADD_DELIVERABLE, addDeliverableSuccess, UPDATE_DELIVERABLE, updateDeliverableSuccess, GET_DELIVERABLES, getDeliverablesSuccess} from "./Actions"


export function* postNewDeliverable(action) {
    const result = yield call([api, api.deliverables.createDeliverable], action.data);
    const deliverable = {...action.data, "uuid": result.uuid};
    yield put(addDeliverableSuccess(deliverable))
}

export function* watchPostNewDeliverable() {
    const action = yield takeEvery(ADD_DELIVERABLE, postNewDeliverable)
}

export function* updateDeliverable(action) {
    yield call([api, api.deliverables.updateDeliverable], action.data.deliverableId, action.data.payload);
    yield put(updateDeliverableSuccess(action.data))
}

export function* watchUpdateDeliverable() {
    yield throttle(200, UPDATE_DELIVERABLE, updateDeliverable)
}

export function* getDeliverables(action) {
    const result = yield call([api, api.deliverables.getDeliverables], action.data.taskId);
    yield put(getDeliverablesSuccess(result))
}

export function* watchGetDeliverables() {
    const action = yield takeLatest(GET_DELIVERABLES, getDeliverables)
}
