import {put, select, takeEvery} from "redux-saga/effects";
import {getActiveTaskSelector} from "../Selectors";
import {
    updateActiveTask,
    updateActiveTaskAssignedCoordinator,
    updateActiveTaskAssignedRider, updateActiveTaskRemoveAssignedRider
} from "./ActiveTaskActions";
import {
    UPDATE_TASK_ASSIGNED_COORDINATOR_FROM_SOCKET,
    UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET,
    UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET,
} from "../taskAssignees/TaskAssigneesActions";
import {
    addTaskAssignedCoordinatorActions,
    addTaskAssignedRiderActions,
    removeTaskAssignedRiderActions
} from "../taskAssignees/TaskAssigneesActions";

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
            if (monitoredAction.type === addTaskAssignedRiderActions.success || monitoredAction.type === UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET) {
                yield put(updateActiveTaskAssignedRider(task.uuid, monitoredAction.data.payload))
            } else if (monitoredAction.type === addTaskAssignedCoordinatorActions.success || monitoredAction.type === UPDATE_TASK_ASSIGNED_COORDINATOR_FROM_SOCKET) {
                yield put(updateActiveTaskAssignedCoordinator(task.uuid, monitoredAction.data.payload))
            } else if (monitoredAction.type === removeTaskAssignedRiderActions.success || monitoredAction.type === UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET) {
                yield put(updateActiveTaskRemoveAssignedRider(task.uuid, monitoredAction.data.payload))
            } else {
                yield put(updateActiveTask(task.uuid, monitoredAction.data.payload))
            }
        }
    }
}

export default function* updateActiveTaskMonitor() {
    yield takeEvery(monitorableAction, monitor)
}
