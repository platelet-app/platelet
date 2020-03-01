import { throttle, call, put, takeEvery , takeLatest, select} from 'redux-saga/effects'
import {ADD_TASK_REQUEST,
    addTaskSuccess,
    UPDATE_TASK_REQUEST,
    updateTaskSuccess,
    DELETE_TASK_REQUEST,
    deleteTaskSuccess,
    GET_TASKS_REQUEST,
    getAllTasksSuccess,
    GET_MY_TASKS_REQUEST,
    getAllMyTasksSuccess,
    GET_TASK_REQUEST,
    getTaskSuccess} from "./Actions"

import { getApiControl } from "./Api"

export function* postNewTask(action) {
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

export function* updateTask(action) {
    // TODO: make this unnecessary
    const api = yield select(getApiControl);
    if (action.data.payload.priority)
        delete action.data.payload.priority;

    yield call([api, api.tasks.updateTask], action.data.taskId, action.data.payload);
    yield put(updateTaskSuccess(action.data))
}

export function* watchUpdateTask() {
    yield throttle(300, UPDATE_TASK_REQUEST, updateTask)
}

export function* getTask(action) {
    const api = yield select(getApiControl);
    const result = yield call([api, api.tasks.getTask], action.data.task_id);
    yield put(getTaskSuccess(result))
}

export function* watchGetTask() {
    yield takeLatest(GET_TASK_REQUEST, getTask)
}

export function* getTasks(action) {
    const api = yield select(getApiControl);
    const result = yield call([api, api.tasks.getTasks], action.data);
    yield put(getAllTasksSuccess(result))
}

export function* watchGetTasks() {
    yield takeLatest(GET_TASKS_REQUEST, getTasks)
}

export function* getMyTasks(action) {
    const api = yield select(getApiControl);
    const whoami = yield call([api, api.users.whoami]);
    const result = yield call([api, api.users.getAssignedTasks], whoami.uuid);
    yield put(getAllMyTasksSuccess(result))
}

export function* watchGetMyTasks() {
    yield takeLatest(GET_MY_TASKS_REQUEST, getMyTasks)
}

