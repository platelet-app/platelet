import {call, put, select, takeEvery} from "redux-saga/effects";
import {getApiControl} from "../Api";
import {
    ADD_TASK_ASSIGNED_COORDINATOR_REQUEST,
    ADD_TASK_ASSIGNED_RIDER_REQUEST, addTaskAssignedCoordinatorFailure, addTaskAssignedCoordinatorSuccess,
    addTaskAssignedRiderFailure,
    addTaskAssignedRiderSuccess,
    GET_TASK_ASSIGNED_RIDERS_REQUEST,
    getTaskAssignedRidersFailure,
    getTaskAssignedRidersSuccess, REMOVE_TASK_ASSIGNED_COORDINATOR_REQUEST,
    REMOVE_TASK_ASSIGNED_RIDER_REQUEST, removeTaskAssignedCoordinatorFailure, removeTaskAssignedCoordinatorSuccess,
    removeTaskAssignedRiderFailure,
    removeTaskAssignedRiderSuccess
} from "./TaskAssigneesActions";
import {
    updateTaskAssignedRiderSuccess,
    updateTaskPatchRequest, updateTaskPatchFromServer,
    updateTaskRemoveAssignedRiderSuccess,
    updateTaskAssignedCoordinatorSuccess, updateTaskRemoveAssignedCoordinatorSuccess
} from "../tasks/TasksActions";
import {findExistingTask} from "../../utilities";
import {displayInfoNotification} from "../notifications/NotificationsActions";

function* addTaskAssignedRider(action) {
    try {
        const api = yield select(getApiControl);
        const currentTasks = yield select((state) => state.tasks.tasks);
        const currentTask = yield findExistingTask(currentTasks, action.data.taskUUID);
        if (action.data.payload.patch_id) {
            yield put(updateTaskPatchRequest(
                action.data.taskUUID,
                {patch_id: action.data.payload.patch_id}
            ));
            delete action.data.payload.patch_id;
        }
        if (currentTask.assigned_riders.length === 0) {
            yield put(displayInfoNotification("Task marked as ACTIVE."))
        }
        if (action.data.payload.user_uuid) {
            yield call([api, api.tasks.addTaskAssignedRider], action.data.taskUUID, {user_uuid: action.data.payload.user_uuid});
            yield put(addTaskAssignedRiderSuccess(action.data))
            yield put(updateTaskAssignedRiderSuccess(action.data))
            yield put(updateTaskPatchFromServer(action.data.taskUUID))
        }
    } catch (error) {
        yield put(addTaskAssignedRiderFailure(error))
    }
}

export function* watchUpdateTaskAddAssignedRider() {
    yield takeEvery(ADD_TASK_ASSIGNED_RIDER_REQUEST, addTaskAssignedRider)
}

function* updateTaskRemoveRider(action) {
    try {
        const api = yield select(getApiControl);
        if (action.data.payload.user_uuid) {
            yield call([api, api.tasks.removeTaskAssignedRider], action.data.taskUUID, {user_uuid: action.data.payload.user_uuid});
            yield put(removeTaskAssignedRiderSuccess(action.data));
            yield put(updateTaskRemoveAssignedRiderSuccess(action.data));
            yield put(updateTaskPatchFromServer(action.data.taskUUID))
        }
    } catch (error) {
        yield put(removeTaskAssignedRiderFailure(error));
    }
}

export function* watchUpdateTaskRemoveRider() {
    yield takeEvery( REMOVE_TASK_ASSIGNED_RIDER_REQUEST, updateTaskRemoveRider)
}

function* addTaskAssignedCoordinator(action) {
    try {
        const api = yield select(getApiControl);
        if (action.data.payload.user_uuid) {
            yield call([api, api.tasks.addTaskAssignedCoordinator], action.data.taskUUID, {user_uuid: action.data.payload.user_uuid});
            yield put(addTaskAssignedCoordinatorSuccess(action.data))
            yield put(updateTaskAssignedCoordinatorSuccess(action.data))
        }
    } catch (error) {
        yield put(addTaskAssignedCoordinatorFailure(error))
    }
}

export function* watchUpdateTaskAddAssignedCoordinator() {
    yield takeEvery(ADD_TASK_ASSIGNED_COORDINATOR_REQUEST, addTaskAssignedCoordinator)
}

function* updateTaskRemoveCoordinator(action) {
    try {
        const api = yield select(getApiControl);
        if (action.data.payload.user_uuid) {
            yield call([api, api.tasks.removeTaskAssignedCoordinator], action.data.taskUUID, {user_uuid: action.data.payload.user_uuid});
            yield put(removeTaskAssignedCoordinatorSuccess(action.data));
            yield put(updateTaskRemoveAssignedCoordinatorSuccess(action.data));
        }
    } catch (error) {
        yield put(removeTaskAssignedCoordinatorFailure(error));
    }
}

export function* watchUpdateTaskRemoveCoordinator() {
    yield takeEvery( REMOVE_TASK_ASSIGNED_COORDINATOR_REQUEST, updateTaskRemoveCoordinator)
}

function* getTaskAssignedRiders(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.getTaskAssignedRiders], action.data);
        yield put(getTaskAssignedRidersSuccess(result))
    } catch (error) {
        yield put(getTaskAssignedRidersFailure(error))
    }
}

export function* watchGetTaskAssignedRiders() {
    yield takeEvery( GET_TASK_ASSIGNED_RIDERS_REQUEST, getTaskAssignedRiders)
}
