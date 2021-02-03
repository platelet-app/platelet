import {call, put, select, takeEvery} from "redux-saga/effects";
import {getApiControl} from "../Api";
import {
    SET_TASK_DROPOFF_DESTINATION_REQUEST,
    SET_TASK_PICKUP_DESTINATION_REQUEST,
    setTaskPickupDestinationFailure,
    setTaskPickupDestinationSuccess
} from "./TaskDestinationsActions";
import {updateTaskDropoffAddressSuccess, updateTaskPickupAddressSuccess} from "../tasks/TasksActions";

function* setTaskPickupDestination(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.putTaskPickupDestination], action.data.taskUUID, action.data.payload);
        const locationData = yield call([api, api.locations.getLocation], action.data.payload.location_uuid);
        yield put(setTaskPickupDestinationSuccess(result))
        if (locationData)
            yield put(updateTaskPickupAddressSuccess({taskUUID: action.data.taskUUID, payload: {etag: result.etag, pickup_address: locationData.address}}))
    } catch(error) {
        yield put(setTaskPickupDestinationFailure(error))
    }
}

export function* watchSetTaskPickupDestination() {
    yield takeEvery(SET_TASK_PICKUP_DESTINATION_REQUEST, setTaskPickupDestination)
}

function* setTaskDropoffDestination(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.putTaskDropoffDestination], action.data.taskUUID, action.data.payload);
        const locationData = yield call([api, api.locations.getLocation], action.data.payload.location_uuid);
        yield put(setTaskPickupDestinationSuccess(result))
        if (locationData)
            yield put(updateTaskDropoffAddressSuccess({taskUUID: action.data.taskUUID, payload: {etag: result.etag, dropoff_address: locationData.address}}))
    } catch(error) {
        yield put(setTaskPickupDestinationFailure(error))
    }
}

export function* watchSetTaskDropoffDestination() {
    yield takeEvery(SET_TASK_DROPOFF_DESTINATION_REQUEST, setTaskDropoffDestination)
}
