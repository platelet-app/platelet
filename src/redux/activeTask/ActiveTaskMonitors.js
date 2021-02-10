import {put, select, takeEvery} from "redux-saga/effects";
import {getActiveTaskSelector} from "../Api";
import {
    updateActiveTask,
    updateActiveTaskAssignedCoordinator,
    updateActiveTaskAssignedRider
} from "./ActiveTaskActions";
import {
    UPDATE_TASK_ASSIGNED_COORDINATOR_FROM_SOCKET,
    UPDATE_TASK_ASSIGNED_COORDINATOR_SUCCESS,
    UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET,
    UPDATE_TASK_ASSIGNED_RIDER_SUCCESS
} from "../tasks/TasksActions";

const ignoreActionTypes = []

function monitorableAction(action) {
    return (action.type.startsWith("UPDATE_TASK"))
        && (action.type.endsWith("SUCCESS") || action.type.endsWith("FROM_SOCKET")) &&
        ignoreActionTypes.every(fragment => !action.type.includes(fragment))
}

function* monitor(monitoredAction) {
    const task = yield select(getActiveTaskSelector)
    if (monitoredAction.data.taskUUID === task.uuid) {
        if (monitoredAction.type === UPDATE_TASK_ASSIGNED_RIDER_SUCCESS || monitoredAction.type === UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET) {
            yield put(updateActiveTaskAssignedRider(task.uuid, monitoredAction.data.payload))
        } else if (monitoredAction.type === UPDATE_TASK_ASSIGNED_COORDINATOR_SUCCESS || monitoredAction.type === UPDATE_TASK_ASSIGNED_COORDINATOR_FROM_SOCKET) {
            yield put(updateActiveTaskAssignedCoordinator(task.uuid, monitoredAction.data.payload))
        } else {
            yield put(updateActiveTask(task.uuid, monitoredAction.data.payload))
        }
    }
}

export default function* updateActiveTaskMonitor() {
    yield takeEvery(monitorableAction, monitor)
}
