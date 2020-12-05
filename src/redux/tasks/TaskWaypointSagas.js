import {call, put, select, takeEvery} from "redux-saga/effects";
import {getApiControl} from "../Api";
import {APPEND_TASKS_REQUEST, appendTaskFailure, appendTaskSuccess, getAllTasksNotFound} from "./TasksActions";
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
import {createLoadingSelector} from "../selectors";
import {useSelector} from "react-redux";

function* appendTasks(action) {
    try {
        const api = yield select(getApiControl);
        let tasks;
        switch (action.data.taskStatus) {
            case "tasksNew":
                tasks = yield call([api, api.tasks.getTasks], action.data.data, action.data.page, action.data.role, "new", action.data.afterDateTime);
                yield put(appendTaskSuccess({tasksNew: tasks}))
                break;
            case "tasksActive":
                tasks = yield call([api, api.tasks.getTasks], action.data.data, action.data.page, action.data.role, "active", action.data.afterDateTime);
                yield put(appendTaskSuccess({tasksActive: tasks}))
                break;
            case "tasksPickedUp":
                tasks = yield call([api, api.tasks.getTasks], action.data.data, action.data.page, action.data.role, "picked_up", action.data.afterDateTime);
                yield put(appendTaskSuccess({tasksPickedUp: tasks}))
                break;
            case "tasksDelivered":
                tasks = yield call([api, api.tasks.getTasks], action.data.data, action.data.page, action.data.role, "delivered", action.data.afterDateTime);
                yield put(appendTaskSuccess({tasksDelivered: tasks}))
                break;
            case "tasksCancelled":
                tasks = yield call([api, api.tasks.getTasks], action.data.data, action.data.page, action.data.role, "cancelled", action.data.afterDateTime);
                yield put(appendTaskSuccess({tasksCancelled: tasks}))
                break;
            case "tasksRejected":
                tasks = yield call([api, api.tasks.getTasks], action.data.data, action.data.page, action.data.role, "rejected", action.data.afterDateTime);
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
        const tasks = yield call([api, api.tasks.getTasks], action.userUUID, action.page, action.role, "delivered", action.afterDateTime);
        yield put(appendTasksDeliveredSuccess({tasksDelivered: tasks}))
    } catch (error) {
        if (error.name === "HttpError") {
            if (error.response.status === 404) {
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
        const tasks = yield call([api, api.tasks.getTasks], action.userUUID, action.page, action.role, "rejected", action.afterDateTime);
        yield put(appendTasksRejectedSuccess({tasksRejected: tasks}))
    } catch (error) {
        if (error.name === "HttpError") {
            if (error.response.status === 404) {
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
        const tasks = yield call([api, api.tasks.getTasks], action.userUUID, action.page, action.role, "cancelled", action.afterDateTime);
        yield put(appendTasksCancelledSuccess({tasksCancelled: tasks}))
    } catch (error) {
        if (error.name === "HttpError") {
            if (error.response.status === 404) {
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
