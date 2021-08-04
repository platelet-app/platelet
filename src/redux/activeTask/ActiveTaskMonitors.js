import {put, select, takeEvery} from "redux-saga/effects";
import {getActiveTaskSelector} from "../Selectors";

import * as actions from "./ActiveTaskActions";

import * as assigneeActions from "../taskAssignees/TaskAssigneesActions";

const ignoreActionTypes = []

const includedPrefixes = ["UPDATE_TASK", "ADD_TASK_ASSIGNED", "SET_TASK", "UNSET_TASK", "REMOVE_TASK_ASSIGNED"];

function monitorableAction(action) {
    return (includedPrefixes.some(prefix => action.type.startsWith(prefix)))
        && (action.type.endsWith("SUCCESS") || action.type.endsWith("FROM_SOCKET")) &&
        ignoreActionTypes.every(fragment => !action.type.includes(fragment))
}

function* monitor(monitoredAction) {
    const task = yield select(getActiveTaskSelector)
    if (monitoredAction.data && monitoredAction.data.taskUUID && monitoredAction.data.payload) {
        if (monitoredAction.data.taskUUID === task.uuid) {
            if (monitoredAction.type === assigneeActions.addTaskAssignedRiderActions.success || monitoredAction.type === assigneeActions.UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET) {
                yield put(actions.updateActiveTaskAssignedRider(task.uuid, monitoredAction.data.payload))
            } else if (monitoredAction.type === assigneeActions.addTaskAssignedCoordinatorActions.success || monitoredAction.type === assigneeActions.UPDATE_TASK_ASSIGNED_COORDINATOR_FROM_SOCKET) {
                yield put(actions.updateActiveTaskAssignedCoordinator(task.uuid, monitoredAction.data.payload))
            } else if (monitoredAction.type === assigneeActions.removeTaskAssignedRiderActions.success || monitoredAction.type === assigneeActions.UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET) {
                yield put(actions.updateActiveTaskRemoveAssignedRider(task.uuid, monitoredAction.data.payload))
            } else if (monitoredAction.type === assigneeActions.removeTaskAssignedCoordinatorActions.success || monitoredAction.type === assigneeActions.UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET) {
                yield put(actions.updateActiveTaskRemoveAssignedCoordinator(task.uuid, monitoredAction.data.payload))
            } else {
                yield put(actions.updateActiveTask(task.uuid, monitoredAction.data.payload))
            }
        }
    }
}

export default function* updateActiveTaskMonitor() {
    yield takeEvery(monitorableAction, monitor)
}
