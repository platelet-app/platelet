import {call, put, takeEvery, select} from 'redux-saga/effects'
import {getApiControl} from "../Selectors";
import * as actionRecordActions from "./ActionsRecordActions";
import {sortByCreatedTime} from "../../utilities";

function* getActionsRecord(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.log.getRecords], action.data.uuid, "newest");
        const sorted = yield call(sortByCreatedTime, result);
        yield put(actionRecordActions.getActionsRecordSuccess(sorted))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(actionRecordActions.getActionsRecordNotFound(error))
            } else if (error.status_code === 403) {
                yield put(actionRecordActions.getActionsRecordForbidden(error))
            }
        }
        yield put(actionRecordActions.getActionsRecordFailure(error))
    }
}

export function* watchGetActionsRecord() {
    yield takeEvery(actionRecordActions.getActionsRecordActions.request, getActionsRecord)
}

function* getTasksActionsRecord(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.log.getTasksRecords], action.data.userUUID, "newest");
        yield put(actionRecordActions.getTasksActionsRecordSuccess(result))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(actionRecordActions.getTasksActionsRecordNotFound(error))
            } else if (error.status_code === 403) {
                yield put(actionRecordActions.getTasksActionsRecordForbidden(error))
            }
        }
        yield put(actionRecordActions.getTasksActionsRecordFailure(error))
    }
}

export function* watchGetTasksActionsRecord() {
    yield takeEvery(actionRecordActions.getTasksActionsRecordActions.request, getTasksActionsRecord)
}

export const testable = {getActionsRecord, getTasksActionsRecord, watchGetActionsRecord, watchGetTasksActionsRecord};
