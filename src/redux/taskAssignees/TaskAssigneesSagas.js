import {call, put, select, takeEvery} from "redux-saga/effects";
import {getApiControl, getTasksSelector, getUsersSelector} from "../Api";
import {
    addTaskAssignedCoordinatorActions,
    removeTaskAssignedRiderActions,
    addTaskAssignedRiderActions,
    removeTaskAssignedCoordinatorActions,
    addTaskAssignedCoordinatorFailure,
    addTaskAssignedCoordinatorSuccess,
    addTaskAssignedRiderFailure,
    addTaskAssignedRiderSuccess,
    getTaskAssignedRidersFailure,
    getTaskAssignedRidersSuccess,
    removeTaskAssignedCoordinatorFailure,
    removeTaskAssignedCoordinatorSuccess,
    removeTaskAssignedRiderFailure,
    removeTaskAssignedRiderSuccess, getTaskAssignedRidersActions
} from "./TaskAssigneesActions";
import {
    updateTaskPatchRequest
} from "../tasks/TasksActions";
import {findExistingTask} from "../../utilities";
import {displayInfoNotification} from "../notifications/NotificationsActions";
import {convertListDataToObjects} from "../redux_utilities";

function* addTaskAssignedRider(action) {
    try {
        const api = yield select(getApiControl);
        const currentTasks = yield select((state) => state.tasks.tasks);
        const currentTask = yield findExistingTask(currentTasks, action.data.taskUUID);
        const users = yield select(getUsersSelector);
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
            const newData = {...action.data, payload: {...action.data.payload, rider: users[action.data.payload.user_uuid]}}
            yield call([api, api.tasks.addTaskAssignedRider], action.data.taskUUID, {user_uuid: action.data.payload.user_uuid});
            yield put(addTaskAssignedRiderSuccess(newData))
            const user = users[action.data.payload.user_uuid]
            yield put(updateTaskPatchRequest(action.data.taskUUID, {patch_id: user.patch_id, patch: user.patch}))
        }
    } catch (error) {
        yield put(addTaskAssignedRiderFailure(error))
    }
}

export function* watchUpdateTaskAddAssignedRider() {
    yield takeEvery(addTaskAssignedRiderActions.request, addTaskAssignedRider)
}

function* updateTaskRemoveRider(action) {
    try {
        const api = yield select(getApiControl);
        if (action.data.payload.user_uuid) {
            yield call([api, api.tasks.removeTaskAssignedRider], action.data.taskUUID, {user_uuid: action.data.payload.user_uuid});
            yield put(removeTaskAssignedRiderSuccess(action.data));
            const tasks = yield select(getTasksSelector);
            const task = findExistingTask(tasks, action.data.taskUUID)
            if (task && task.assigned_riders && task.assigned_riders.length > 0) {
                const finalUser = task.assigned_riders[task.assigned_riders.length - 1];
                yield put(updateTaskPatchRequest(action.data.taskUUID, {patch_id: finalUser.patch_id, patch: finalUser.patch}))
            } else if (task) {
                yield put(updateTaskPatchRequest(action.data.taskUUID, {patch_id: null, patch: null}))
            }
        }
    } catch (error) {
        yield put(removeTaskAssignedRiderFailure(error));
    }
}

export function* watchUpdateTaskRemoveRider() {
    yield takeEvery( removeTaskAssignedRiderActions.request, updateTaskRemoveRider)
}

function* addTaskAssignedCoordinator(action) {
    try {
        const api = yield select(getApiControl);
        const users = yield select(getUsersSelector);
        if (action.data.payload.user_uuid) {
            yield call([api, api.tasks.addTaskAssignedCoordinator], action.data.taskUUID, {user_uuid: action.data.payload.user_uuid});
            yield put(addTaskAssignedCoordinatorSuccess({...action.data, payload: {...action.data.payload, user: users[action.data.payload.user_uuid]}}))
        }
    } catch (error) {
        yield put(addTaskAssignedCoordinatorFailure(error))
    }
}

export function* watchUpdateTaskAddAssignedCoordinator() {
    yield takeEvery(addTaskAssignedCoordinatorActions.request, addTaskAssignedCoordinator)
}

function* updateTaskRemoveCoordinator(action) {
    try {
        const api = yield select(getApiControl);
        if (action.data.payload.user_uuid) {
            yield call([api, api.tasks.removeTaskAssignedCoordinator], action.data.taskUUID, {user_uuid: action.data.payload.user_uuid});
            yield put(removeTaskAssignedCoordinatorSuccess(action.data));
        }
    } catch (error) {
        yield put(removeTaskAssignedCoordinatorFailure(error));
    }
}

export function* watchUpdateTaskRemoveCoordinator() {
    yield takeEvery( removeTaskAssignedCoordinatorActions.request, updateTaskRemoveCoordinator)
}

function* getTaskAssignedRiders(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.getTaskAssignedRiders], action.data.taskUUID);
        const converted = convertListDataToObjects(result);
        yield put(getTaskAssignedRidersSuccess(converted))
    } catch (error) {
        yield put(getTaskAssignedRidersFailure(error))
    }
}

export function* watchGetTaskAssignedRiders() {
    yield takeEvery( getTaskAssignedRidersActions.request, getTaskAssignedRiders)
}
