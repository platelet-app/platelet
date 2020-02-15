import { throttle, call, put, takeEvery , takeLatest} from 'redux-saga/effects'
import api from "./Api"
import {ADD_VEHICLE, addVehicleSuccess, UPDATE_VEHICLE, updateVehicleSuccess, GET_VEHICLES, getAllVehiclesSuccess, GET_VEHICLE, getVehicleSuccess} from "./Actions"

// TODO: This needs to be adapted to vehicles!

export function* postNewVehicle(action) {
    const result = yield call([api, api.vehicles.createVehicle], action.data);
    const task = {...action.data, "uuid": result.uuid};
    yield put(addVehicleSuccess(task))
}

export function* watchPostNewVehicle() {
    yield takeEvery(ADD_VEHICLE, postNewVehicle)
}

export function* updateVehicle(action) {
    yield call([api, api.vehicles.updateVehicle], action.data.taskId, action.data.payload);
    yield put(updateVehicleSuccess(action.data))
}

export function* watchUpdateVehicle() {
    yield throttle(300, UPDATE_VEHICLE, updateVehicle)
}

export function* getVehicles() {
    const result = yield call([api, api.vehicles.getVehicles]);
    yield put(getAllVehiclesSuccess(result))
}

export function* watchGetVehicles() {
    yield takeLatest(GET_VEHICLES, getVehicles)
}

export function* getVehicle(action) {
    const result = yield call([api, api.vehicles.getVehicle], action.data);
    yield put(getVehicleSuccess(result))
}

export function* watchVehicle() {
    yield takeLatest(GET_VEHICLE, getVehicle)
}
