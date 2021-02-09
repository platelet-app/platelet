import {put, select, takeEvery} from "redux-saga/effects";
import {getActiveTaskSelector} from "../Api";
import {updateActiveTask} from "./ActiveTaskActions";

const ignoreActionTypes = []

function monitorableAction(action) {
    return (action.type.startsWith("UPDATE_TASK") || action.type.startsWith("ADD_TASK_ASSIGNED"))
        && (action.type.includes("SUCCESS") || action.type.includes("FROM_SOCKET")) &&
        ignoreActionTypes.every(fragment => !action.type.includes(fragment))
}

function* monitor(monitoredAction) {
    const task = yield select(getActiveTaskSelector)
    if (monitoredAction.data.taskUUID === task.uuid) {
        yield put(updateActiveTask(task.uuid, monitoredAction.data.payload))
    }
}

export default function* updateActiveTaskMonitor() {
    yield takeEvery(monitorableAction, monitor)
}
