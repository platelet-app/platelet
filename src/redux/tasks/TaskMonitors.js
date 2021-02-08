import {put, select, takeEvery} from "redux-saga/effects";
import {getActiveTaskSelector} from "../Api";
import {updateActiveTask} from "./TasksActions";

const ignoreActionTypes = []

function monitorableAction(action) {
    return action.type.startsWith("UPDATE_TASK") && action.type.includes("SUCCESS") &&
        ignoreActionTypes.every(fragment => !action.type.includes(fragment))
}

function* monitor(monitoredAction) {
    //if (monitoredAction.forwarded === true)
    //    return
    const task = yield select(getActiveTaskSelector)
    if (monitoredAction.data.taskUUID === task.uuid) {
        yield put(updateActiveTask(task.uuid, monitoredAction.data.payload))
    }
    //yield put({...monitoredAction, forwarded: true})
}

export default function* updateActiveTaskMonitor() {
    yield takeEvery(monitorableAction, monitor)
}
