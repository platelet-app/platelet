import {call, put, select, takeEvery} from "redux-saga/effects";
import {getApiControl, getPresetLocations, getTasksSelector} from "../Api";
import {
    ADD_NEW_PICKUP_LOCATION_AND_SET_TASK,
    SET_TASK_DROPOFF_DESTINATION_REQUEST,
    SET_TASK_PICKUP_DESTINATION_REQUEST,
    setTaskDropoffDestinationFailure,
    setTaskDropoffDestinationSuccess,
    setTaskPickupDestinationFailure, setTaskPickupDestinationRequest,
    setTaskPickupDestinationSuccess,
    UNSET_TASK_DROPOFF_DESTINATION_REQUEST,
    UNSET_TASK_PICKUP_DESTINATION_REQUEST,
    unsetTaskDropoffDestinationFailure,
    unsetTaskDropoffDestinationSuccess,
    unsetTaskPickupDestinationFailure,
    unsetTaskPickupDestinationSuccess, UPDATE_TASK_PICKUP_LOCATION_AND_UPDATE_TASK
} from "./TaskDestinationsActions";
import {updateTaskDropoffAddressSuccess, updateTaskPickupAddressSuccess} from "../tasks/TasksActions";
import {updateLocationRequest} from "../locations/LocationsActions";
import {findExistingTask} from "../../utilities";
import {getTaskRequest} from "../activeTask/ActiveTaskActions";

function* setTaskPickupDestination(action) {
    try {
        const api = yield select(getApiControl);
        const locations = yield select(getPresetLocations);
        const result = yield call([api, api.tasks.putTaskPickupDestination], action.data.taskUUID, action.data.payload);
        let locationData;
        if (locations[action.data.payload.location_uuid]) {
            locationData = locations[action.data.payload.location_uuid];
        } else {
            locationData = yield call([api, api.locations.getLocation], action.data.payload.location_uuid);
        }
        yield put(setTaskPickupDestinationSuccess(result))
        if (locationData)
            yield put(updateTaskPickupAddressSuccess({
                taskUUID: action.data.taskUUID,
                payload: {etag: result.etag, pickup_location: locationData}
            }))
    } catch (error) {
        yield put(setTaskPickupDestinationFailure(error))
    }
}

export function* watchSetTaskPickupDestination() {
    yield takeEvery(SET_TASK_PICKUP_DESTINATION_REQUEST, setTaskPickupDestination)
}

function* setTaskDropoffDestination(action) {
    try {
        const api = yield select(getApiControl);
        const locations = yield select(getPresetLocations);
        const result = yield call([api, api.tasks.putTaskDropoffDestination], action.data.taskUUID, action.data.payload);
        let locationData;
        if (locations[action.data.payload.location_uuid]) {
            locationData = locations[action.data.payload.location_uuid];
        } else {
            locationData = yield call([api, api.locations.getLocation], action.data.payload.location_uuid);
        }
        yield put(setTaskDropoffDestinationSuccess(result))
        if (locationData) {
            yield put(updateTaskDropoffAddressSuccess({
                taskUUID: action.data.taskUUID,
                payload: {etag: result.etag, dropoff_location: locationData}
            }))
        }
    } catch (error) {
        yield put(setTaskDropoffDestinationFailure(error))
    }
}

export function* watchSetTaskDropoffDestination() {
    yield takeEvery(SET_TASK_DROPOFF_DESTINATION_REQUEST, setTaskDropoffDestination)
}

function* unsetTaskDropoffDestination(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.deleteTaskDropoffDestination], action.data.taskUUID);
        yield put(unsetTaskDropoffDestinationSuccess(result))
        yield put(updateTaskDropoffAddressSuccess({
            taskUUID: action.data.taskUUID,
            payload: {etag: result.etag, dropoff_location: null}
        }))
    } catch (error) {
        yield put(unsetTaskDropoffDestinationFailure(error))
    }
}

export function* watchUnsetTaskDropoffDestination() {
    yield takeEvery(UNSET_TASK_DROPOFF_DESTINATION_REQUEST, unsetTaskDropoffDestination)
}

function* unsetTaskPickupDestination(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.deleteTaskPickupDestination], action.data.taskUUID);
        yield put(unsetTaskPickupDestinationSuccess(result))
        yield put(updateTaskPickupAddressSuccess({
            taskUUID: action.data.taskUUID,
            payload: {etag: result.etag, pickup_location: null}
        }))
    } catch (error) {
        yield put(unsetTaskPickupDestinationFailure(error))
    }
}

export function* watchUnsetTaskPickupDestination() {
    yield takeEvery(UNSET_TASK_PICKUP_DESTINATION_REQUEST, unsetTaskPickupDestination)
}

function* createNewPickupLocationAndSetTask(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.locations.createLocation], action.data.payload);
        yield put(setTaskPickupDestinationRequest(action.data.taskUUID, result.uuid))
    } catch (error) {
        //TODO catch error
    }
}

export function* watchCreateNewPickupLocationAndSetTask() {
    yield takeEvery(ADD_NEW_PICKUP_LOCATION_AND_SET_TASK, createNewPickupLocationAndSetTask)
}

function* updatePickupLocationAndUpdateTask(action) {
    try {
        const api = yield select(getApiControl);
        const tasks = yield select(getTasksSelector);
        let task = yield findExistingTask(tasks, action.data.taskUUID)
        if (!task) {
            task = yield call([api, api.tasks.getTask], action.data.taskUUID);
        }
        if (task) {
            yield put(updateLocationRequest(task.pickup_location.uuid, action.data.payload))
            const result = yield call([api, api.tasks.putTaskPickupDestination], action.data.taskUUID, {location_uuid: task.pickup_location.uuid});
            yield put(updateTaskPickupAddressSuccess({
                taskUUID: action.data.taskUUID,
                payload: {etag: result.etag, pickup_location: {...task.pickup_location, ...action.data.payload}}
            }));
        }
    } catch (error) {
        throw error
        //TODO catch error
    }
}

export function* watchUpdatePickupLocationAndUpdateTask() {
    yield takeEvery(UPDATE_TASK_PICKUP_LOCATION_AND_UPDATE_TASK, updatePickupLocationAndUpdateTask)
}

