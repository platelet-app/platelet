import { throttle, call, put, takeEvery , takeLatest, select} from 'redux-saga/effects'
import {
    ADD_VEHICLE_REQUEST,
    addVehicleSuccess,
    UPDATE_VEHICLE_REQUEST,
    updateVehicleSuccess,
    GET_VEHICLES_REQUEST,
    getAllVehiclesSuccess,
    GET_VEHICLE_REQUEST,
    getVehicleSuccess,
    getWhoamiSuccess
} from "./Actions"
import {getUsersSuccess} from "./Actions"
import { getApiControl, getWhoami } from "./Api";

function* postNewVehicle(action) {
    const api = yield select(getApiControl);
    const result = yield call([api, api.vehicles.createVehicle], action.data);
    const task = {...action.data, "uuid": result.uuid};
    yield put(addVehicleSuccess(task))
}

export function* watchPostNewVehicle() {
    yield takeEvery(ADD_VEHICLE_REQUEST, postNewVehicle)
}

function* updateVehicle(action) {
    const api = yield select(getApiControl);
    if (action.data.payload.assigned_user) {
        action.data.payload.assigned_user_uuid = action.data.payload.assigned_user.uuid;
    }

    yield call([api, api.vehicles.updateVehicle], action.data.vehicleUUID, action.data.payload);
    if (action.data.payload.assigned_user) {
        const whoami = yield select(getWhoami);
        const result = yield call([api, api.users.getUsers]);
        yield put(getUsersSuccess(result))
        if (action.data.payload.assigned_user_uuid === whoami.uuid) {
            const whoamiResult = yield call([api, api.users.whoami]);
            yield put(getWhoamiSuccess(whoamiResult))
        }
    }
    yield put(updateVehicleSuccess(action.data))
}

export function* watchUpdateVehicle() {
    yield throttle(300, UPDATE_VEHICLE_REQUEST, updateVehicle)
}

function* getVehicles() {
    const api = yield select(getApiControl);
    const result = yield call([api, api.vehicles.getVehicles]);
    yield put(getAllVehiclesSuccess(result))
}

export function* watchGetVehicles() {
    yield takeLatest(GET_VEHICLES_REQUEST, getVehicles)
}

function* getVehicle(action) {
    const api = yield select(getApiControl);
    const result = yield call([api, api.vehicles.getVehicle], action.data);
    yield put(getVehicleSuccess(result))
}

export function* watchVehicle() {
    yield takeLatest(GET_VEHICLE_REQUEST, getVehicle)
}
