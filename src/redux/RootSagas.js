import {watchGetSessions, watchPostNewSession} from "./SessionSagas"
import {watchPostNewTask, watchGetTasks, watchUpdateTask} from "./TaskSagas"
import { all, call } from 'redux-saga/effects'

export default function* rootSaga() {
    yield all([
        call(watchPostNewSession),
        call(watchPostNewTask),
        call(watchGetSessions),
        call(watchGetTasks),
        call(watchUpdateTask)
    ])
}
