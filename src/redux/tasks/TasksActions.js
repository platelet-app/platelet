import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const ADD_TASK_REQUEST = "ADD_TASK_REQUEST";
export const ADD_TASK_SUCCESS = "ADD_TASK_SUCCESS";
export const ADD_TASK_FAILURE = "ADD_TASK_FAILURE";
export const ADD_TASK_RELAY_REQUEST = "ADD_TASK_RELAY_REQUEST";
export const ADD_TASK_RELAY_SUCCESS = "ADD_TASK_RELAY_SUCCESS";
export const ADD_TASK_RELAY_FAILURE = "ADD_TASK_RELAY_FAILURE";
export const DELETE_TASK_REQUEST = "DELETE_TASK_REQUEST";
export const DELETE_TASK_SUCCESS = "DELETE_TASK_SUCCESS";
export const DELETE_TASK_FAILURE = "DELETE_TASK_FAILURE";
export const RESTORE_TASK_REQUEST = "RESTORE_TASK_REQUEST";
export const RESTORE_TASK_SUCCESS = "RESTORE_TASK_SUCCESS";
export const RESTORE_TASK_FAILURE = "RESTORE_TASK_FAILURE";

export const PUT_TASK_SUCCESS = "PUT_TASK_SUCCESS";
export const PUT_TASK_FROM_SOCKET = "PUT_TASK_FROM_SOCKET";

export const SET_CURRENT_TASK = "SET_CURRENT_TASK";
export const CLEAR_CURRENT_TASK = "CLEAR_CURRENT_TASK";

export const UPDATE_TASK_REQUESTER_CONTACT_REQUEST = "UPDATE_TASK_REQUESTER_CONTACT_REQUEST";
export const UPDATE_TASK_PICKUP_ADDRESS_REQUEST = "UPDATE_TASK_PICKUP_ADDRESS_REQUEST";
export const UPDATE_TASK_PICKUP_ADDRESS_FROM_SAVED_REQUEST = "UPDATE_TASK_PICKUP_ADDRESS_FROM_SAVED_REQUEST";
export const UPDATE_TASK_DROPOFF_ADDRESS_REQUEST = "UPDATE_TASK_DROPOFF_ADDRESS_REQUEST";
export const UPDATE_TASK_DROPOFF_ADDRESS_FROM_SAVED_REQUEST = "UPDATE_TASK_DROPOFF_ADDRESS_FROM_SAVED_REQUEST";
export const UPDATE_TASK_PICKUP_TIME_REQUEST = "UPDATE_TASK_PICKUP_TIME_REQUEST";
export const UPDATE_TASK_DROPOFF_TIME_REQUEST = "UPDATE_TASK_DROPOFF_TIME_REQUEST";
export const UPDATE_TASK_CANCELLED_TIME_REQUEST = "UPDATE_TASK_CANCELLED_TIME_REQUEST";
export const UPDATE_TASK_REJECTED_TIME_REQUEST = "UPDATE_TASK_REJECTED_TIME_REQUEST";

export const UPDATE_TASK_TIME_CANCELLED_FROM_SOCKET = "UPDATE_TASK_TIME_CANCELLED_FROM_SOCKET";
export const UPDATE_TASK_TIME_REJECTED_FROM_SOCKET = "UPDATE_TASK_TIME_REJECTED_FROM_SOCKET";
export const UPDATE_TASK_ASSIGNED_RIDER_REQUEST = "UPDATE_TASK_ASSIGNED_RIDER_REQUEST";
export const UPDATE_TASK_ASSIGNED_COORDINATOR_REQUEST = "UPDATE_TASK_ASSIGNED_COORDINATOR_REQUEST";
export const UPDATE_TASK_PRIORITY_REQUEST = "UPDATE_TASK_PRIORITY_REQUEST";
export const UPDATE_TASK_PATCH_REQUEST = "UPDATE_TASK_PATCH_REQUEST";
export const UPDATE_TASK_PATCH_FROM_SERVER = "UPDATE_TASK_PATCH_FROM_SERVER";
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

export const UPDATE_TASK_REQUESTER_CONTACT_SUCCESS = "UPDATE_TASK_REQUESTER_CONTACT_SUCCESS";
export const UPDATE_TASK_PICKUP_ADDRESS_SUCCESS = "UPDATE_TASK_PICKUP_ADDRESS_SUCCESS";
export const UPDATE_TASK_DROPOFF_ADDRESS_SUCCESS = "UPDATE_TASK_DROPOFF_ADDRESS_SUCCESS";
export const UPDATE_TASK_PICKUP_TIME_SUCCESS = "UPDATE_TASK_PICKUP_TIME_SUCCESS";
export const UPDATE_TASK_DROPOFF_TIME_SUCCESS = "UPDATE_TASK_DROPOFF_TIME_SUCCESS";
export const UPDATE_TASK_CANCELLED_TIME_SUCCESS = "UPDATE_TASK_CANCELLED_TIME_SUCCESS";
export const UPDATE_TASK_REJECTED_TIME_SUCCESS = "UPDATE_TASK_REJECTED_TIME_SUCCESS";
export const UPDATE_TASK_ASSIGNED_RIDER_SUCCESS = "UPDATE_TASK_ASSIGNED_RIDER_SUCCESS";
export const UPDATE_TASK_REMOVE_ASSIGNED_RIDER_SUCCESS = "UPDATE_TASK_REMOVE_ASSIGNED_RIDER_SUCCESS";
export const UPDATE_TASK_ASSIGNED_COORDINATOR_SUCCESS = "UPDATE_TASK_ASSIGNED_COORDINATOR_SUCCESS";
export const UPDATE_TASK_REMOVE_ASSIGNED_COORDINATOR_SUCCESS = "UPDATE_TASK_REMOVE_ASSIGNED_COORDINATOR_SUCCESS";
export const UPDATE_TASK_PRIORITY_SUCCESS = "UPDATE_TASK_PRIORITY_SUCCESS";
export const UPDATE_TASK_PATCH_SUCCESS = "UPDATE_TASK_PATCH_SUCCESS";

export const UPDATE_TASK_REQUESTER_CONTACT_FAILURE = "UPDATE_TASK_REQUESTER_CONTACT_FAILURE";
export const UPDATE_TASK_PICKUP_ADDRESS_FAILURE = "UPDATE_TASK_PICKUP_ADDRESS_FAILURE";
export const UPDATE_TASK_DROPOFF_ADDRESS_FAILURE = "UPDATE_TASK_DROPOFF_ADDRESS_FAILURE";
export const UPDATE_TASK_PICKUP_TIME_FAILURE = "UPDATE_TASK_PICKUP_TIME_FAILURE";
export const UPDATE_TASK_DROPOFF_TIME_FAILURE = "UPDATE_TASK_DROPOFF_TIME_FAILURE";
export const UPDATE_TASK_CANCELLED_TIME_FAILURE = "UPDATE_TASK_CANCELLED_TIME_FAILURE";
export const UPDATE_TASK_REJECTED_TIME_FAILURE = "UPDATE_TASK_REJECTED_TIME_FAILURE";
export const UPDATE_TASK_ASSIGNED_RIDER_FAILURE = "UPDATE_TASK_ASSIGNED_RIDER_FAILURE";
export const UPDATE_TASK_ASSIGNED_COORDINATOR_FAILURE = "UPDATE_TASK_ASSIGNED_COORDINATOR_FAILURE";
export const UPDATE_TASK_PRIORITY_FAILURE = "UPDATE_TASK_PRIORITY_FAILURE";
export const UPDATE_TASK_PATCH_FAILURE = "UPDATE_TASK_PATCH_FAILURE";

export const UPDATE_TASK_REQUEST = "UPDATE_TASK_REQUEST";
export const UPDATE_TASK_SUCCESS = "UPDATE_TASK_SUCCESS";
export const UPDATE_TASK_FAILURE = "UPDATE_TASK_FAILURE";
export const SET_ROLE_VIEW_AND_GET_TASKS = "SET_ROLE_VIEW_AND_GET_TASKS";
export const GET_TASKS_REQUEST = "GET_TASKS_REQUEST";
export const GET_TASKS_SUCCESS = "GET_TASKS_SUCCESS";
export const GET_TASKS_NOTFOUND = "GET_TASKS_NOTFOUND";
export const GET_TASKS_FAILURE = "GET_TASKS_FAILURE";
export const REFRESH_TASKS_REQUEST = "REFRESH_TASKS_REQUEST";
export const REFRESH_TASKS_SUCCESS = "REFRESH_TASKS_SUCCESS";
export const REFRESH_TASKS_FAILURE = "REFRESH_TASKS_FAILURE";
export const GET_MY_TASKS_REQUEST = "GET_MY_TASKS_REQUEST";
export const GET_MY_TASKS_SUCCESS = "GET_MY_TASKS_SUCCESS";
export const GET_MY_TASKS_FAILURE = "GET_MY_TASKS_FAILURE";
export const GET_MY_TASKS_NOTFOUND = "GET_MY_TASKS_NOTFOUND";
export const REFRESH_MY_TASKS_REQUEST = "REFRESH_MY_TASKS_REQUEST";
export const REFRESH_MY_TASKS_SUCCESS = "REFRESH_MY_TASKS_SUCCESS";
export const REFRESH_MY_TASKS_FAILURE = "REFRESH_MY_TASKS_FAILURE";
export const REFRESH_MY_TASKS_NOTFOUND = "REFRESH_MY_TASKS_NOTFOUND";

export const RESET_GROUP_RELAY_UUIDS = "RESET_GROUP_RELAY_UUIDS";
export const GROUP_RELAYS_TOGETHER = "GROUP_RELAYS_TOGETHER";


export const updateTaskTimeOfCallPrefix = "UPDATE_TASK_TIME_OF_CALL";
export const updateTaskTimeOfCallActions = createRequestActions(updateTaskTimeOfCallPrefix);
export const { updateTaskTimeOfCallFailure, updateTaskTimeOfCallSuccess } = createRequestFunctions(updateTaskTimeOfCallActions)

export const updateTaskTimeCancelledPrefix = "UPDATE_TASK_TIME_CANCELLED";
export const updateTaskTimeCancelledActions = createRequestActions(updateTaskTimeCancelledPrefix)
export const {updateTaskTimeCancelledFailure, updateTaskTimeCancelledSuccess} = createRequestFunctions(updateTaskTimeCancelledActions)

export function updateTaskTimeOfCallRequest(taskUUID, payload) {
    return { type: updateTaskTimeOfCallActions.request, data: {taskUUID, payload} }
}

export function restoreTaskRequest(taskUUID) {
    return { type: RESTORE_TASK_REQUEST, data: {taskUUID }}
}

export function restoreTaskSuccess(data) {
    return { type: RESTORE_TASK_SUCCESS, data }
}

export function restoreTaskFailure(error) {
    return { type: RESTORE_TASK_FAILURE, error }
}

export function putTaskSuccess(data) {
    return { type: PUT_TASK_SUCCESS, data }
}

export function putTaskFromSocket(data) {
    return { type: PUT_TASK_FROM_SOCKET, data }
}

export function addTaskRequest(payload) {
    return { type: ADD_TASK_REQUEST, data: {payload }}
}

export function addTaskSuccess(data) {
    return { type: ADD_TASK_SUCCESS, data }
}

export function addTaskFailure(error) {
    return { type: ADD_TASK_FAILURE, error }
}

export function addTaskRelayRequest(relayPrevious) {
    return { type: ADD_TASK_RELAY_REQUEST, data: {relayPrevious }}
}

export function addTaskRelaySuccess(data) {
    return { type: ADD_TASK_RELAY_SUCCESS, data }
}

export function addTaskRelayFailure(error) {
    return { type: ADD_TASK_RELAY_FAILURE, error }
}

export function deleteTaskRequest(taskUUID) {
    return { type: DELETE_TASK_REQUEST, data: {taskUUID }}
}

export function deleteTaskSuccess(data) {
    return { type: DELETE_TASK_SUCCESS, data }
}

export function deleteTaskFailure(error) {
    return { type: DELETE_TASK_FAILURE, error }
}

export function updateTaskRequest(taskUUID, payload) {
    return { type: UPDATE_TASK_REQUEST, data: {taskUUID, payload} }
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

export function updateTaskRequesterContactRequest(taskUUID, payload) {
    return { type: UPDATE_TASK_REQUESTER_CONTACT_REQUEST, data: {taskUUID, payload }}
}
export function updateTaskPickupAddressRequest(taskUUID, payload) {
    return { type: UPDATE_TASK_PICKUP_ADDRESS_REQUEST, data: {taskUUID, payload }}
}
export function updateTaskPickupAddressFromSavedRequest(taskUUID, locationUUID) {
    return { type: UPDATE_TASK_PICKUP_ADDRESS_FROM_SAVED_REQUEST, data: {taskUUID, locationUUID }}
}
export function updateTaskDropoffAddressFromSavedRequest(taskUUID, locationUUID) {
    return { type: UPDATE_TASK_DROPOFF_ADDRESS_FROM_SAVED_REQUEST, data: { taskUUID, locationUUID }}
}
export function updateTaskDropoffAddressRequest(taskUUID, payload) {
    return { type: UPDATE_TASK_DROPOFF_ADDRESS_REQUEST, data: {taskUUID, payload} }
}
export function updateTaskPickupTimeRequest(taskUUID, payload) {
    return { type: UPDATE_TASK_PICKUP_TIME_REQUEST, data: {taskUUID, payload} }
}
export function updateTaskDropoffTimeRequest(taskUUID, payload) {
    return { type: UPDATE_TASK_DROPOFF_TIME_REQUEST, data: {taskUUID, payload} }
}
export function updateTaskTimeCancelledRequest(taskUUID, payload) {
    return { type: updateTaskTimeCancelledActions.request, data: {taskUUID, payload} }
}
export function updateTaskRejectedTimeRequest(taskUUID, payload) {
    return { type: UPDATE_TASK_REJECTED_TIME_REQUEST, data: {taskUUID, payload} }
}
export function updateTaskAssignedRiderRequest(data) {
    return { type: UPDATE_TASK_ASSIGNED_RIDER_REQUEST, data }
}

export function updateTaskAssignedCoordinatorRequest(data) {
    return { type: UPDATE_TASK_ASSIGNED_COORDINATOR_REQUEST, data }
}

export function updateTaskPriorityRequest(taskUUID, payload) {
    return { type: UPDATE_TASK_PRIORITY_REQUEST, data: {taskUUID, payload} }
}

export function updateTaskPatchRequest(taskUUID, payload) {
    return { type: UPDATE_TASK_PATCH_REQUEST, data: {taskUUID, payload} }
}

export function updateTaskPatchFromServer(taskUUID) {
    return { type: UPDATE_TASK_PATCH_FROM_SERVER, data: {taskUUID} }
}

export function updateTaskRequesterContactSuccess(data) {
    return { type: UPDATE_TASK_REQUESTER_CONTACT_SUCCESS, data }
}
export function updateTaskPickupAddressSuccess(data) {
    return { type: UPDATE_TASK_PICKUP_ADDRESS_SUCCESS, data }
}
export function updateTaskDropoffAddressSuccess(data) {
    return { type: UPDATE_TASK_DROPOFF_ADDRESS_SUCCESS, data }
}
export function updateTaskPickupTimeSuccess(data) {
    return { type: UPDATE_TASK_PICKUP_TIME_SUCCESS, data }
}
export function updateTaskDropoffTimeSuccess(data) {
    return { type: UPDATE_TASK_DROPOFF_TIME_SUCCESS, data }
}
export function updateTaskRejectedTimeSuccess(data) {
    return { type: UPDATE_TASK_REJECTED_TIME_SUCCESS, data }
}
export function updateTaskAssignedRiderSuccess(data) {
    return { type: UPDATE_TASK_ASSIGNED_RIDER_SUCCESS, data }
}

export function updateTaskAssignedCoordinatorSuccess(data) {
    return { type: UPDATE_TASK_ASSIGNED_COORDINATOR_SUCCESS, data }
}

export function updateTaskRemoveAssignedRiderSuccess(data) {
    return { type: UPDATE_TASK_REMOVE_ASSIGNED_RIDER_SUCCESS, data }
}

export function updateTaskRemoveAssignedCoordinatorSuccess(data) {
    return { type: UPDATE_TASK_REMOVE_ASSIGNED_COORDINATOR_SUCCESS, data }
}

export function updateTaskPrioritySuccess(data) {
    return { type: UPDATE_TASK_PRIORITY_SUCCESS, data }
}

export function updateTaskPatchSuccess(data) {
    return { type: UPDATE_TASK_PATCH_SUCCESS, data }
}

export function updateTaskSuccess(data) {
    return { type: UPDATE_TASK_SUCCESS, data }
}

export function updateTaskFailure(error) {
    return { type: UPDATE_TASK_FAILURE, error }
}

export function updateTaskRequesterContactFailure(error) {
    return { type: UPDATE_TASK_REQUESTER_CONTACT_FAILURE, error }
}
export function updateTaskPickupAddressFailure(error) {
    return { type: UPDATE_TASK_PICKUP_ADDRESS_FAILURE, error }
}
export function updateTaskDropoffAddressFailure(error) {
    return { type: UPDATE_TASK_DROPOFF_ADDRESS_FAILURE, error }
}
export function updateTaskPickupTimeFailure(error) {
    return { type: UPDATE_TASK_PICKUP_TIME_FAILURE, error }
}
export function updateTaskDropoffTimeFailure(error) {
    return { type: UPDATE_TASK_DROPOFF_TIME_FAILURE, error }
}

export function updateTaskRejectedTimeFailure(error) {
    return { type: UPDATE_TASK_REJECTED_TIME_FAILURE, error }
}
export function updateTaskAssignedRiderFailure(error) {
    return { type: UPDATE_TASK_ASSIGNED_RIDER_FAILURE, error }
}

export function updateTaskAssignedCoordinatorFailure(error) {
    return { type: UPDATE_TASK_ASSIGNED_COORDINATOR_FAILURE, error }
}

export function updateTaskPriorityFailure(error) {
    return { type: UPDATE_TASK_PRIORITY_FAILURE, error }
}

export function updateTaskPatchFailure(error) {
    return { type: UPDATE_TASK_PATCH_FAILURE, error }
}

export function getAllTasksRequest(userUUID, page, role) {
    return { type: GET_TASKS_REQUEST, data: {userUUID, page, role} }
}

export function setRoleViewAndGetTasks(userUUID, page, role) {
    return { type: SET_ROLE_VIEW_AND_GET_TASKS, data: {userUUID, page, role} }
}

export function getAllTasksSuccess(data) {
    return { type: GET_TASKS_SUCCESS, data }
}

export function refreshAllTasksRequest(userUUID) {
    return { type: REFRESH_TASKS_REQUEST, userUUID }
}

export function refreshAllTasksSuccess(data) {
    return { type: REFRESH_TASKS_SUCCESS, data }
}

export function getAllTasksFailure(error) {
    return { type: GET_TASKS_FAILURE, error }
}

export function getAllTasksNotFound(data) {
    return { type: GET_TASKS_NOTFOUND, data }
}

export function getAllMyTasksRequest() {
    return { type: GET_MY_TASKS_REQUEST }
}

export function getAllMyTasksSuccess(data) {
    return { type: GET_MY_TASKS_SUCCESS, data }
}

export function getAllMyTasksFailure(error) {
    return { type: GET_MY_TASKS_FAILURE, error }
}

export function getAllMyTasksNotFound(error) {
    return { type: GET_MY_TASKS_NOTFOUND, error }
}

export function refreshAllMyTasksRequest() {
    return { type: REFRESH_MY_TASKS_REQUEST }
}

export function refreshAllMyTasksSuccess(data) {
    return { type: REFRESH_MY_TASKS_SUCCESS, data }
}

export function refreshAllMyTasksFailure(error) {
    return { type: REFRESH_MY_TASKS_FAILURE, error }
}

export function refreshAllMyTasksNotFound(error) {
    return { type: REFRESH_MY_TASKS_NOTFOUND, error }
}

export function resetGroupRelayUUIDs(parentID) {
    return { type: RESET_GROUP_RELAY_UUIDS, parentID }
}

export function groupRelaysTogether() {
    return { type: GROUP_RELAYS_TOGETHER }
}

