import * as taskActions from "./TasksActions"
import {
    addAssigneeToList,
    convertToRelays,
    removeAssigneeFromList,
    removeParentFromTasks,
    sortAndConcat, taskGroupSort
} from "./task_redux_utilities";
import * as taskAssigneesActions from "../taskAssignees/TaskAssigneesActions"
import * as taskWaypointActions from "./TasksWaypointActions"
import {
    convertTaskGroupToObject,
    determineTaskType, encodeUUID, findExistingTask,
    findExistingTaskParent,
    findExistingTaskParentByID
} from "../../utilities";
import {
    appendTasksCancelledActions,
    appendTasksDeliveredActions,
    appendTasksRejectedActions
} from "./TasksWaypointActions";
import update from "immutability-helper";
import {
    setTaskDropoffDestinationActions,
    setTaskDropoffDestinationRequest,
    setTaskPickupDestinationActions,
    unsetTaskDropoffDestinationActions,
    unsetTaskDropoffDestinationRequest,
    unsetTaskPickupDestinationActions
} from "../taskDestinations/TaskDestinationsActions";
import {
    addTaskAssignedCoordinatorActions,
    addTaskAssignedRiderActions, removeTaskAssignedCoordinatorActions,
    removeTaskAssignedRiderActions
} from "../taskAssignees/TaskAssigneesActions";
import _ from "lodash";
import {initialTasksState} from "./TasksReducers";
import {all, call, put, select, takeEvery} from "redux-saga/effects";
import * as taskDestinationActions from "../taskDestinations/TaskDestinationsActions";
import {getTasksSelector, getUsersSelector} from "../Api";
import {subscribeToUUID, subscribeToUUIDs, unsubscribeFromUUID} from "../sockets/SocketActions";
import {displayInfoNotification} from "../notifications/NotificationsActions";
import * as restoreFactories from "./TaskRestoreFactoryFunctions";
import {updateTaskPatchRequest} from "./TasksActions";

function* sortAndSendToState(action) {
    const result = yield call(determineTaskType, action.taskGroup);
    for (const [key, value] of Object.entries(result)) {
        yield put(taskActions.taskCategoryActionFunctions[key].add(value));
    }
}

export function* watchSortAndSendToState() {
    yield takeEvery(taskActions.SORT_AND_SEND_TO_STATE, sortAndSendToState);
}

function* addTaskSuccess(action) {
    const {payload, autoAssign} = action.data;
    const data = yield {[payload.uuid]: payload};
    yield put(taskActions.sortAndSendToState(data))
    if (autoAssign && autoAssign.role && autoAssign.uuid) {
        const users = yield select(getUsersSelector);
        if (action.data.autoAssign.role === "coordinator") {
            yield put(taskAssigneesActions.addTaskAssignedCoordinatorSuccess({
                taskUUID: payload.uuid,
                payload: {
                    user: users[autoAssign.uuid]
                }
            }));
        }
    }
    yield put(subscribeToUUID(payload.uuid))
}

export function* watchAddTaskSuccess() {
    yield all([
        takeEvery(taskActions.addTaskActions.success, addTaskSuccess),
        takeEvery(taskActions.ADD_TASK_FROM_SOCKET, addTaskSuccess)
    ]);
}


function* restoreTaskSuccess(action) {
    const tasks = yield select(getTasksSelector);
    const parent = yield call(findExistingTaskParentByID, tasks, action.data.parent_id);
    let newGroup;
    if (parent.taskGroup) {
        newGroup = {...parent.taskGroup, [action.data.uuid]: action.data}
        yield put(taskActions.sortAndSendToState(newGroup))
        yield put(taskActions.resetGroupRelayUUIDs(parent.parentID));
    } else {
        newGroup = {[action.data.uuid]: action.data}
        yield put(taskActions.sortAndSendToState(newGroup))
    }
}

export function* watchRestoreTaskSuccess() {
    yield all([
        takeEvery(taskActions.restoreTaskActions.success, restoreTaskSuccess),
        takeEvery(taskActions.RESTORE_TASK_FROM_SOCKET, restoreTaskSuccess),
    ]);
}

function* deleteTaskSuccess(action) {
    let relayPrevious;
    const tasks = yield select(getTasksSelector);
    const parent = yield call(findExistingTaskParent, tasks, action.data)
    const beforeDelete = yield parent.taskGroup[action.data]
    if (beforeDelete) {
        const groupValues = yield call([Object, Object.values], parent.taskGroup);
        const groupSorted = yield call([groupValues, groupValues.sort], taskGroupSort)
        if (beforeDelete.relay_previous_uuid)
            relayPrevious = yield call(findExistingTask, tasks, beforeDelete.relay_previous_uuid);
        if (beforeDelete.dropoff_location && beforeDelete.relay_previous_uuid && groupSorted[groupSorted.length - 1].uuid === beforeDelete.uuid) {
            yield put(setTaskDropoffDestinationRequest(
                beforeDelete.relay_previous_uuid,
                beforeDelete.dropoff_location.uuid
            ));
        }
    } else {
        // task could not be found!
        return;
    }
    if (action.type !== taskActions.DELETE_TASK_FROM_SOCKET) {
        // bit of a workaround so that socket based restore action still works
        // TODO: make this work so that restore always sends a socket message, backend work
        yield put(unsubscribeFromUUID(action.data));
        // don't show a notification if it comes from a socket communication
        let restoreActions;
        if (relayPrevious) {
            restoreActions = yield call(restoreFactories.actionDeleteWithRelaysRestoreFactory, action, beforeDelete.relay_previous_uuid);
        } else {
            restoreActions = yield call(restoreFactories.actionDeleteRestoreFactory, action)
        }
        yield put(displayInfoNotification("Task deleted", restoreActions));
    }
    if (parent.taskGroup) {
        const filteredGroup = yield call(_.omit, parent.taskGroup, action.data)
        if (_.isEmpty(filteredGroup)) {
            const newList = yield call(_.omit, tasks[parent.listType], parent.parentID);
            yield put(taskActions.taskCategoryActionFunctions[parent.listType].put(newList));
        } else {
            yield put(taskActions.sortAndSendToState(filteredGroup));
        }
    }
    yield put(taskActions.resetGroupRelayUUIDs(beforeDelete.parent_id));
}

export function* watchDeleteTaskSuccess() {
    yield all([
        takeEvery(taskActions.deleteTaskActions.success, deleteTaskSuccess),
        takeEvery(taskActions.DELETE_TASK_FROM_SOCKET, deleteTaskSuccess)
    ]);
}

function* addTaskRelaySuccess(action) {
    const {autoAssign, payload} = action.data
    yield put(subscribeToUUID(payload.uuid))
    const tasks = yield select(getTasksSelector);
    const parent = yield call(findExistingTaskParentByID, tasks, payload.parent_id);
    if (parent.taskGroup) {
        const newGroup = {...parent.taskGroup, [payload.uuid]: payload}
        newGroup[payload.relay_previous_uuid].relay_next = payload
        yield put(taskActions.sortAndSendToState(newGroup))
        if (autoAssign && autoAssign.role && autoAssign.uuid) {
            const users = yield select(getUsersSelector);
            if (autoAssign.role === "coordinator") {
                yield put(taskAssigneesActions.addTaskAssignedCoordinatorSuccess({
                    taskUUID: payload.uuid,
                    payload: {
                        user: users[autoAssign.uuid]
                    }
                }));
            }
        }
        const previousTask = newGroup[payload.relay_previous_uuid];
        if (previousTask.dropoff_location && previousTask.dropoff_location.uuid) {
            yield put(setTaskDropoffDestinationRequest(payload.uuid, previousTask.dropoff_location.uuid))
            yield put(unsetTaskDropoffDestinationRequest(previousTask.uuid))
        }
    }

    // TODO: consider if this should do something different when the parent is not found
}

export function* watchAddTaskRelaySuccess() {
    yield all([
        takeEvery(taskActions.addTaskRelayActions.success, addTaskRelaySuccess),
        takeEvery(taskActions.ADD_TASK_RELAY_FROM_SOCKET, addTaskRelaySuccess),
    ]);
}

export const testable = {
    restoreTaskSuccess,
    watchAddTaskAssignedRiderSuccess,
    addTaskAssignedRiderSuccess,
    watchAppendTasksCancelledDeliveredRejected,
    appendTasksSuccess,
    sortAndSendToState,
    deleteTaskSuccess,
    addTaskSuccess,
    watchRestoreTaskSuccess,
    watchDeleteTaskSuccess,
    watchAddTaskSuccess,
    watchSortAndSendToState,
    addTaskRelaySuccess,
    watchAddTaskRelaySuccess,
    putTaskSuccess,
    watchPutTaskSuccess,
    watchUpdateTaskTimeCancelledTimeRejectedSuccess,
    updateTaskTimeCancelledTimeRejectedSuccess,
    watchRemoveTaskAssignedCoordinatorSuccess,
    removeTaskAssignedCoordinatorSuccess,
    watchAddTaskAssignedCoordinatorSuccess,
    addTaskAssignedCoordinatorSuccess
};

function* putTaskSuccess(action) {
    const tasks = yield select(getTasksSelector);
    const parent = yield call(findExistingTaskParent, tasks, action.data.uuid);
    let newGroup = {[action.data.uuid]: action.data};
    if (parent.taskGroup) {
        newGroup = {...parent.taskGroup, [action.data.uuid]: action.data}
    }
    // even if the task doesn't exist to be replaced, still put it into state
    yield put(taskActions.sortAndSendToState(newGroup));
}

export function* watchPutTaskSuccess() {
    yield all([
        takeEvery(taskActions.putTaskActions.success, putTaskSuccess),
        takeEvery(taskActions.PUT_TASK_FROM_SOCKET, putTaskSuccess)
    ])
}

function* appendTasksSuccess(action) {
    const tasks = yield select(getTasksSelector);
    for (const [key, value] of Object.entries(action.data)) {
        yield put(subscribeToUUIDs(value.map(t => t.uuid)))
        const converted = yield call(convertToRelays, value);
        const newList = {...tasks[key]}
        for (const [parentID, taskGroup] of Object.entries(converted)) {
            newList[parentID] = {...newList[parentID], ...taskGroup}
        }
        yield put(taskActions.taskCategoryActionFunctions[key].put(newList));
    }
}

export function* watchAppendTasksCancelledDeliveredRejected() {
    yield all([
        takeEvery(taskWaypointActions.appendTasksCancelledActions.success, appendTasksSuccess),
        takeEvery(taskWaypointActions.appendTasksDeliveredActions.success, appendTasksSuccess),
        takeEvery(taskWaypointActions.appendTasksRejectedActions.success, appendTasksSuccess)
        ]
    )
}

function* updateTaskSuccess(action) {
    const tasks = yield select(getTasksSelector);
    const parent = findExistingTaskParent(tasks, action.data.taskUUID);
    if (parent.taskGroup) {
        const taskToUpdate = parent.taskGroup[action.data.taskUUID]
        const updatedItem = {...taskToUpdate, ...action.data.payload};
        const updatedGroup = {...parent.taskGroup, [action.data.taskUUID]: updatedItem}
        yield put(taskActions.sortAndSendToState(updatedGroup))
    }
}

export function* watchUpdateTaskSuccess() {
    yield all([
        takeEvery(taskActions.updateTaskActions.success, updateTaskSuccess),
        takeEvery(taskActions.UPDATE_TASK_FROM_SOCKET, updateTaskSuccess),
        takeEvery(taskActions.updateTaskRequesterContactActions.success, updateTaskSuccess),
        takeEvery(taskActions.updateTaskPriorityActions.success, updateTaskSuccess),
        takeEvery(taskActions.updateTaskPatchActions.success, updateTaskSuccess),
        takeEvery(taskActions.updateTaskPickupTimeActions.success, updateTaskSuccess),
        takeEvery(taskActions.updateTaskDropoffTimeActions.success, updateTaskSuccess),
        takeEvery(taskActions.UPDATE_TASK_PICKUP_LOCATION_FROM_SOCKET, updateTaskSuccess),
        takeEvery(taskActions.UPDATE_TASK_DROPOFF_LOCATION_FROM_SOCKET, updateTaskSuccess),
        takeEvery(taskActions.updateTaskTimeOfCallActions.success, updateTaskSuccess),
        takeEvery(taskDestinationActions.setTaskDropoffDestinationActions.success, updateTaskSuccess),
        takeEvery(taskDestinationActions.setTaskPickupDestinationActions.success, updateTaskSuccess),
        takeEvery(taskDestinationActions.unsetTaskDropoffDestinationActions.success, updateTaskSuccess),
        takeEvery(taskDestinationActions.unsetTaskPickupDestinationActions.success, updateTaskSuccess)
    ])
}

function* updateTaskTimeCancelledTimeRejectedSuccess(action) {
    const {payload} = action.data
    const tasks = yield select(getTasksSelector);
    const parent = yield call(findExistingTaskParent, tasks, action.data.taskUUID);
    if (action.type === taskActions.updateTaskCancelledTimeActions.success) {
        const currentValue = parent.taskGroup[action.data.taskUUID].time_cancelled;
        if (currentValue === null) {
            // only notify if marking cancelled for the first time
            const viewLink = `/task/${encodeUUID(action.data.taskUUID)}`
            yield put(displayInfoNotification("Task marked cancelled", restoreFactories.actionTimeCancelledRestoreFactory(action), viewLink))
        }
    } else {
        const currentValue = parent.taskGroup[action.data.taskUUID].time_rejected;
        if (currentValue === null) {
            // only notify if marking rejected for the first time
            const restoreActions = yield () => [taskActions.updateTaskRejectedTimeRequest(
                action.data.taskUUID,
                {time_rejected: null}
            )];
            const viewLink = yield `/task/${encodeUUID(action.data.taskUUID)}`
            yield put(displayInfoNotification("Task marked rejected", restoreActions, viewLink))
        }
    }
    if (parent.taskGroup) {
        let newGroup = {};
        // if it was already categorised as rejected or cancelled, we need to put it back into the existing parent group before sorting it again
        if (parent.listType === "tasksRejected" || parent.listType === "tasksCancelled") {
            const rejectedCancelledTask = {...parent.taskGroup[action.data.taskUUID], ...payload};
            const taskCurrentParent = yield call(findExistingTaskParentByID, tasks, parent.parentID)
            if (taskCurrentParent.taskGroup) {
                newGroup = {...taskCurrentParent.taskGroup, [action.data.taskUUID]: rejectedCancelledTask}
            } else {
                newGroup = {[action.data.taskUUID]: rejectedCancelledTask}
            }
            yield put(taskActions.sortAndSendToState(newGroup));
        } else {
            const taskToUpdate = parent.taskGroup[action.data.taskUUID];
            const updatedItem = {...taskToUpdate, ...payload};
            const updatedGroup = {...parent.taskGroup, [action.data.taskUUID]: updatedItem};
            yield put(taskActions.sortAndSendToState(updatedGroup));
        }
    }
    yield put(taskActions.resetGroupRelayUUIDs(parent.parentID));
}

export function* watchUpdateTaskTimeCancelledTimeRejectedSuccess() {
    yield all([
        takeEvery(taskActions.updateTaskCancelledTimeActions.success, updateTaskTimeCancelledTimeRejectedSuccess),
        takeEvery(taskActions.updateTaskRejectedTimeActions.success, updateTaskTimeCancelledTimeRejectedSuccess),
        takeEvery(taskActions.UPDATE_TASK_TIME_CANCELLED_FROM_SOCKET, updateTaskTimeCancelledTimeRejectedSuccess),
        takeEvery(taskActions.UPDATE_TASK_TIME_REJECTED_FROM_SOCKET, updateTaskTimeCancelledTimeRejectedSuccess),
    ]);
}

function* addTaskAssignedRiderSuccess(action) {
    const tasks = yield select(getTasksSelector);
    // Get the parent group first
    const currentTask = yield call(findExistingTask, tasks, action.data.taskUUID);
    const parent = yield call(findExistingTaskParent, tasks, action.data.taskUUID);
    if (action.data.payload.patch_id) {
        yield put(updateTaskPatchRequest(
            action.data.taskUUID,
            {patch_id: action.data.payload.patch_id}
        ));
        delete action.data.payload.patch_id;
    }
    if (action.type !== taskAssigneesActions.UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET && currentTask.assigned_riders.length === 0) {
        yield put(displayInfoNotification("Task marked as ACTIVE."))
    }
    yield put(updateTaskPatchRequest(action.data.taskUUID, {patch_id: action.data.payload.rider.patch_id, patch: action.data.payload.rider.patch}))
    if (parent.taskGroup) {
        const task = parent.taskGroup[action.data.taskUUID]
        const updatedItem = {
            ...task,
            ...addAssigneeToList(task,
                action.data.payload.rider, "rider")
        }
        const updatedGroup = {...parent.taskGroup, [action.data.taskUUID]: updatedItem}
        yield put(taskActions.sortAndSendToState(updatedGroup));
    }
}

export function* watchAddTaskAssignedRiderSuccess() {
    yield all([
        takeEvery(taskAssigneesActions.addTaskAssignedRiderActions.success, addTaskAssignedRiderSuccess),
        takeEvery(taskAssigneesActions.UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET, addTaskAssignedRiderSuccess)
    ])
}

function* removeTaskAssignedRiderSuccess(action) {
    const tasks = yield select(getTasksSelector);
    // Get the parent group first
    const parent = findExistingTaskParent(tasks, action.data.taskUUID);
    if (parent.taskGroup) {
        const task = parent.taskGroup[action.data.taskUUID]
        const updatedItem = {
            ...task,
            ...removeAssigneeFromList(task,
                action.data.payload.user_uuid, "rider")
        }
        const updatedGroup = {...parent.taskGroup, [action.data.taskUUID]: updatedItem}
        // sort the item and merge it
        yield put(taskActions.sortAndSendToState(updatedGroup));

        if (updatedItem && updatedItem.assigned_riders && updatedItem.assigned_riders.length > 0) {
            const finalUser = updatedItem.assigned_riders[updatedItem.assigned_riders.length - 1];
            yield put(updateTaskPatchRequest(action.data.taskUUID, {patch_id: finalUser.patch_id, patch: finalUser.patch}))
        } else if (updatedItem) {
            yield put(updateTaskPatchRequest(action.data.taskUUID, {patch_id: null, patch: null}))
        }
    }
}

export function* watchRemoveTaskAssignedRiderSuccess() {
    yield all([
        takeEvery(taskAssigneesActions.removeTaskAssignedRiderActions.success, removeTaskAssignedRiderSuccess),
        takeEvery(taskAssigneesActions.UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET, removeTaskAssignedRiderSuccess)
    ]);
}
function* addTaskAssignedCoordinatorSuccess(action) {
    // Get the parent group first
    const tasks = yield select(getTasksSelector);
    const parent = yield call(findExistingTaskParent, tasks, action.data.taskUUID);
    if (parent.taskGroup) {
        const task = parent.taskGroup[action.data.taskUUID]
        const updatedItem = {
            ...task,
            ...addAssigneeToList(task,
                action.data.payload.user, "coordinator")
        }
        const updatedGroup = update(parent.taskGroup, {[action.data.taskUUID]: {$set: updatedItem}})
        yield put(taskActions.sortAndSendToState(updatedGroup));
    }
}

export function* watchAddTaskAssignedCoordinatorSuccess() {
    yield all([
        takeEvery(taskAssigneesActions.addTaskAssignedCoordinatorActions.success, addTaskAssignedCoordinatorSuccess),
        takeEvery(taskAssigneesActions.UPDATE_TASK_ASSIGNED_COORDINATOR_FROM_SOCKET, addTaskAssignedCoordinatorSuccess)
        ])
}
function* removeTaskAssignedCoordinatorSuccess(action) {
    const tasks = yield select(getTasksSelector);
    // Get the parent group first
    const parent = findExistingTaskParent(tasks, action.data.taskUUID);
    if (parent.taskGroup) {
        const task = parent.taskGroup[action.data.taskUUID]
        const updatedItem = {
            ...task,
            ...removeAssigneeFromList(task,
                action.data.payload.user_uuid, "coordinator")
        }
        const updatedGroup = update(parent.taskGroup, {[action.data.taskUUID]: {$set: updatedItem}})
        yield put(taskActions.sortAndSendToState(updatedGroup));
    }
}

export function* watchRemoveTaskAssignedCoordinatorSuccess() {
    yield all([
        takeEvery(taskAssigneesActions.removeTaskAssignedCoordinatorActions.success, removeTaskAssignedCoordinatorSuccess),
        takeEvery(taskAssigneesActions.UPDATE_TASK_REMOVE_ASSIGNED_COORDINATOR_FROM_SOCKET, removeTaskAssignedCoordinatorSuccess)
    ])
}

function* resetGroupRelayUUIDs(action) {
    const tasks = yield select(getTasksSelector);
    const parent = yield call(findExistingTaskParentByID, tasks, action.parentID);
    if (!parent.taskGroup)
        return;
    let count = 0;
    let newTask;
    const newGroupRelayFixed = [];
    const sortedGroup = Object.values(parent.taskGroup).sort(taskGroupSort);
    for (const t of sortedGroup) {
        // first one in the group and so has no previous relays
        if (count === 0) {
            newTask = {
                ...t,
                relay_previous_uuid: null,
                relay_previous: null
            }

            // Not the first one, so relay_previous is the task from before
        } else {
            newTask = {
                ...t,
                relay_previous_uuid: sortedGroup[count - 1].uuid,
                relay_previous: sortedGroup[count - 1]
            }
        }
        // not on the final task, so set relay_next to the next one
        if (parent.taskGroup.length !== count + 1) {
            newTask = {...newTask, relay_next: sortedGroup[count + 1]}
            // if we're on the final task, then there is no relay_next
        } else {
            newTask = {...newTask, relay_next: null}
        }
        // add the final result to the list, increment counter
        newGroupRelayFixed.push(newTask)
        count++;
    }
    const result = yield call(convertTaskGroupToObject, newGroupRelayFixed);
    yield put(taskActions.sortAndSendToState(result[sortedGroup[0].parent_id]));
}

export function* watchResetGroupRelayUUIDs() {
    yield takeEvery(taskActions.RESET_GROUP_RELAY_UUIDS, resetGroupRelayUUIDs)
}
