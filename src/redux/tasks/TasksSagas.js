import {
    debounce,
    call,
    put,
    delay,
    take,
    fork,
    takeEvery,
    takeLatest,
    select,
} from 'redux-saga/effects'
import {restoreTask as restoreTaskRequest} from "./TasksActions"
import {updateTaskRejectedTime as updateTaskRejectedTimeRequest} from "./TasksActions"
import {updateTaskCancelledTime as updateTaskCancelledTimeRequest} from "./TasksActions"
import {
    ADD_TASK_REQUEST,
    addTaskSuccess,
    UPDATE_TASK_REQUEST,
    updateTaskSuccess,
    RESTORE_TASK_REQUEST,
    restoreTaskSuccess,
    DELETE_TASK_REQUEST,
    deleteTaskSuccess,
    GET_TASKS_REQUEST,
    getAllTasksSuccess,
    GET_MY_TASKS_REQUEST,
    getAllMyTasksSuccess,
    GET_TASK_REQUEST,
    getTaskSuccess,
    updateTaskContactNameSuccess,
    updateTaskContactNumberSuccess,
    updateTaskPickupAddressSuccess,
    updateTaskDropoffAddressSuccess,
    updateTaskPickupTimeSuccess,
    updateTaskDropoffTimeSuccess,
    updateTaskAssignedRiderSuccess,
    updateTaskPrioritySuccess,
    updateTaskCancelledTimeSuccess,
    updateTaskRejectedTimeSuccess,
    getAllTasksNotFound,
    getAllTasksFailure,
    getAllMyTasksNotFound,
    getAllMyTasksFailure,
    updateTaskPatchSuccess,

    UPDATE_TASK_CONTACT_NUMBER_REQUEST,
    UPDATE_TASK_DROPOFF_ADDRESS_REQUEST,
    UPDATE_TASK_PICKUP_ADDRESS_REQUEST,
    UPDATE_TASK_CONTACT_NAME_REQUEST,
    UPDATE_TASK_PICKUP_TIME_REQUEST,
    UPDATE_TASK_DROPOFF_TIME_REQUEST,
    UPDATE_TASK_CANCELLED_TIME_REQUEST,
    UPDATE_TASK_REJECTED_TIME_REQUEST,
    UPDATE_TASK_PRIORITY_REQUEST,


    UPDATE_TASK_PATCH_REQUEST,
    REFRESH_TASKS_REQUEST,
    REFRESH_MY_TASKS_REQUEST,
    addTaskFailure,
    deleteTaskFailure,
    restoreTaskFailure,
    updateTaskFailure,
    updateTaskContactNameFailure,
    updateTaskContactNumberFailure,
    updateTaskPickupAddressFailure,
    updateTaskDropoffAddressFailure,
    updateTaskPickupTimeFailure,
    updateTaskDropoffTimeFailure,
    updateTaskAssignedRiderFailure,
    updateTaskPriorityFailure,
    updateTaskPatchFailure,
    updateTaskCancelledTimeFailure,
    updateTaskRejectedTimeFailure,
    getTaskFailure,
    setCurrentTask,
    updateTaskRemoveRiderSuccess,
    updateTaskRemoveRiderFailure,
    UPDATE_TASK_REMOVE_RIDER_REQUEST,
    UPDATE_TASK_PATCH_FROM_SERVER, UPDATE_TASK_FROM_SOCKET
} from "./TasksActions"
import {updateTaskPatch as updateTaskPatchAction} from "./TasksActions"


import {getApiControl} from "../Api"
import {setCurrentSession, setCurrentSessionTimeActiveToNow} from "../sessions/SessionsActions";
import {subscribeToUUID, unsubscribeFromUUID} from "../sockets/SocketActions";
import React from "react";
import Button from "@material-ui/core/Button";
import {restoreUser} from "../users/UsersActions";
import {displayInfoNotification} from "../notifications/NotificationsActions";
import {findExistingTask} from "../../utilities";

function* throttlePerKey(pattern, selector, timeout, saga) {
    const set = new Set()

    while (true) {
        const action = yield take(pattern)
        const id = selector(action)
        const throttled = set.has(id)
        if (throttled) {
            // Do nothing, action throttled
        } else {
            set.add(id)
            // Expire items after timeout
            yield fork(function* () {
                yield delay(timeout)
                set.delete(id)
            })
            yield call(saga, action)
        }
    }
}

function* postNewTask(action) {
    try {
        put(setCurrentSessionTimeActiveToNow())
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.createTask], action.data);
        const task = {...action.data, "uuid": result.uuid};
        yield put(setCurrentTask(task));
        yield put(addTaskSuccess(task));
        yield put(subscribeToUUID(task.uuid))
    } catch (error) {
        yield put(addTaskFailure(error))
    }
}

export function* watchPostNewTask() {
    yield takeEvery(ADD_TASK_REQUEST, postNewTask)
}

function* deleteTask(action) {
    try {
        const restoreAction = () => restoreTaskRequest(action.data);
        const api = yield select(getApiControl);
        yield call([api, api.tasks.deleteTask], action.data);
        yield put(deleteTaskSuccess(action.data))
        yield put(unsubscribeFromUUID(action.data))
        yield put(displayInfoNotification("Task deleted", restoreAction))
    } catch (error) {
        yield put(deleteTaskFailure(error))
    }
}

export function* watchDeleteTask() {
    yield takeEvery(DELETE_TASK_REQUEST, deleteTask)
}

function* restoreTask(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.tasks.restoreTask], action.data);
        const result = yield call([api, api.tasks.getTask], action.data);
        yield put(restoreTaskSuccess(result))
        yield put(subscribeToUUID(result.uuid))
    } catch (error) {
        yield put(restoreTaskFailure(error))
    }
}

export function* watchRestoreTask() {
    yield takeEvery(RESTORE_TASK_REQUEST, restoreTask)
}

function* updateTask(action) {
    try {
        yield put(setCurrentSessionTimeActiveToNow())
        const api = yield select(getApiControl);
        yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        yield put(updateTaskSuccess(action.data))
    } catch (error) {
        yield put(updateTaskFailure(error))
    }
}

function* updateTaskContactName(action) {
    try {
        yield put(setCurrentSessionTimeActiveToNow())
        const api = yield select(getApiControl);
        yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        yield put(updateTaskContactNameSuccess(action.data))
    } catch (error) {
        yield put(updateTaskContactNameFailure(error))
    }
}

function* updateTaskContactNumber(action) {
    try {
        yield put(setCurrentSessionTimeActiveToNow())
        const api = yield select(getApiControl);
        yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        yield put(updateTaskContactNumberSuccess(action.data))
    } catch (error) {
        yield put(updateTaskContactNumberFailure(error))
    }
}

function* updateTaskPickupAddress(action) {
    try {
        yield put(setCurrentSessionTimeActiveToNow())
        const api = yield select(getApiControl);
        yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        yield put(updateTaskPickupAddressSuccess(action.data))
    } catch (error) {
        yield put(updateTaskPickupAddressFailure(error))
    }
}

function* updateTaskDropoffAddress(action) {
    try {
        yield put(setCurrentSessionTimeActiveToNow())
        const api = yield select(getApiControl);
        yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        yield put(updateTaskDropoffAddressSuccess(action.data))
    } catch (error) {
        yield put(updateTaskDropoffAddressFailure(error))
    }
}

function* updateTaskPickupTime(action) {
    try {
        yield put(setCurrentSessionTimeActiveToNow())
        const api = yield select(getApiControl);
        yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        yield put(updateTaskPickupTimeSuccess(action.data))
    } catch (error) {
        yield put(updateTaskPickupTimeFailure(error))
    }
}

function* updateTaskDropoffTime(action) {
    try {
        yield put(setCurrentSessionTimeActiveToNow())
        const api = yield select(getApiControl);
        yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        yield put(updateTaskDropoffTimeSuccess(action.data))
    } catch (error) {
        yield put(updateTaskDropoffTimeFailure(error))
    }
}

function* updateTaskPriority(action) {
    try {
        yield put(setCurrentSessionTimeActiveToNow())
        const api = yield select(getApiControl);
        yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        yield put(updateTaskPrioritySuccess(action.data))
    } catch (error) {
        yield put(updateTaskPriorityFailure(error))
    }
}

function* updateTaskPatch(action) {
    try {
        yield put(setCurrentSessionTimeActiveToNow())
        const api = yield select(getApiControl);
        yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        yield put(updateTaskPatchSuccess(action.data))
    } catch (error) {
        yield put(updateTaskPatchFailure(error))
    }
}

function* updateTaskPatchFromServer(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.getTaskAssignees], action.data.taskUUID);
        const lastResult = result.slice(-1)[0]
        const payload = lastResult ? {patch: lastResult.patch, patch_id: lastResult.patch_id} : {
            patch: "",
            patch_id: null
        };
        yield put(updateTaskPatchAction({taskUUID: action.data.taskUUID, payload}))
    } catch (error) {
        yield put(updateTaskPatchFailure(error))
    }
}

function* updateTaskCancelledTime(action) {
    try {
        // get the current task rejected_time value to make sure it isn't already marked
        const currentTasks = yield select((state) => state.tasks.tasks);
        const {task} = yield findExistingTask(currentTasks, action.data.taskUUID)
        const currentValue = task ? task.time_cancelled : null;
        const restoreAction = () => updateTaskCancelledTimeRequest({ taskUUID: action.data.taskUUID, payload: {time_cancelled: null} });
        yield put(setCurrentSessionTimeActiveToNow())
        const api = yield select(getApiControl);
        yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        yield put(updateTaskCancelledTimeSuccess(action.data))
        if (currentValue === null)
            // only notify if marking rejected for the first time
            yield put(displayInfoNotification("Task marked cancelled", restoreAction))
    } catch (error) {
        yield put(updateTaskCancelledTimeFailure(error))
    }
}

function* updateTaskRejectedTime(action) {
    try {
        // get the current task rejected_time value to make sure it isn't already marked
        const currentTasks = yield select((state) => state.tasks.tasks);
        const {task} = yield findExistingTask(currentTasks, action.data.taskUUID)
        const currentValue = task ? task.time_rejected : null;
        const restoreAction = () => updateTaskRejectedTimeRequest({ taskUUID: action.data.taskUUID, payload: {time_rejected: null} });
        yield put(setCurrentSessionTimeActiveToNow())
        const api = yield select(getApiControl);
        yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        yield put(updateTaskRejectedTimeSuccess(action.data))
        if (currentValue === null)
            // only notify if marking rejected for the first time
            yield put(displayInfoNotification("Task marked rejected", restoreAction))
    } catch (error) {
        yield put(updateTaskRejectedTimeFailure(error))
    }
}

export function* watchUpdateTask() {
    yield takeEvery(UPDATE_TASK_REQUEST, updateTask)
}

export function* watchUpdateTaskContactName() {
    yield debounce(500, UPDATE_TASK_CONTACT_NAME_REQUEST, updateTaskContactName)
}

export function* watchUpdateTaskContactNumber() {
    yield debounce(500, UPDATE_TASK_CONTACT_NUMBER_REQUEST, updateTaskContactNumber)
}

export function* watchUpdateTaskPickupAddress() {
    yield debounce(500, UPDATE_TASK_PICKUP_ADDRESS_REQUEST, updateTaskPickupAddress)
}

export function* watchUpdateTaskDropoffAddress() {
    yield debounce(500, UPDATE_TASK_DROPOFF_ADDRESS_REQUEST, updateTaskDropoffAddress)
}

export function* watchUpdateTaskPickupTime() {
    yield debounce(300, UPDATE_TASK_PICKUP_TIME_REQUEST, updateTaskPickupTime)
}

export function* watchUpdateTaskDropoffTime() {
    yield debounce(300, UPDATE_TASK_DROPOFF_TIME_REQUEST, updateTaskDropoffTime)
}

export function* watchUpdateTaskPriority() {
    yield debounce(500, UPDATE_TASK_PRIORITY_REQUEST, updateTaskPriority)
}

export function* watchUpdateTaskPatch() {
    yield debounce(300, UPDATE_TASK_PATCH_REQUEST, updateTaskPatch)
}

export function* watchUpdateTaskPatchFromServer() {
    yield debounce(300, UPDATE_TASK_PATCH_FROM_SERVER, updateTaskPatchFromServer)
}

export function* watchUpdateTaskCancelledTime() {
    yield debounce(300, UPDATE_TASK_CANCELLED_TIME_REQUEST, updateTaskCancelledTime)
}

export function* watchUpdateTaskRejectedTime() {
    yield debounce(300, UPDATE_TASK_REJECTED_TIME_REQUEST, updateTaskRejectedTime)
}

function* getTask(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.getTask], action.data);
        yield put(getTaskSuccess(result))
    } catch (error) {
        yield put(getTaskFailure(error))
    }
}

export function* watchGetTask() {
    yield takeLatest(GET_TASK_REQUEST, getTask)
}

function* getTasks(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.getTasks], action.data);
        yield put(getAllTasksSuccess(result))
    } catch (error) {
        if (error.name === "HttpError") {
            if (error.response.status === 404) {
                yield put(getAllTasksNotFound(error))
            }
        }
        yield put(getAllTasksFailure(error))
    }
}

export function* watchGetTasks() {
    yield takeLatest(GET_TASKS_REQUEST, getTasks)
}

function* refreshTasks(action) {
    try {
        const api = yield select(getApiControl);
        let result = yield call([api, api.tasks.getTasks], action.data);
        yield put(getAllTasksSuccess(result))
    } catch (error) {
        if (error.name === "HttpError") {
            if (error.response.status === 404) {
                yield put(getAllTasksNotFound(error))
            }
        }
        yield put(getAllTasksFailure(error))
    }
}

export function* watchRefreshTasks() {
    yield takeLatest(REFRESH_TASKS_REQUEST, refreshTasks)
}

function* getMyTasks() {
    try {
        const api = yield select(getApiControl);
        const whoami = yield call([api, api.users.whoami]);
        const result = yield call([api, api.users.getAssignedTasks], whoami.uuid);
        yield put(getAllMyTasksSuccess(result))
    } catch (error) {
        if (error.name === "HttpError") {
            if (error.response.status === 404) {
                yield put(getAllMyTasksNotFound(error))
            }
        }
        yield put(getAllMyTasksFailure(error))
    }
}

export function* watchGetMyTasks() {
    yield takeLatest(GET_MY_TASKS_REQUEST, getMyTasks)
}

export function* watchRefreshMyTasks() {
    yield takeLatest(REFRESH_MY_TASKS_REQUEST, getMyTasks)
}
