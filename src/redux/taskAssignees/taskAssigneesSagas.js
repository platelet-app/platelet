import {call, put, select, takeEvery} from "redux-saga/effects";
import {setCurrentSessionTimeActiveToNow} from "../sessions/SessionsActions";
import {getApiControl} from "../Api";
import {
    ADD_TASK_ASSIGNED_RIDER_REQUEST,
    addTaskAssignedRiderFailure,
    addTaskAssignedRiderSuccess,
    GET_TASK_ASSIGNED_RIDERS_REQUEST,
    getTaskAssignedRidersFailure,
    getTaskAssignedRidersSuccess,
    REMOVE_TASK_ASSIGNED_RIDER_REQUEST,
    removeTaskAssignedRiderFailure,
    removeTaskAssignedRiderSuccess
} from "./taskAssigneesActions";
import {
    updateTaskAssignedRiderSuccess,
    updateTaskPatch, updateTaskPatchFromServer,
    updateTaskRemoveAssignedRiderSuccess,
    updateTaskSuccess
} from "../tasks/TasksActions";

function* addTaskAssignedRider(action) {
    try {
        yield put(setCurrentSessionTimeActiveToNow())
        const api = yield select(getApiControl);
        if (action.data.payload.patch_id) {
            yield put(updateTaskPatch({
                taskUUID: action.data.taskUUID,
                payload: {patch_id: action.data.payload.patch_id}
            }));
            delete action.data.payload.patch_id;
        }
        if (action.data.payload.user_uuid)
            yield call([api, api.tasks.addTaskAssignee], action.data.taskUUID, {user_uuid: action.data.payload.user_uuid});
        yield put(addTaskAssignedRiderSuccess(action.data))
        yield put(updateTaskAssignedRiderSuccess(action.data))
        yield put(updateTaskPatchFromServer(action.data))
    } catch (error) {
        yield put(addTaskAssignedRiderFailure(error))
    }
}

export function* watchUpdateTaskAddAssignedRider() {
    yield takeEvery(ADD_TASK_ASSIGNED_RIDER_REQUEST, addTaskAssignedRider)
}

function* updateTaskRemoveRider(action) {
    try {
        yield put(setCurrentSessionTimeActiveToNow())
        const api = yield select(getApiControl);
        if (action.data.payload.user_uuid)
            yield call([api, api.tasks.removeTaskAssignee], action.data.taskUUID, {user_uuid: action.data.payload.user_uuid});
        yield put(removeTaskAssignedRiderSuccess(action.data));
        yield put(updateTaskRemoveAssignedRiderSuccess(action.data));
        yield put(updateTaskPatchFromServer(action.data))
    } catch (error) {
        yield put(removeTaskAssignedRiderFailure(error));
    }
}

export function* watchUpdateTaskRemoveRider() {
    yield takeEvery( REMOVE_TASK_ASSIGNED_RIDER_REQUEST, updateTaskRemoveRider)
}

function* getTaskAssignedRiders(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.getTaskAssignees], action.data);
        yield put(getTaskAssignedRidersSuccess(result))
    } catch (error) {
        yield put(getTaskAssignedRidersFailure(error))
    }
}

export function* watchGetTaskAssignedRiders() {
    yield takeEvery( GET_TASK_ASSIGNED_RIDERS_REQUEST, getTaskAssignedRiders)
}
