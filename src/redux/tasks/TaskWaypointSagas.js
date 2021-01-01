import {call, put, select, takeEvery} from "redux-saga/effects";
import {getApiControl} from "../Api";
import {APPEND_TASKS_REQUEST, appendTaskFailure, appendTaskSuccess} from "./TasksActions";
import {
    APPEND_TASKS_CANCELLED_REQUEST,
    APPEND_TASKS_DELIVERED_REQUEST,
    APPEND_TASKS_REJECTED_REQUEST,
    appendTasksCancelledFailure,
    appendTasksCancelledNotFound,
    appendTasksCancelledSuccess,
    appendTasksDeliveredFailure,
    appendTasksDeliveredNotFound,
    appendTasksDeliveredSuccess,
    appendTasksRejectedFailure,
    appendTasksRejectedNotFound,
    appendTasksRejectedSuccess
} from "./TasksWaypointActions";
import {subscribeToUUIDs} from "../sockets/SocketActions";

function* appendTasks(action) {
    try {
        const api = yield select(getApiControl);
        let tasks;
        switch (action.data.taskStatus) {
            case "tasksNew":
                tasks = yield call([api, api.tasks.getTasks], action.data.data, action.data.page, action.data.role, "new", action.data.beforeParent);
                yield put(appendTaskSuccess({tasksNew: tasks}))
                break;
            case "tasksActive":
                tasks = yield call([api, api.tasks.getTasks], action.data.data, action.data.page, action.data.role, "active", action.data.beforeParent);
                yield put(appendTaskSuccess({tasksActive: tasks}))
                break;
            case "tasksPickedUp":
                tasks = yield call([api, api.tasks.getTasks], action.data.data, action.data.page, action.data.role, "picked_up", action.data.beforeParent);
                yield put(appendTaskSuccess({tasksPickedUp: tasks}))
                break;
            case "tasksDelivered":
                tasks = yield call([api, api.tasks.getTasks], action.data.data, action.data.page, action.data.role, "delivered", action.data.beforeParent);
                yield put(appendTaskSuccess({tasksDelivered: tasks}))
                break;
            case "tasksCancelled":
                tasks = yield call([api, api.tasks.getTasks], action.data.data, action.data.page, action.data.role, "cancelled", action.data.beforeParent);
                yield put(appendTaskSuccess({tasksCancelled: tasks}))
                break;
            case "tasksRejected":
                tasks = yield call([api, api.tasks.getTasks], action.data.data, action.data.page, action.data.role, "rejected", action.data.beforeParent);
                yield put(appendTaskSuccess({tasksRejected: tasks}))
                break;
            default:
                tasks = [];
                break;
        }
    } catch (error) {
        yield put(appendTaskFailure(error))
    }
}

export function* watchAppendTasks() {
    yield takeEvery(APPEND_TASKS_REQUEST, appendTasks)
}

function * appendDelivered(action) {
    const api = yield select(getApiControl);
    try {
        const tasks = yield call([api, api.tasks.getTasks], action.userUUID, action.page, action.role, "delivered", action.beforeParent);
        yield put(appendTasksDeliveredSuccess({tasksDelivered: tasks}))
        yield put(subscribeToUUIDs(tasks.map(t => t.uuid)))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(appendTasksDeliveredNotFound(error))
            }
        } else {
            yield put(appendTasksDeliveredFailure(error))
        }
    }
}

export function* watchAppendTasksDelivered() {
    yield takeEvery(APPEND_TASKS_DELIVERED_REQUEST, appendDelivered)
}

function * appendRejected(action) {
    const api = yield select(getApiControl);
    try {
        const tasks = yield call([api, api.tasks.getTasks], action.userUUID, action.page, action.role, "rejected", action.beforeParent);
        yield put(appendTasksRejectedSuccess({tasksRejected: tasks}))
        yield put(subscribeToUUIDs(tasks.map(t => t.uuid)))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(appendTasksRejectedNotFound(error))
            }
        } else {
            yield put(appendTasksRejectedFailure(error))
        }
    }
}

export function* watchAppendTasksRejected() {
    yield takeEvery(APPEND_TASKS_REJECTED_REQUEST, appendRejected)
}

function * appendCancelled(action) {
    const api = yield select(getApiControl);
    try {
        const tasks = yield call([api, api.tasks.getTasks], action.userUUID, action.page, action.role, "cancelled", action.beforeParent);
        yield put(appendTasksCancelledSuccess({tasksCancelled: tasks}))
        yield put(subscribeToUUIDs(tasks.map(t => t.uuid)))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(appendTasksCancelledNotFound(error))
            }
        } else {
            yield put(appendTasksCancelledFailure(error))
        }
    }
}
export function* watchAppendTasksCancelled() {
    yield takeEvery(APPEND_TASKS_CANCELLED_REQUEST, appendCancelled)
}
