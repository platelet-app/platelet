import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const REPLACE_TASKS_STATE = "REPLACE_TASKS_STATE";

export const UPDATE_TASK_TIME_CANCELLED_FROM_SOCKET = "UPDATE_TASK_TIME_CANCELLED_FROM_SOCKET";
export const UPDATE_TASK_TIME_REJECTED_FROM_SOCKET = "UPDATE_TASK_TIME_REJECTED_FROM_SOCKET";
export const PUT_TASK_FROM_SOCKET = "PUT_TASK_FROM_SOCKET";
export const UPDATE_TASK_FROM_SOCKET = "UPDATE_TASK_FROM_SOCKET";
export const ADD_TASK_RELAY_FROM_SOCKET = "ADD_TASK_RELAY_FROM_SOCKET";
export const UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET = "UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET";
export const UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET = "UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET";
export const UPDATE_TASK_ASSIGNED_COORDINATOR_FROM_SOCKET = "UPDATE_TASK_ASSIGNED_COORDINATOR_FROM_SOCKET";
export const UPDATE_TASK_REMOVE_ASSIGNED_COORDINATOR_FROM_SOCKET = "UPDATE_TASK_REMOVE_ASSIGNED_COORDINATOR_FROM_SOCKET";
export const ADD_TASK_FROM_SOCKET = "ADD_TASK_FROM_SOCKET"
export const DELETE_TASK_FROM_SOCKET = "DELETE_TASK_FROM_SOCKET"
export const RESTORE_TASK_FROM_SOCKET = "RESTORE_TASK_FROM_SOCKET"
export const START_REFRESH_TASKS_LOOP_FROM_SOCKET = "START_REFRESH_TASKS_LOOP_FROM_SOCKET";
export const UPDATE_TASK_PICKUP_LOCATION_FROM_SOCKET = "UPDATE_TASK_PICKUP_LOCATION_FROM_SOCKET"
export const UPDATE_TASK_DROPOFF_LOCATION_FROM_SOCKET = "UPDATE_TASK_DROPOFF_LOCATION_FROM_SOCKET"

export const RESET_GROUP_RELAY_UUIDS = "RESET_GROUP_RELAY_UUIDS";
export const GROUP_RELAYS_TOGETHER = "GROUP_RELAYS_TOGETHER";

export const SET_ROLE_VIEW_AND_GET_TASKS = "SET_ROLE_VIEW_AND_GET_TASKS";

export const SET_CURRENT_TASK = "SET_CURRENT_TASK";
export const CLEAR_CURRENT_TASK = "CLEAR_CURRENT_TASK";

export const SORT_AND_SEND_TO_STATE = "SORT_AND_SEND_TO_STATE";

export function sortAndSendToState(taskGroup) {
    return {type: SORT_AND_SEND_TO_STATE, taskGroup}
}

export const taskCategoryActions = {
    tasksNew: {
        put: "PUT_NEW_TASKS",
        add: "ADD_TO_NEW_TASKS"
    },
    tasksActive: {
        put: "PUT_ACTIVE_TASKS",
        add: "ADD_TO_ACTIVE_TASKS"
    },
    tasksPickedUp: {
        put: "PUT_PICKED_UP_TASKS",
        add: "ADD_TO_PICKED_UP_TASKS"
    },
    tasksDelivered: {
        put: "PUT_DELIVERED_TASKS",
        add: "ADD_TO_DELIVERED_TASKS"
    },
    tasksRejected: {
        put: "PUT_REJECTED_TASKS",
        add: "ADD_TO_REJECTED_TASKS"
    },
    tasksCancelled: {
        put: "PUT_CANCELLED_TASKS",
        add: "ADD_TO_CANCELLED_TASKS"
    },
}

const generateTaskCategoryActionsFunctions = actions => {
    const result = {};
    for (const [key, value] of Object.entries(actions)) {
        result[key] = {};
        for (const [k, v] of Object.entries(value)) {
            result[key][k] = (data) => ({ type: v, data });
        }
    }
    return result;
}

export const taskCategoryActionFunctions = generateTaskCategoryActionsFunctions(taskCategoryActions);

export const addTaskPrefix = "ADD_TASK";
export const addTaskActions = createRequestActions(addTaskPrefix);
export const {addTaskSuccess, addTaskFailure, addTaskForbidden} = createRequestFunctions(addTaskActions);

export function addTaskRequest(payload, autoAssignRole = "", autoAssignUserUUID = "") {
    return { type: addTaskActions.request, data: {payload, autoAssign: {role: autoAssignRole, uuid: autoAssignUserUUID}}}
}

export const addTaskRelayPrefix = "ADD_TASK_RELAY";
export const addTaskRelayActions = createRequestActions(addTaskRelayPrefix);
export const {addTaskRelaySuccess, addTaskRelayFailure, addTaskRelayForbidden} = createRequestFunctions(addTaskRelayActions);

// TODO: does this need a payload parameter?
export function addTaskRelayRequest(relayPrevious, autoAssignRole = "", autoAssignUserUUID = "") {
    return { type: addTaskRelayActions.request, data: { relayPrevious, autoAssign: {role: autoAssignRole, uuid: autoAssignUserUUID} }}
}


export const deleteTaskPrefix = "DELETE_TASK";
export const deleteTaskActions = createRequestActions(deleteTaskPrefix);
export const {deleteTaskSuccess, deleteTaskFailure, deleteTaskForbidden} = createRequestFunctions(deleteTaskActions);

export function deleteTaskRequest(taskUUID) {
    return { type: deleteTaskActions.request, data: {taskUUID }}
}


export const restoreTaskPrefix = "RESTORE_TASK";
export const restoreTaskActions = createRequestActions(restoreTaskPrefix);
export const {restoreTaskSuccess, restoreTaskFailure, restoreTaskForbidden} = createRequestFunctions(restoreTaskActions);

export function restoreTaskRequest(taskUUID) {
    return { type: restoreTaskActions.request, data: {taskUUID }}
}


export const updateTaskRequesterContactPrefix = "UPDATE_TASK_REQUESTER_CONTACT";
export const updateTaskRequesterContactActions = createRequestActions(updateTaskRequesterContactPrefix);
export const {updateTaskRequesterContactSuccess, updateTaskRequesterContactFailure, updateTaskRequesterContactForbidden} = createRequestFunctions(updateTaskRequesterContactActions);

export function updateTaskRequesterContactRequest(taskUUID, payload) {
    return { type: updateTaskRequesterContactActions.request, data: {taskUUID, payload }}
}


export const updateTaskPickupTimePrefix = "UPDATE_TASK_PICKUP_TIME";
export const updateTaskPickupTimeActions = createRequestActions(updateTaskPickupTimePrefix);
export const {updateTaskPickupTimeSuccess, updateTaskPickupTimeFailure, updateTaskPickupTimeForbidden} = createRequestFunctions(updateTaskPickupTimeActions);

export function updateTaskPickupTimeRequest(taskUUID, payload) {
    return { type: updateTaskPickupTimeActions.request, data: {taskUUID, payload} }
}


export const updateTaskDropoffTimePrefix = "UPDATE_TASK_DROPOFF_TIME";
export const updateTaskDropoffTimeActions = createRequestActions(updateTaskDropoffTimePrefix);
export const {updateTaskDropoffTimeSuccess, updateTaskDropoffTimeFailure, updateTaskDropoffTimeForbidden} = createRequestFunctions(updateTaskDropoffTimeActions);

export function updateTaskDropoffTimeRequest(taskUUID, payload) {
    return { type: updateTaskDropoffTimeActions.request, data: {taskUUID, payload} }
}


export const updateTaskCancelledTimePrefix = "UPDATE_TASK_CANCELLED_TIME";
export const updateTaskCancelledTimeActions = createRequestActions(updateTaskCancelledTimePrefix);
export const {updateTaskCancelledTimeSuccess, updateTaskCancelledTimeFailure, updateTaskCancelledTimeForbidden} = createRequestFunctions(updateTaskCancelledTimeActions);

export function updateTaskCancelledTimeRequest(taskUUID, payload) {
    return { type: updateTaskCancelledTimeActions.request, data: {taskUUID, payload} }
}


export const updateTaskRejectedTimePrefix = "UPDATE_TASK_REJECTED_TIME";
export const updateTaskRejectedTimeActions = createRequestActions(updateTaskRejectedTimePrefix);
export const {updateTaskRejectedTimeSuccess, updateTaskRejectedTimeFailure, updateTaskRejectedTimeForbidden} = createRequestFunctions(updateTaskRejectedTimeActions);

export function updateTaskRejectedTimeRequest(taskUUID, payload) {
    return { type: updateTaskRejectedTimeActions.request, data: {taskUUID, payload} }
}


export const updateTaskPriorityPrefix = "UPDATE_TASK_PRIORITY";
export const updateTaskPriorityActions = createRequestActions(updateTaskPriorityPrefix);
export const {updateTaskPrioritySuccess, updateTaskPriorityFailure, updateTaskPriorityForbidden} = createRequestFunctions(updateTaskPriorityActions);

export function updateTaskPriorityRequest(taskUUID, payload) {
    return { type: updateTaskPriorityActions.request, data: {taskUUID, payload} }
}


export const updateTaskPatchPrefix = "UPDATE_TASK_PATCH";
export const updateTaskPatchActions = createRequestActions(updateTaskPatchPrefix);
export const {updateTaskPatchSuccess, updateTaskPatchFailure, updateTaskPatchForbidden} = createRequestFunctions(updateTaskPatchActions);

export function updateTaskPatchRequest(taskUUID, payload) {
    return { type: updateTaskPatchActions.request, data: {taskUUID, payload} }
}


export const updateTaskPrefix = "UPDATE_TASK";
export const updateTaskActions = createRequestActions(updateTaskPrefix);
export const {updateTaskSuccess, updateTaskFailure, updateTaskForbidden} = createRequestFunctions(updateTaskActions);

export function updateTaskRequest(taskUUID, payload) {
    return { type: updateTaskActions.request, data: {taskUUID, payload} }
}

export const updateTaskTimeOfCallPrefix = "UPDATE_TASK_TIME_OF_CALL";
export const updateTaskTimeOfCallActions = createRequestActions(updateTaskTimeOfCallPrefix);
export const { updateTaskTimeOfCallFailure, updateTaskTimeOfCallSuccess } = createRequestFunctions(updateTaskTimeOfCallActions)

export function updateTaskTimeOfCallRequest(taskUUID, payload) {
    return { type: updateTaskTimeOfCallActions.request, data: {taskUUID, payload}}
}

export const getTasksPrefix = "GET_TASKS";
export const getTasksActions = createRequestActions(getTasksPrefix);
export const {getTasksSuccess, getTasksFailure, getTasksNotFound, getTasksForbidden} = createRequestFunctions(getTasksActions);

export function getAllTasksRequest(userUUID, page, role) {
    return { type: getTasksActions.request, data: {userUUID, page, role} }
}

export const putTaskPrefix = "PUT_TASK";
export const putTaskActions = createRequestActions(putTaskPrefix);
export const {putTaskSuccess, putTaskFailure, putTaskForbidden} = createRequestFunctions(putTaskActions);

export function putTaskRequest(taskUUID, payload) {
    return { type: putTaskActions.request, data: {taskUUID, payload} }
}

export function putTaskFromSocket(data) {
    return { type: PUT_TASK_FROM_SOCKET, data }
}

export function addTaskFromSocket(data) {
    return { type: ADD_TASK_FROM_SOCKET, data }
}

export function addTaskRelayFromSocket(data) {
    return { type: ADD_TASK_RELAY_FROM_SOCKET, data }
}

export function deleteTaskFromSocket(data) {
    return { type: DELETE_TASK_FROM_SOCKET, data }
}

export function restoreTaskFromSocket(data) {
    return { type: RESTORE_TASK_FROM_SOCKET, data }
}

export function updateTaskFromSocket(data) {
    return { type: UPDATE_TASK_FROM_SOCKET, data }
}

export function updateTaskPickupLocationFromSocket(data) {
    return { type: UPDATE_TASK_PICKUP_LOCATION_FROM_SOCKET, data}
}

export function updateTaskDropoffLocationFromSocket(data) {
    return { type: UPDATE_TASK_DROPOFF_LOCATION_FROM_SOCKET, data}
}

export function updateTaskTimeRejectedFromSocket(data) {
    return { type: UPDATE_TASK_TIME_REJECTED_FROM_SOCKET, data }
}

export function updateTaskTimeCancelledFromSocket(data) {
    return { type: UPDATE_TASK_TIME_CANCELLED_FROM_SOCKET, data }
}

export function updateTaskAssignedRiderFromSocket(data) {
    return { type: UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET, data }
}

export function updateTaskRemoveAssignedRiderFromSocket(data) {
    return { type: UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET, data }
}

export function updateTaskAssignedCoordinatorFromSocket(data) {
    return { type: UPDATE_TASK_ASSIGNED_COORDINATOR_FROM_SOCKET, data }
}

export function updateTaskRemoveAssignedCoordinatorFromSocket(data) {
    return { type: UPDATE_TASK_REMOVE_ASSIGNED_COORDINATOR_FROM_SOCKET, data }
}

export function startRefreshTasksLoopFromSocket(userUUID) {
    return {type: START_REFRESH_TASKS_LOOP_FROM_SOCKET, userUUID}
}

export function setRoleViewAndGetTasks(userUUID, page, role) {
    return { type: SET_ROLE_VIEW_AND_GET_TASKS, data: {userUUID, page, role} }
}

export function resetGroupRelayUUIDs(parentID) {
    return { type: RESET_GROUP_RELAY_UUIDS, parentID }
}

export function groupRelaysTogether() {
    return { type: GROUP_RELAYS_TOGETHER }
}

export function replaceTasksState(data) {
    return {type: REPLACE_TASKS_STATE, data}
}
