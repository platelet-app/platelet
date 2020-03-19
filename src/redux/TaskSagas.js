import { throttle, call, put, delay, take, fork, takeEvery , takeLatest, select, race, spawn} from 'redux-saga/effects'
import * as actions from "./Actions"
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
    UPDATE_TASK_PRIORITY,
    DELETE_TASK,
    DELETE_TASK_UNDO,
    DELETE_TASK_REQUEST,
    deleteTaskSuccess,
    GET_TASKS_REQUEST,
    getAllTasksSuccess,
    GET_MY_TASKS_REQUEST,
    getAllMyTasksSuccess,
    GET_TASK_REQUEST,
    getTaskSuccess} from "./Actions"

import { getApiControl } from "./Api"

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

export function* watchDeleteTaskUndoable() {
    const action = yield take(DELETE_TASK)
    yield spawn(deleteTaskUndoable, action);
}

export function* watchUndoDeleteTask() {
    const action = yield take(DELETE_TASK_UNDO)
    yield spawn(deleteTaskUndoable, action);
}

function* deleteTaskUndoable(action) {
    const api = yield select(getApiControl);

    const taskUUID = action.data.taskUUID;
    const undoId = `UNDO_TASK_${taskUUID}`;

    const task = { task_uuid: taskUUID, deleted: true };


    // optimistically mark the thread as `archived`
    yield put(actions.updateTaskSuccess(task));

    // allow the user 5 seconds to perform undo.
    // after 5 seconds, 'archive' will be the winner of the race-condition
    const { undo, doDelete } = yield race({
        undo: take(action => action.type === DELETE_TASK_UNDO && action.data.undoId === undoId),
        doDelete: delay(5000)
    });

    console.log("aaaaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAAAAAA")
    console.log(undo, doDelete)

    if (undo) {
        // revert thread to previous state
        // call undelete to api here?
        yield put(actions.updateTaskSuccess({ task_uuid: taskUUID, deleted: false }))
    } else if (doDelete) {
        // make the API call to apply the changes remotely
        yield call([api, api.tasks.deleteTask], taskUUID);
    }
}
