import {call, put, takeEvery, select} from 'redux-saga/effects'
import {getApiControl} from "../Api";
import {
    actionRecordsNotFound,
    GET_ACTIONS_RECORD_REQUEST, GET_TASKS_ACTIONS_RECORD_REQUEST,
    getActionsRecordFailure,
    getActionsRecordForbidden,
    getActionsRecordSuccess,
    getTasksActionsRecordFailure,
    getTasksActionsRecordForbidden,
    getTasksActionsRecordSuccess,
    tasksActionsRecordsNotFound
} from "./ActionsRecordActions";
import {sortByCreatedTime} from "../../utilities";

function* getActionsRecord(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.log.getRecords], action.data, "newest");
        const sorted = sortByCreatedTime(result);
        yield put(getActionsRecordSuccess(sorted))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(actionRecordsNotFound())
            }
        } else if (error.status_code === 403) {
            yield put(getActionsRecordForbidden(error))
        } else {
            yield put(getActionsRecordFailure(error))

        }
    }
}

export function* watchGetActionsRecord() {
    yield takeEvery(GET_ACTIONS_RECORD_REQUEST, getActionsRecord)
}

function* getTasksActionsRecord(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.log.getTasksRecords], action.data, "newest");
        yield put(getTasksActionsRecordSuccess(result))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(tasksActionsRecordsNotFound())
            }
        } else if (error.status_code === 403) {
            yield put(getTasksActionsRecordForbidden(error))
        } else {
            yield put(getTasksActionsRecordFailure(error))

        }
    }
}

export function* watchGetTasksActionsRecord() {
    yield takeEvery(GET_TASKS_ACTIONS_RECORD_REQUEST, getTasksActionsRecord)
}
