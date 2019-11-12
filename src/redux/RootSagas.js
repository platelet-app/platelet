import { watchPostNewSession} from "./SessionSagas"
import { watchPostNewTask} from "./TaskSagas"
import { all, call } from 'redux-saga/effects'

export default function* rootSaga() {
    yield all([
        call(watchPostNewSession),
        call(watchPostNewTask)
    ])
}
