import {call, put, select, takeLatest} from "redux-saga/effects";
import {findExistingTask} from "../../utilities";
import {getApiControl} from "../Api";
import {getTaskSuccess, getTaskFailure, getTaskNotFound, getTaskActions} from "./ActiveTaskActions";

function* getTask(action) {
    try {
        const currentTasks = yield select((state) => state.tasks.tasks);
        let task = findExistingTask(currentTasks, action.data.taskUUID)
        if (task) {
            // if it's already in the list of tasks, no need to get it
            yield put(getTaskSuccess(task))
        } else {
            // not in the list so call the api
            const api = yield select(getApiControl);
            const result = yield call([api, api.tasks.getTask], action.data.taskUUID);
            yield put(getTaskSuccess(result))
        }
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(getTaskNotFound(error))
            }
        }
        yield put(getTaskFailure(error))
    }
}

export function* watchGetTask() {
    yield takeLatest(getTaskActions.request, getTask)
}

