import { all, call, put, takeEvery , takeLatest} from 'redux-saga/effects'
import api from "./Api"
import {ADD_TASK, addTaskSuccess, UPDATE_TASK, updateTaskSuccess, GET_TASKS, getAllTasksSuccess} from "./Actions"


export function* postNewTask(action) {
    const result = yield call([api, api.tasks.createTask], action.data);
    const task = {...action.data, "uuid": result.uuid};
    yield put(addTaskSuccess(task))
}

export function* watchPostNewTask() {
    const action = yield takeEvery(ADD_TASK, postNewTask)
}

export function* updateTask(action) {
    const result = yield call([api, api.tasks.updateTask], action.data);
    yield put(updateTaskSuccess(action.data))
}

export function* watchUpdateTask() {
    const action = yield takeEvery(UPDATE_TASK, updateTask)
}

export function* getTasks(action) {
    const result = yield call([api, api.tasks.getTasks], action.data.session_id);
    yield put(getAllTasksSuccess(result))
}

export function* watchGetTasks() {
    const action = yield takeLatest(GET_TASKS, getTasks)
}

