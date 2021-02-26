import {call, put, select, takeEvery} from "redux-saga/effects";
import {getApiControl, getPresetLocations, getTasksSelector} from "../Api";
import {
    addNewDropoffLocationAndSetTaskActions,
    addNewDropoffLocationAndSetTaskFailure,
    addNewDropoffLocationAndSetTaskSuccess,
    addNewPickupLocationAndSetTaskActions,
    addNewPickupLocationAndSetTaskFailure,
    addNewPickupLocationAndSetTaskSuccess,
    setTaskDropoffDestinationActions,
    setTaskDropoffDestinationFailure,
    setTaskDropoffDestinationRequest,
    setTaskDropoffDestinationSuccess,
    setTaskPickupDestinationActions,
    setTaskPickupDestinationFailure,
    setTaskPickupDestinationRequest,
    setTaskPickupDestinationSuccess,
    unsetTaskDropoffDestinationActions,
    unsetTaskDropoffDestinationFailure,
    unsetTaskDropoffDestinationSuccess,
    unsetTaskPickupDestinationActions,
    unsetTaskPickupDestinationFailure,
    unsetTaskPickupDestinationSuccess,
    updateDropoffLocationAndUpdateTaskActions,
    updateDropoffLocationAndUpdateTaskFailure,
    updatePickupLocationAndUpdateTaskActions,
    updatePickupLocationAndUpdateTaskFailure,
    updateTaskPickupLocationAndUpdateTaskFailure,
} from "./TaskDestinationsActions";
import {updateLocationRequest} from "../locations/LocationsActions";
import {findExistingTask} from "../../utilities";

function* setTaskPickupDestination(action) {
    try {
        const api = yield select(getApiControl);
        const locations = yield select(getPresetLocations);
        const result = yield call([api, api.tasks.putTaskDestination], action.data.taskUUID, action.data.payload);
        let locationData;
        if (locations[action.data.payload.pickup_location_uuid]) {
            locationData = locations[action.data.payload.pickup_location_uuid];
        } else {
            locationData = yield call([api, api.locations.getLocation], action.data.payload.pickup_location_uuid);
        }
        if (locationData)
            yield put(setTaskPickupDestinationSuccess({
                    taskUUID: action.data.taskUUID,
                    payload: {etag: result.etag, pickup_location: locationData}
                }
            ))
    } catch (error) {
        yield put(setTaskPickupDestinationFailure(error))
    }
}

function* unsetTaskPickupDestination(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.deleteTaskPickupDestination], action.data.taskUUID);
        yield put(unsetTaskPickupDestinationSuccess(
            {
                taskUUID: action.data.taskUUID,
                payload: {etag: result.etag, pickup_location: null}
            }
        ))
    } catch (error) {
        yield put(unsetTaskPickupDestinationFailure(error))
    }
}

export function* watchUnsetTaskPickupDestination() {
    yield takeEvery(unsetTaskPickupDestinationActions.request, unsetTaskPickupDestination)
}

export function* watchSetTaskPickupDestination() {
    yield takeEvery(setTaskPickupDestinationActions.request, setTaskPickupDestination)
}

function* addNewPickupLocationAndSetTask(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.locations.createLocation], action.data.payload);
        yield put(setTaskPickupDestinationRequest(action.data.taskUUID, result.uuid));
        yield put(addNewPickupLocationAndSetTaskSuccess());
    } catch (error) {
        yield put(addNewPickupLocationAndSetTaskFailure(error));
    }
}

export function* watchAddNewPickupLocationAndSetTask() {
    yield takeEvery(addNewPickupLocationAndSetTaskActions.request, addNewPickupLocationAndSetTask);
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
            const result = yield call([api, api.tasks.putTaskDestination], action.data.taskUUID, {pickup_location_uuid: task.pickup_location.uuid});
            yield put(setTaskPickupDestinationSuccess({
                taskUUID: action.data.taskUUID,
                payload: {etag: result.etag, pickup_location: {...task.pickup_location, ...action.data.payload}}
            }));
        }
    } catch (error) {
        yield put(updatePickupLocationAndUpdateTaskFailure(error))
    }
}

export function* watchUpdatePickupLocationAndUpdateTask() {
    yield takeEvery(updatePickupLocationAndUpdateTaskActions.request, updatePickupLocationAndUpdateTask)
}

function* setTaskDropoffDestination(action) {
    try {
        const api = yield select(getApiControl);
        const locations = yield select(getPresetLocations);
        const result = yield call([api, api.tasks.putTaskDestination], action.data.taskUUID, action.data.payload);
        let locationData;
        if (locations[action.data.payload.dropoff_location_uuid]) {
            locationData = locations[action.data.payload.dropoff_location_uuid];
        } else {
            locationData = yield call([api, api.locations.getLocation], action.data.payload.dropoff_location_uuid);
        }
        if (locationData) {
            yield put(setTaskDropoffDestinationSuccess({
                    taskUUID: action.data.taskUUID,
                    payload: {etag: result.etag, dropoff_location: locationData}
                }
            ))
        }
    } catch (error) {
        yield put(setTaskDropoffDestinationFailure(error))
    }
}

export function* watchSetTaskDropoffDestination() {
    yield takeEvery(setTaskDropoffDestinationActions.request, setTaskDropoffDestination)
}

function* unsetTaskDropoffDestination(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.deleteTaskDropoffDestination], action.data.taskUUID);
        yield put(unsetTaskDropoffDestinationSuccess({
                taskUUID: action.data.taskUUID,
                payload: {etag: result.etag, dropoff_location: null}
            }
        ))
    } catch (error) {
        yield put(unsetTaskDropoffDestinationFailure(error))
    }
}

export function* watchUnsetTaskDropoffDestination() {
    yield takeEvery(unsetTaskDropoffDestinationActions.request, unsetTaskDropoffDestination)
}

function* addNewDropoffLocationAndSetTask(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.locations.createLocation], action.data.payload);
        yield put(setTaskDropoffDestinationRequest(action.data.taskUUID, result.uuid));
        yield put(addNewDropoffLocationAndSetTaskSuccess());
    } catch (error) {
        yield put(addNewDropoffLocationAndSetTaskFailure(error));
    }
}

export function* watchAddNewDropoffLocationAndSetTask() {
    yield takeEvery(addNewDropoffLocationAndSetTaskActions.request, addNewDropoffLocationAndSetTask);
}

function* updateDropoffLocationAndUpdateTask(action) {
    try {
        const api = yield select(getApiControl);
        const tasks = yield select(getTasksSelector);
        let task = yield findExistingTask(tasks, action.data.taskUUID)
        if (!task) {
            task = yield call([api, api.tasks.getTask], action.data.taskUUID);
        }
        if (task) {
            yield put(updateLocationRequest(task.dropoff_location.uuid, action.data.payload))
            const result = yield call([api, api.tasks.putTaskDestination], action.data.taskUUID, {dropoff_location_uuid: task.dropoff_location.uuid});
            yield put(setTaskDropoffDestinationSuccess({
                taskUUID: action.data.taskUUID,
                payload: {etag: result.etag, dropoff_location: {...task.dropoff_location, ...action.data.payload}}
            }));
        }
    } catch (error) {
        yield put(updateDropoffLocationAndUpdateTaskFailure(error))
    }
}

export function* watchUpdateDropoffLocationAndUpdateTask() {
    yield takeEvery(updateDropoffLocationAndUpdateTaskActions.request, updateDropoffLocationAndUpdateTask)
}

