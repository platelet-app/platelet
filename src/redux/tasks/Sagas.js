import { throttle, debounce, call, put, delay, take, fork, takeEvery , takeLatest, select, race, spawn} from 'redux-saga/effects'
import {
    ADD_TASK_REQUEST,
    addTaskSuccess,
    UPDATE_TASK_REQUEST,
    updateTaskSuccess,
    UPDATE_TASK_ASSIGNED_RIDER_REQUEST,
    UPDATE_TASK_CONTACT_NUMBER_REQUEST,
    UPDATE_TASK_DROPOFF_ADDRESS_REQUEST,
    UPDATE_TASK_PICKUP_ADDRESS_REQUEST,
    UPDATE_TASK_CONTACT_NAME_REQUEST,
    UPDATE_TASK_PICKUP_TIME_REQUEST,
    UPDATE_TASK_DROPOFF_TIME_REQUEST,
    UPDATE_TASK_CANCELLED_TIME_REQUEST,
    UPDATE_TASK_REJECTED_TIME_REQUEST,
    UPDATE_TASK_PRIORITY_REQUEST,
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
    updateTaskRejectedTimeSuccess
} from "./Actions"

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
function* updateTaskContactName(action) {
    const api = yield select(getApiControl);
    yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
    yield put(updateTaskContactNameSuccess(action.data))
}
function* updateTaskContactNumber(action) {
    const api = yield select(getApiControl);
    yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
    yield put(updateTaskContactNumberSuccess(action.data))
}
function* updateTaskPickupAddress(action) {
    const api = yield select(getApiControl);
    yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
    yield put(updateTaskPickupAddressSuccess(action.data))
}
function* updateTaskDropoffAddress(action) {
    const api = yield select(getApiControl);
    yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
    yield put(updateTaskDropoffAddressSuccess(action.data))
}
function* updateTaskPickupTime(action) {
    const api = yield select(getApiControl);
    yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
    yield put(updateTaskPickupTimeSuccess(action.data))
}
function* updateTaskDropoffTime(action) {
    const api = yield select(getApiControl);
    yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
    yield put(updateTaskDropoffTimeSuccess(action.data))
}
function* updateTaskAssignedRider(action) {
    const api = yield select(getApiControl);
    yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
    yield put(updateTaskAssignedRiderSuccess(action.data))
}
function* updateTaskPriority(action) {
    const api = yield select(getApiControl);
    yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
    yield put(updateTaskPrioritySuccess(action.data))
}
function* updateTaskCancelledTime(action) {
    const api = yield select(getApiControl);
    yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
    yield put(updateTaskCancelledTimeSuccess(action.data))
}
function* updateTaskRejectedTime(action) {
    const api = yield select(getApiControl);
    yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
    yield put(updateTaskRejectedTimeSuccess(action.data))
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
    yield takeEvery(UPDATE_TASK_PICKUP_TIME_REQUEST, updateTaskPickupTime)
}
export function* watchUpdateTaskDropoffTime() {
    yield takeEvery(UPDATE_TASK_DROPOFF_TIME_REQUEST, updateTaskDropoffTime)
}
export function* watchUpdateTaskAssignedRider() {
    yield takeEvery(UPDATE_TASK_ASSIGNED_RIDER_REQUEST, updateTaskAssignedRider)
}
export function* watchUpdateTaskPriority() {
    yield takeEvery(UPDATE_TASK_PRIORITY_REQUEST, updateTaskPriority)
}
export function* watchUpdateTaskCancelledTime() {
    yield takeEvery(UPDATE_TASK_CANCELLED_TIME_REQUEST, updateTaskCancelledTime)
}
export function* watchUpdateTaskRejectedTime() {
    yield takeEvery(UPDATE_TASK_REJECTED_TIME_REQUEST, updateTaskRejectedTime)
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

