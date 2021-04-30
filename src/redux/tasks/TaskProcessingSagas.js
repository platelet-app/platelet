import * as taskActions from "./TasksActions"
import {
    addAssigneeToList,
    convertToRelays,
    removeAssigneeFromList,
    removeParentFromTasks,
    sortAndConcat, taskGroupSort
} from "./task_redux_utilities";
import {
    convertTaskGroupToObject,
    determineTaskType, findExistingTask,
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
import {
    deleteTaskActions,
    restoreTaskRequest,
    taskCategoryActionFunctions,
    updateTaskRejectedTimeRequest as updateTaskActions
} from "./TasksActions";
import {getTasksSelector} from "../Api";
import {unsubscribeFromUUID} from "../sockets/SocketActions";
import {displayInfoNotification} from "../notifications/NotificationsActions";

function* sortAndSendToState(action) {
    const result = yield call(determineTaskType, action.taskGroup);
    for (const [key, value] of Object.entries(result)) {
        yield put(taskCategoryActionFunctions[key].add(value));
    }
}

export function* watchSortAndSendToState() {
    yield takeEvery(taskActions.SORT_AND_SEND_TO_STATE, sortAndSendToState);
}

function* addTaskSuccess(action) {
    const data = yield {[action.data.uuid]: action.data};
    yield put(taskActions.sortAndSendToState(data))
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
    } else {
        newGroup = {[action.data.uuid]: action.data}
    }
    yield put(taskActions.sortAndSendToState(newGroup))
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
        if (beforeDelete.dropoff_location && beforeDelete.relay_previous_uuid && groupSorted[groupSorted.length - 1].uuid === beforeDelete.uuid) {
            relayPrevious = yield call(findExistingTask, tasks, beforeDelete.relay_previous_uuid);
            yield put(setTaskDropoffDestinationRequest(
                beforeDelete.relay_previous_uuid,
                beforeDelete.dropoff_location.uuid
            ));
        }
        yield put(taskActions.resetGroupRelayUUIDs(beforeDelete.parent_id));
    } else {
        // task could not be found!
        return;
    }
    yield put(unsubscribeFromUUID(action.data));
    let restoreActions;
    if (relayPrevious) {
        restoreActions = yield () => [
            taskActions.restoreTaskRequest(action.data),
            unsetTaskDropoffDestinationRequest(
                beforeDelete.relay_previous_uuid
            ),
        ];
    } else {
        restoreActions = yield () => [
            taskActions.restoreTaskRequest(action.data)]
    }
    yield put(displayInfoNotification("Task deleted", restoreActions));
    if (parent.taskGroup) {
        const filteredGroup = yield call(_.omit, parent.taskGroup, action.data)
        if (_.isEmpty(filteredGroup)) {
            const newList = yield call(_.omit, tasks[parent.listType], parent.parentID);
            yield put(taskCategoryActionFunctions[parent.listType].put(newList));
        } else {
            yield put(taskActions.sortAndSendToState(filteredGroup));
        }
    }
}

export function *watchDeleteTaskSuccess() {
    yield all([
        takeEvery(taskActions.deleteTaskActions.success, deleteTaskSuccess),
        takeEvery(taskActions.DELETE_TASK_FROM_SOCKET, deleteTaskSuccess)
    ]);
}

function* addTaskRelaySuccess(action) {
    const tasks = yield select(getTasksSelector);
    const parent = yield call(findExistingTaskParentByID, tasks, action.data.parent_id);
    if (parent.taskGroup) {
        const newGroup = {...parent.taskGroup, [action.data.uuid]: action.data}
        yield put(taskActions.sortAndSendToState(newGroup))
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
    updateTaskTimeCancelledTimeRejectedSuccess
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
// case appendTasksDeliveredActions.success:
// case appendTasksRejectedActions.success:
// case appendTasksCancelledActions.success: {
//     let result;
//     for (const [key, value] of Object.entries(action.data)) {
//         const converted = convertToRelays(value);
//         const newList = {...state.tasks[key]}
//         for (const [parentID, taskGroup] of Object.entries(converted)) {
//             newList[parentID] = {...newList[parentID], ...taskGroup}
//         }
//         result = update(state.tasks, {[key]: {$set: newList}})
//     }
//     return {tasks: result, error: null}
// }
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


    ])
}
// case updateTaskCancelledTimeActions.success:
// case UPDATE_TASK_TIME_CANCELLED_FROM_SOCKET:
//     case UPDATE_TASK_TIME_REJECTED_FROM_SOCKET:
//     case updateTaskRejectedTimeActions.success: {
function* updateTaskTimeCancelledTimeRejectedSuccess(action) {
    // TODO: this
    const tasks = yield select(getTasksSelector);

    const parent = yield call(findExistingTaskParent, tasks, action.data.taskUUID);
    if (parent.taskGroup) {
        let newGroup = {};
        let newTasksSecond = {};
        // if it was already categorised as rejected or cancelled, we need to put it back into the existing parent group before sorting it again
        if (parent.listType === "tasksRejected" || parent.listType === "tasksCancelled") {
            const rejectedCancelledTask = {...parent.taskGroup[action.data.taskUUID], ...action.data.payload};
            const taskCurrentParent = yield call(findExistingTaskParentByID, tasks, parent.parentID)
            if (taskCurrentParent.taskGroup) {
                newGroup = {...taskCurrentParent.taskGroup, [action.data.taskUUID]: rejectedCancelledTask}
            } else {
                newGroup = {[action.data.taskUUID]: rejectedCancelledTask}
            }
            yield put(taskActions.sortAndSendToState(newGroup));
        } else {
            let updatedItem;
            const taskToUpdate = parent.taskGroup[action.data.taskUUID];
            updatedItem = {...taskToUpdate, ...action.data.payload};
            const updatedGroup = {...parent.taskGroup, [action.data.taskUUID]: updatedItem}
            yield put(taskActions.sortAndSendToState(updatedGroup));
        }
    }
}

export function* watchUpdateTaskTimeCancelledTimeRejectedSuccess() {
    yield all([
        takeEvery(taskActions.updateTaskCancelledTimeActions.success, updateTaskTimeCancelledTimeRejectedSuccess),
        takeEvery(taskActions.updateTaskRejectedTimeActions.success, updateTaskTimeCancelledTimeRejectedSuccess),
        takeEvery(taskActions.UPDATE_TASK_TIME_CANCELLED_FROM_SOCKET, updateTaskTimeCancelledTimeRejectedSuccess),
        takeEvery(taskActions.UPDATE_TASK_TIME_REJECTED_FROM_SOCKET, updateTaskTimeCancelledTimeRejectedSuccess),
    ]);
}
// case addTaskAssignedRiderActions.success:
// case UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET: {
//     // Get the parent group first
//     const parent = findExistingTaskParent(state.tasks, action.data.taskUUID);
//     if (parent.taskGroup) {
//         const task = parent.taskGroup[action.data.taskUUID]
//         const newTasks = removeParentFromTasks(state.tasks, parent.listType, parent.parentID)
//         const updatedItem = {
//             ...task,
//             ...addAssigneeToList(task,
//                 action.data.payload.rider, "rider")
//         }
//         const updatedGroup = {...parent.taskGroup, [action.data.taskUUID]: updatedItem}
//         return {tasks: sortAndConcat(newTasks, updatedGroup), error: null}
//     } else {
//         return state;
//     }
// }
// case removeTaskAssignedRiderActions.success:
// case UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET: {
//     // Get the parent group first
//     const parent = findExistingTaskParent(state.tasks, action.data.taskUUID);
//     // remove it from the list
//     const newTasks = removeParentFromTasks(state.tasks, parent.listType, parent.parentID)
//     if (parent.taskGroup) {
//         const task = parent.taskGroup[action.data.taskUUID]
//         const updatedItem = {
//             ...task,
//             ...removeAssigneeFromList(task,
//                 action.data.payload.user_uuid, "rider")
//         }
//         const updatedGroup = {...parent.taskGroup, [action.data.taskUUID]: updatedItem}
//
//         // sort the item and merge it
//         return {tasks: sortAndConcat(newTasks, updatedGroup), error: null}
//     } else {
//         return state;
//     }
// }
// case addTaskAssignedCoordinatorActions.success:
// case UPDATE_TASK_ASSIGNED_COORDINATOR_FROM_SOCKET: {
//     // Get the parent group first
//     const parent = findExistingTaskParent(state.tasks, action.data.taskUUID);
//     if (parent.taskGroup) {
//         const task = parent.taskGroup[action.data.taskUUID]
//         const updatedItem = {
//             ...task,
//             ...addAssigneeToList(task,
//                 action.data.payload.user, "coordinator")
//         }
//         const updatedGroup = update(parent.taskGroup, {[action.data.taskUUID]: {$set: updatedItem}})
//         const newList = {[parent.listType]: {...state.tasks[parent.listType], [parent.parentID]: updatedGroup}}
//         const tasksUpdated = {...state.tasks, ...newList}
//         return {tasks: tasksUpdated, error: null}
//     } else {
//         return state;
//     }
// }
// case removeTaskAssignedCoordinatorActions.success:
// case UPDATE_TASK_REMOVE_ASSIGNED_COORDINATOR_FROM_SOCKET: {
//     // Get the parent group first
//     const parent = findExistingTaskParent(state.tasks, action.data.taskUUID);
//     if (parent.taskGroup) {
//         const task = parent.taskGroup[action.data.taskUUID]
//         const updatedItem = {
//             ...task,
//             ...removeAssigneeFromList(task,
//                 action.data.payload.user_uuid, "coordinator")
//         }
//         const updatedGroup = update(parent.taskGroup, {[action.data.taskUUID]: {$set: updatedItem}})
//         const newList = {[parent.listType]: {...state.tasks[parent.listType], [parent.parentID]: updatedGroup}}
//         const tasksUpdated = {...state.tasks, ...newList}
//         return {tasks: tasksUpdated, error: null}
//     } else {
//         return state;
//     }
// }
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
    // TODO: make this better
    yield put(taskActions.sortAndSendToState(result[sortedGroup[0].parent_id]));
}
export function* watchResetGroupRelayUUIDs() {
    yield takeEvery(taskActions.RESET_GROUP_RELAY_UUIDS, resetGroupRelayUUIDs)
}
// case getTasksActions.success:
// return {tasks: action.data, error: null};
// case GROUP_RELAYS_TOGETHER:
//     return state;
// // return {tasks: groupRelaysTogether(state.tasks), error: null}
// case getTasksActions.failure:
// return {...initialTasksState, error: action.error};
// default:
// return state
// }
// }
//
