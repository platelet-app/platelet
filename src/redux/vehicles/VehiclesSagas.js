import {throttle, call, put, takeEvery, takeLatest, select, debounce} from 'redux-saga/effects'
import {
    addVehicleSuccess,
    updateVehicleSuccess,
    getVehicleSuccess,
    restoreVehicleSuccess,
    deleteVehicleSuccess,
    getVehicleFailure,
    deleteVehicleFailure,
    restoreVehicleFailure,
    updateVehicleFailure,
    restoreVehicleRequest,
    addVehicleActions,
    addVehicleFailure,
    getVehiclesSuccess,
    getVehiclesFailure,
    getVehiclesActions,
    getVehicleActions,
    deleteVehicleActions,
    restoreVehicleActions,
    getVehicleNotFound,
    updateVehicleActions
} from "./VehiclesActions"

import {getWhoamiSuccess} from "../Actions"
import {getUsersSuccess} from "../users/UsersActions"
import {getApiControl, getWhoami} from "../Selectors";
import {displayInfoNotification} from "../notifications/NotificationsActions";
import {convertListDataToObjects} from "../redux_utilities";

function* postNewVehicle(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.vehicles.createVehicle], action.data.payload);
        const vehicle = {...action.data, "uuid": result.uuid, time_created: result.time_created || new Date()};
        yield put(addVehicleSuccess(vehicle));
    } catch (error) {
        yield put(addVehicleFailure(error));
    }
}

export function* watchPostNewVehicle() {
    yield takeEvery(addVehicleActions.request, postNewVehicle)
}

function* updateVehicle(action) {
    const api = yield select(getApiControl);
    try {
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
    } catch (error) {
        yield put(updateVehicleFailure(error))
    }
}

export function* watchUpdateVehicle() {
    yield takeEvery(updateVehicleActions.request, updateVehicle)
}

function* getVehicles() {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.vehicles.getVehicles]);
        const converted = convertListDataToObjects(result);
        yield put(getVehiclesSuccess(converted))
    } catch (error) {
        yield put(getVehiclesFailure(error))
    }
}

export function* watchGetVehicles() {
    yield takeLatest(getVehiclesActions.request, getVehicles)
}

function* getVehicle(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.vehicles.getVehicle], action.data.vehicleUUID);
        yield put(getVehicleSuccess(result))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(getVehicleNotFound(error))
            }
        }
        yield put(getVehicleFailure(error))
    }
}

export function* watchVehicle() {
    yield takeLatest(getVehicleActions.request, getVehicle)
}

function* deleteVehicle(action) {
    try {
        const restoreActions = () => [restoreVehicleRequest(action.data)];
        const api = yield select(getApiControl);
        yield call([api, api.vehicles.deleteVehicle], action.data);
        yield put(deleteVehicleSuccess(action.data))
        yield put(displayInfoNotification("Vehicle deleted", restoreActions))
    } catch (error) {
        yield put(deleteVehicleFailure(error))
    }
}

export function* watchDeleteVehicle() {
    yield takeEvery(deleteVehicleActions.request, deleteVehicle)
}

function* restoreVehicle(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.vehicles.restoreVehicle], action.data.vehicleUUID);
        const result = yield call([api, api.vehicles.getVehicle], action.data.vehicleUUID);
        yield put(restoreVehicleSuccess(result))
    } catch (error) {
        yield put(restoreVehicleFailure(error))
    }
}

export function* watchRestoreVehicle() {
    yield takeEvery(restoreVehicleActions.request, restoreVehicle)
}
