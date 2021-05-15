import {call, put, select, takeEvery} from "redux-saga/effects";
import {getApiControl} from "../Api";
import * as taskWaypointActions from "./TasksWaypointActions";


function* appendDelivered(action) {
    const api = yield select(getApiControl);
    try {
        const tasks = yield call([api, api.tasks.getTasks], action.userUUID, action.page, action.role, "delivered", action.beforeParent);
        yield put(taskWaypointActions.appendTasksDeliveredSuccess({tasksDelivered: tasks}))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(taskWaypointActions.appendTasksDeliveredNotFound(error))
            }
        }
        yield put(taskWaypointActions.appendTasksDeliveredFailure(error))
    }
}

export function* watchAppendTasksDelivered() {
    yield takeEvery(taskWaypointActions.appendTasksDeliveredActions.request, appendDelivered)
}

function* appendRejected(action) {
    const api = yield select(getApiControl);
    try {
        const tasks = yield call([api, api.tasks.getTasks], action.userUUID, action.page, action.role, "rejected", action.beforeParent);
        yield put(taskWaypointActions.appendTasksRejectedSuccess({tasksRejected: tasks}))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(taskWaypointActions.appendTasksRejectedNotFound(error))
            }
        }
        yield put(taskWaypointActions.appendTasksRejectedFailure(error))
    }
}

export function* watchAppendTasksRejected() {
    yield takeEvery(taskWaypointActions.appendTasksRejectedActions.request, appendRejected)
}

function* appendCancelled(action) {
    const api = yield select(getApiControl);
    try {
        const tasks = yield call([api, api.tasks.getTasks], action.userUUID, action.page, action.role, "cancelled", action.beforeParent);
        yield put(taskWaypointActions.appendTasksCancelledSuccess({tasksCancelled: tasks}))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(taskWaypointActions.appendTasksCancelledNotFound(error))
            }
        }
        yield put(taskWaypointActions.appendTasksCancelledFailure(error))
    }
}

export function* watchAppendTasksCancelled() {
    yield takeEvery(taskWaypointActions.appendTasksCancelledActions.request, appendCancelled)
}
