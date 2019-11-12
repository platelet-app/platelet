import { all, call, put, takeEvery } from 'redux-saga/effects'
import api from "./Api"
import {ADD_TASK, addTaskSuccess} from "./Actions"


export function* postNewTask(action) {
    const result = yield call([api, api.tasks.createTask], action.data);
    const task = {...action.data, "uuid": result.uuid};
    yield put(addTaskSuccess(task))
}

export function* watchPostNewTask() {
    const action = yield takeEvery(ADD_TASK, postNewTask)
}

// single entry point to start all Sagas at once
export default function* rootSaga() {
    yield all([
        call(watchPostNewTask)
    ])
}
