import { throttle, call, put, delay, take, fork, takeEvery , takeLatest, select, race, spawn} from 'redux-saga/effects'
import {ADD_TASK_REQUEST,
    addTaskSuccess,
    UPDATE_TASK_REQUEST,
    updateTaskSuccess,
    UPDATE_TASK_ASSIGNED_RIDER,
    UPDATE_TASK_CONTACT_NUMBER,
    UPDATE_TASK_DROPOFF_ADDRESS,
    UPDATE_TASK_PICKUP_ADDRESS,
    UPDATE_TASK_CONTACT_NAME,
    UPDATE_TASK_PICKUP_TIME,
    UPDATE_TASK_DROPOFF_TIME,
    UPDATE_TASK_CANCELLED_TIME,
    UPDATE_TASK_REJECTED_TIME,
    UPDATE_TASK_PRIORITY,
    RESTORE_TASK_REQUEST,
    restoreTaskSuccess,
    DELETE_TASK_REQUEST,
    deleteTaskSuccess,
    GET_TASKS_REQUEST,
    getAllTasksSuccess,
    GET_MY_TASKS_REQUEST,
    getAllMyTasksSuccess,
    GET_TASK_REQUEST,
    getTaskSuccess} from "./Actions"

import { getApiControl } from "../Api"

function* throttlePerKey(pattern, selector, timeout, saga) {
    const set = new Set()

    while(true) {
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
    const api = yield select(getApiControl);
    const result = yield call([api, api.tasks.createTask], action.data);
    const task = {...action.data, "uuid": result.uuid};
    yield put(addTaskSuccess(task))
}

export function* watchPostNewTask() {
    yield takeEvery(ADD_TASK_REQUEST, postNewTask)
}

function* deleteTask(action) {
    const api = yield select(getApiControl);
    yield call([api, api.tasks.deleteTask], action.data);
    yield put(deleteTaskSuccess(action.data))
}

export function* watchDeleteTask() {
    yield takeEvery(DELETE_TASK_REQUEST, deleteTask)
}

function* restoreTask(action) {
    const api = yield select(getApiControl);
    yield call([api, api.tasks.restoreTask], action.data);
    const result = yield call([api, api.tasks.getTask], action.data);
    yield put(restoreTaskSuccess(result))
}

export function* watchRestoreTask() {
    yield takeEvery(RESTORE_TASK_REQUEST, restoreTask)
}


function* updateTask(action) {
    const api = yield select(getApiControl);
    yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
    yield put(updateTaskSuccess(action.data))
}

export function* watchUpdateTask() {
    yield takeEvery(UPDATE_TASK_REQUEST, updateTask)
}
export function* watchUpdateTaskContactName() {
    yield throttle(500, UPDATE_TASK_CONTACT_NAME, updateTask)
}
export function* watchUpdateTaskContactNumber() {
    yield throttle(500, UPDATE_TASK_CONTACT_NUMBER, updateTask)
}
export function* watchUpdateTaskPickupAddress() {
    yield throttle(500, UPDATE_TASK_PICKUP_ADDRESS, updateTask)
}
export function* watchUpdateTaskDropoffAddress() {
    yield throttle(500, UPDATE_TASK_DROPOFF_ADDRESS, updateTask)
}
export function* watchUpdateTaskPickupTime() {
    yield throttle(500, UPDATE_TASK_PICKUP_TIME, updateTask)
}
export function* watchUpdateTaskDropoffTime() {
    yield throttle(500, UPDATE_TASK_DROPOFF_TIME, updateTask)
}
export function* watchUpdateTaskAssignedRider() {
    yield throttle(500, UPDATE_TASK_ASSIGNED_RIDER, updateTask)
}
export function* watchUpdateTaskPriority() {
    yield throttle(500, UPDATE_TASK_PRIORITY, updateTask)
}
export function* watchUpdateTaskCancelledTime() {
    yield throttle(500, UPDATE_TASK_CANCELLED_TIME, updateTask)
}
export function* watchUpdateTaskRejectedTime() {
    yield throttle(500, UPDATE_TASK_REJECTED_TIME, updateTask)
}

function* getTask(action) {
    const api = yield select(getApiControl);
    const result = yield call([api, api.tasks.getTask], action.data.task_uuid);
    yield put(getTaskSuccess(result))
}

export function* watchGetTask() {
    yield takeLatest(GET_TASK_REQUEST, getTask)
}

function* getTasks(action) {
    const api = yield select(getApiControl);
    const result = yield call([api, api.tasks.getTasks], action.data);
    yield put(getAllTasksSuccess(result))
}

export function* watchGetTasks() {
    yield takeLatest(GET_TASKS_REQUEST, getTasks)
}

function* getMyTasks() {
    const api = yield select(getApiControl);
    const whoami = yield call([api, api.users.whoami]);
    const result = yield call([api, api.users.getAssignedTasks], whoami.uuid);
    yield put(getAllMyTasksSuccess(result))
}

export function* watchGetMyTasks() {
    yield takeLatest(GET_MY_TASKS_REQUEST, getMyTasks)
}

