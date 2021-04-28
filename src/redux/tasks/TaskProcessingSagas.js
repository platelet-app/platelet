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
    determineTaskType,
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
    setTaskPickupDestinationActions, unsetTaskDropoffDestinationActions, unsetTaskPickupDestinationActions
} from "../taskDestinations/TaskDestinationsActions";
import {
    addTaskAssignedCoordinatorActions,
    addTaskAssignedRiderActions, removeTaskAssignedCoordinatorActions,
    removeTaskAssignedRiderActions
} from "../taskAssignees/TaskAssigneesActions";
import _ from "lodash";
import {initialTasksState} from "./TasksReducers";
import {call, put, takeEvery} from "redux-saga/effects";
import {taskCategoryActionFunctions} from "./TasksActions";

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
    yield takeEvery(taskActions.addTaskActions.success, addTaskSuccess)
}

// case restoreTaskActions.success:
// case RESTORE_TASK_FROM_SOCKET: {
//     const parent = findExistingTaskParentByID(state.tasks, action.data.parent_id);
//     let newGroup;
//     let newTasks;
//     if (parent.taskGroup) {
//         newTasks = removeParentFromTasks(state.tasks, parent.listType, parent.parentID)
//         newGroup = {...parent.taskGroup, [action.data.uuid]: action.data}
//     } else {
//         newTasks = state.tasks;
//         newGroup = {[action.data.uuid]: action.data}
//     }
//     return {tasks: sortAndConcat(newTasks, newGroup), error: null}
// }
// case addTaskRelayActions.success:
// case ADD_TASK_RELAY_FROM_SOCKET: {
//     const parent = findExistingTaskParentByID(state.tasks, action.data.parent_id);
//     if (parent.taskGroup) {
//         const newGroup = {...parent.taskGroup, [action.data.uuid]: action.data}
//         return {tasks: sortAndConcat(state.tasks, newGroup), error: null}
//     } else {
//         return state;
//     }
// }
//
// case putTaskActions.success:
// case PUT_TASK_FROM_SOCKET: {
//     const parent = findExistingTaskParent(state.tasks, action.data.uuid);
//     if (parent.taskGroup) {
//         const newGroup = {...parent.taskGroup, [action.data.uuid]: action.data}
//         const newTasks = removeParentFromTasks(state.tasks, parent.listType, parent.parentID)
//         return {tasks: sortAndConcat(newTasks, newGroup), error: null};
//     } else {
//         return state;
//     }
// }
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
// case updateTaskActions.success:
// case updateTaskRequesterContactActions.success:
// case updateTaskPriorityActions.success:
// case updateTaskPatchActions.success:
// case updateTaskPickupTimeActions.success:
// case updateTaskDropoffTimeActions.success:
// case UPDATE_TASK_PICKUP_LOCATION_FROM_SOCKET:
//     case UPDATE_TASK_DROPOFF_LOCATION_FROM_SOCKET:
//     case updateTaskTimeOfCallActions.success:
// case setTaskDropoffDestinationActions.success:
// case setTaskPickupDestinationActions.success:
// case unsetTaskDropoffDestinationActions.success:
// case unsetTaskPickupDestinationActions.success:
// case UPDATE_TASK_FROM_SOCKET: {
//     const parent = findExistingTaskParent(state.tasks, action.data.taskUUID);
//     if (parent.taskGroup) {
//         const taskToUpdate = parent.taskGroup[action.data.taskUUID]
//         const updatedItem = {...taskToUpdate, ...action.data.payload};
//         const updatedGroup = {...parent.taskGroup, [action.data.taskUUID]: updatedItem}
//         const newTasks = removeParentFromTasks(state.tasks, parent.listType, parent.parentID)
//         return {tasks: sortAndConcat(newTasks, updatedGroup), error: null};
//     } else {
//         return state;
//     }
// }
// case updateTaskCancelledTimeActions.success:
// case UPDATE_TASK_TIME_CANCELLED_FROM_SOCKET:
//     case UPDATE_TASK_TIME_REJECTED_FROM_SOCKET:
//     case updateTaskRejectedTimeActions.success: {
//     const parent = findExistingTaskParent(state.tasks, action.data.taskUUID);
//     if (parent.taskGroup) {
//         const newTasks = removeParentFromTasks(state.tasks, parent.listType, parent.parentID)
//         let newGroup = {};
//         let newTasksSecond = {};
//         // if it was already categorised as rejected or cancelled, we need to put it back into the existing parent group before sorting it again
//         if (parent.listType === "tasksRejected" || parent.listType === "tasksCancelled") {
//             const rejectedCancelledTask = {...parent.taskGroup[action.data.taskUUID], ...action.data.payload};
//             const taskCurrentParent = findExistingTaskParentByID(state.tasks, parent.parentID)
//             if (taskCurrentParent.taskGroup) {
//                 newTasksSecond = removeParentFromTasks(newTasks, taskCurrentParent.listType, taskCurrentParent.parentID)
//                 newGroup = {...taskCurrentParent.taskGroup, [action.data.taskUUID]: rejectedCancelledTask}
//             } else {
//                 newTasksSecond = newTasks;
//                 newGroup = {[action.data.taskUUID]: rejectedCancelledTask}
//             }
//             return {tasks: sortAndConcat(newTasksSecond, newGroup)}
//         } else {
//             let updatedItem;
//             const taskToUpdate = parent.taskGroup[action.data.taskUUID];
//             updatedItem = {...taskToUpdate, ...action.data.payload};
//             const updatedGroup = {...parent.taskGroup, [action.data.taskUUID]: updatedItem}
//             return {tasks: sortAndConcat(newTasks, updatedGroup), error: null};
//         }
//
//     } else {
//         return state;
//     }
// }
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
// case deleteTaskActions.success:
// case DELETE_TASK_FROM_SOCKET: {
//     const parent = findExistingTaskParent(state.tasks, action.data)
//     if (parent.taskGroup) {
//         const newTasks = removeParentFromTasks(state.tasks, parent.listType, parent.parentID)
//         const filteredGroup = _.omit(parent.taskGroup, action.data)
//         if (_.isEmpty(filteredGroup)) {
//             const {[parent.parentID]: removedParent, ...newTasksList} = state.tasks[parent.listType]
//             return {tasks: {...newTasks, [parent.listType]: newTasksList}, error: null}
//         } else {
//             return {tasks: sortAndConcat(newTasks, filteredGroup), error: null};
//         }
//
//     } else {
//         return state;
//     }
// }
// case RESET_GROUP_RELAY_UUIDS: {
//     const parent = findExistingTaskParentByID(state.tasks, action.parentID)
//     if (!parent.taskGroup)
//         return state;
//     let count = 0;
//     let newTask;
//     const newGroupRelayFixed = [];
//     const sortedGroup = Object.values(parent.taskGroup).sort(taskGroupSort);
//     for (const t of sortedGroup) {
//         // first one in the group and so has no previous relays
//         if (count === 0) {
//             newTask = {
//                 ...t,
//                 relay_previous_uuid: null,
//                 relay_previous: null
//             }
//
//             // Not the first one, so relay_previous is the task from before
//         } else {
//             newTask = {
//                 ...t,
//                 relay_previous_uuid: sortedGroup[count - 1].uuid,
//                 relay_previous: sortedGroup[count - 1]
//             }
//         }
//         // not on the final task, so set relay_next to the next one
//         if (parent.taskGroup.length !== count + 1) {
//             newTask = {...newTask, relay_next: sortedGroup[count + 1]}
//             // if we're on the final task, then there is no relay_next
//         } else {
//             newTask = {...newTask, relay_next: null}
//         }
//         // add the final result to the list, increment counter
//         newGroupRelayFixed.push(newTask)
//         count++;
//     }
//     const result = convertTaskGroupToObject(newGroupRelayFixed);
//     // TODO: make this better
//
//     return {tasks: sortAndConcat(state.tasks, result[sortedGroup[0].parent_id]), error: null};
// }
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
