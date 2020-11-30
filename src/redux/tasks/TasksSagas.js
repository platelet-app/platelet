import {
    debounce,
    call,
    put,
    takeEvery,
    takeLatest,
    delay,
    select,
} from 'redux-saga/effects'
import {
    restoreTaskRequest,
    updateTaskRejectedTimeRequest,
    updateTaskCancelledTimeRequest,
    updateTaskDropoffTimeRequest,
    updateTaskPickupTimeRequest,
    UPDATE_TASK_PICKUP_ADDRESS_FROM_SAVED_REQUEST,
    UPDATE_TASK_DROPOFF_ADDRESS_FROM_SAVED_REQUEST,
    getTaskNotFound,
    ADD_TASK_RELAY_REQUEST,
    addTaskRelaySuccess,
    addTaskRelayFailure,
    resetGroupRelayUUIDs,
    groupRelaysTogether,
    getAllTasksRequest,
    SET_ROLE_VIEW_AND_GET_TASKS,
    START_REFRESH_TASKS_LOOP_FROM_SOCKET, updateTaskDropoffAddressRequest
} from "./TasksActions"
import {
    ADD_TASK_REQUEST,
    addTaskSuccess,
    UPDATE_TASK_REQUEST,
    updateTaskSuccess,
    RESTORE_TASK_REQUEST,
    restoreTaskSuccess,
    DELETE_TASK_REQUEST,
    deleteTaskSuccess,
    GET_TASKS_REQUEST,
    getAllTasksSuccess,
    GET_MY_TASKS_REQUEST,
    getAllMyTasksSuccess,
    GET_TASK_REQUEST,
    getTaskSuccess,
    updateTaskRequesterContactSuccess,
    updateTaskPickupAddressSuccess,
    updateTaskDropoffAddressSuccess,
    updateTaskPickupTimeSuccess,
    updateTaskDropoffTimeSuccess,
    updateTaskPrioritySuccess,
    updateTaskCancelledTimeSuccess,
    updateTaskRejectedTimeSuccess,
    getAllTasksNotFound,
    getAllTasksFailure,
    getAllMyTasksNotFound,
    getAllMyTasksFailure,
    updateTaskPatchSuccess,

    UPDATE_TASK_REQUESTER_CONTACT_REQUEST,
    UPDATE_TASK_DROPOFF_ADDRESS_REQUEST,
    UPDATE_TASK_PICKUP_ADDRESS_REQUEST,
    UPDATE_TASK_PICKUP_TIME_REQUEST,
    UPDATE_TASK_DROPOFF_TIME_REQUEST,
    UPDATE_TASK_CANCELLED_TIME_REQUEST,
    UPDATE_TASK_REJECTED_TIME_REQUEST,
    UPDATE_TASK_PRIORITY_REQUEST,


    UPDATE_TASK_PATCH_REQUEST,
    REFRESH_TASKS_REQUEST,
    REFRESH_MY_TASKS_REQUEST,
    UPDATE_TASK_PATCH_FROM_SERVER,
    addTaskFailure,
    deleteTaskFailure,
    restoreTaskFailure,
    updateTaskFailure,
    updateTaskRequesterContactFailure,
    updateTaskPickupAddressFailure,
    updateTaskDropoffAddressFailure,
    updateTaskPickupTimeFailure,
    updateTaskDropoffTimeFailure,
    updateTaskPriorityFailure,
    updateTaskPatchFailure,
    updateTaskCancelledTimeFailure,
    updateTaskRejectedTimeFailure,
    getTaskFailure
} from "./TasksActions"
import {updateTaskPatchRequest as updateTaskPatchAction} from "./TasksActions"


import {getApiControl, getWhoami} from "../Api"
import {
    refreshTaskAssignmentsSocket,
    refreshTasksDataSocket,
    subscribeToUUID,
    unsubscribeFromUUID
} from "../sockets/SocketActions";
import React from "react";
import {displayInfoNotification} from "../notifications/NotificationsActions";
import {encodeUUID, findExistingTask, findExistingTaskParent} from "../../utilities";
import {addTaskAssignedCoordinatorRequest} from "../taskAssignees/TaskAssigneesActions";
import {SET_ROLE_VIEW, setRoleView} from "../Actions";
import {getTaskUUIDEtags} from "../../scenes/Dashboard/utilities";
import {createLoadingSelector, createPostingSelector} from "../selectors";
import {useSelector} from "react-redux";


const emptyTask = {
    requester_contact: {
        name: "",
        telephone_number: ""
    },
    assigned_riders: [],
    assigned_coordinators: [],
    time_picked_up: null,
    time_dropped_off: null,
    time_rejected: null,
    time_cancelled: null
};


function* postNewTask(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.createTask], action.data);
        const parentID = result.parent_id ? parseInt(result.parent_id) : 0
        const task = {...action.data, "uuid": result.uuid, parent_id: parentID, order_in_relay: 1};
        yield put(addTaskAssignedCoordinatorRequest({
            taskUUID: task.uuid,
            payload: {task_uuid: task.uuid, user_uuid: result.author_uuid}
        }))
        yield put(addTaskSuccess(task));
        yield put(subscribeToUUID(task.uuid))
    } catch (error) {
        yield put(addTaskFailure(error))
    }
}

export function* watchPostNewTask() {
    yield takeEvery(ADD_TASK_REQUEST, postNewTask)
}

function* postNewTaskRelay(action) {
    try {
        const timeNow = new Date().toISOString();
        const currentTasks = yield select((state) => state.tasks.tasks);
        const previousTask = yield findExistingTask(currentTasks, action.relayPrevious)
        let prevTaskData = {};
        if (previousTask) {
            const {
                time_of_call = timeNow,
                requester_contact = {
                    name: "",
                    telephone_number: ""
                },

                priority = null,
                priority_id = null,
                dropoff_address = null,
                parent_id,
                uuid = null,
            } = {...previousTask};
            prevTaskData = {
                time_of_call,
                requester_contact,
                priority,
                priority_id,
                dropoff_address,
            }
            if (parent_id && uuid)
                prevTaskData = {parent_id, relay_previous_uuid: uuid, ...prevTaskData}


        }
        const api = yield select(getApiControl);
        const whoami = yield select(getWhoami);
        const result = yield call([api, api.tasks.createTask], {
            ...emptyTask, ...prevTaskData,
            time_created: timeNow
        });
        const orderInRelay = result.order_in_relay ? parseInt(result.order_in_relay) : 0;
        const task = {
            ...emptyTask, ...prevTaskData,
            author_uuid: whoami.uuid,
            uuid: result.uuid,
            order_in_relay: orderInRelay
        };
        yield put(addTaskAssignedCoordinatorRequest({
            taskUUID: task.uuid,
            payload: {task_uuid: task.uuid, user_uuid: task.author_uuid}
        }))
        yield put(updateTaskSuccess({
            taskUUID: action.relayPrevious,
            payload: {dropoff_address: null, relay_next: task}
        }))
        yield put(addTaskRelaySuccess(task));
        yield put(subscribeToUUID(task.uuid))
    } catch (error) {
        yield put(addTaskRelayFailure(error))
    }
}

export function* watchPostNewTaskRelay() {
    yield takeEvery(ADD_TASK_RELAY_REQUEST, postNewTaskRelay)
}


function* deleteTask(action) {
    try {
        const api = yield select(getApiControl);
        const currentTasks = yield select((state) => state.tasks.tasks);
        yield call([api, api.tasks.deleteTask], action.data);
        const {taskGroup} = yield findExistingTaskParent(currentTasks, action.data)
        const beforeDelete = yield taskGroup.find(t => t.uuid === action.data)
        // TODO: figure out why the address is magically reappearing on a middle deleted relay
        // figure out if UNDO button can be disabled after one click
        // make sure when restore is done, add it to tasks state only if it doesn't exist otherwise put it instead

        yield put(deleteTaskSuccess(action.data))
        let relayPrevious;
        if (beforeDelete) {
            if (beforeDelete.relay_previous_uuid && taskGroup[taskGroup.length - 1].uuid === beforeDelete.uuid) {
                relayPrevious = yield findExistingTask(currentTasks, beforeDelete.relay_previous_uuid)
                yield put(updateTaskDropoffAddressRequest({
                    taskUUID: beforeDelete.relay_previous_uuid,
                    payload: {dropoff_address: beforeDelete.dropoff_address}
                }))
            }
            yield put(resetGroupRelayUUIDs(beforeDelete.parent_id))
        }
        yield put(unsubscribeFromUUID(action.data))
        let restoreActions;
        if (relayPrevious) {
            restoreActions = () => [
                restoreTaskRequest(action.data),
                updateTaskDropoffAddressRequest({
                    taskUUID: beforeDelete.relay_previous_uuid,
                    payload: {dropoff_address: relayPrevious.dropoff_address}
                })
            ];
        } else {
            restoreActions = () => [
                restoreTaskRequest(action.data)]
        }
        yield put(displayInfoNotification("Task deleted", restoreActions))
    } catch (error) {
        yield put(deleteTaskFailure(error))
    }
}

export function* watchDeleteTask() {
    yield takeEvery(DELETE_TASK_REQUEST, deleteTask)
}

function* restoreTask(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.tasks.restoreTask], action.data);
        const result = yield call([api, api.tasks.getTask], action.data);
        yield put(restoreTaskSuccess(result))
        const currentTasks = yield select((state) => state.tasks.tasks);
        const afterRestore = yield findExistingTask(currentTasks, action.data)
        if (afterRestore) {
            yield put(resetGroupRelayUUIDs(afterRestore.parent_id))
        }
        yield put(subscribeToUUID(result.uuid))
    } catch (error) {
        yield put(restoreTaskFailure(error))
    }
}

export function* watchRestoreTask() {
    yield takeEvery(RESTORE_TASK_REQUEST, restoreTask)
}

function* updateTask(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        const data = {payload: {...action.data.payload, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(updateTaskSuccess(data))
    } catch (error) {
        yield put(updateTaskFailure(error))
    }
}

function* updateTaskRequesterContact(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        const data = {payload: {...action.data.payload, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(updateTaskRequesterContactSuccess(data))
    } catch (error) {
        yield put(updateTaskRequesterContactFailure(error))
    }
}

function* updateTaskPickupAddress(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        const data = {payload: {...action.data.payload, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(updateTaskPickupAddressSuccess(data))
    } catch (error) {
        yield put(updateTaskPickupAddressFailure(error))
    }
}

function* updateTaskPickupAddressFromSaved(action) {
    try {
        const api = yield select(getApiControl);
        const presetDetails = yield call([api, api.locations.getLocation], action.data.payload);
        const pickup_address = presetDetails.address;
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, {pickup_address});
        const data = {payload: {pickup_address, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(updateTaskPickupAddressSuccess(data))
    } catch (error) {
        yield put(updateTaskPickupAddressFailure(error))
    }
}

function* updateTaskDropoffAddress(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        const data = {payload: {...action.data.payload, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(updateTaskDropoffAddressSuccess(data))
    } catch (error) {
        yield put(updateTaskDropoffAddressFailure(error))
    }
}

function* updateTaskDropoffAddressFromSaved(action) {
    try {
        const api = yield select(getApiControl);
        const presetDetails = yield call([api, api.locations.getLocation], action.data.payload);
        const dropoff_address = presetDetails.address;
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, {dropoff_address});
        const data = {payload: {dropoff_address, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(updateTaskDropoffAddressSuccess(data))
    } catch (error) {
        yield put(updateTaskDropoffAddressFailure(error))
    }
}

function* updateTaskPickupTime(action) {
    try {
        const currentTasks = yield select((state) => state.tasks.tasks);
        const task = yield findExistingTask(currentTasks, action.data.taskUUID)
        const currentValue = task ? task.time_picked_up : null;
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        const data = {payload: {...action.data.payload, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(updateTaskPickupTimeSuccess(data))
        if (currentValue === null) {
            // only notify if marking rejected for the first time
            const restoreActions = () => [updateTaskPickupTimeRequest({
                taskUUID: action.data.taskUUID,
                payload: {time_picked_up: null}
            })];
            const viewLink = `/task/${encodeUUID(action.data.taskUUID)}`
            yield put(displayInfoNotification("Task marked picked up", restoreActions, viewLink))
        }
    } catch (error) {
        yield put(updateTaskPickupTimeFailure(error))
    }
}

function* updateTaskDropoffTime(action) {
    try {
        const currentTasks = yield select((state) => state.tasks.tasks);
        const task = yield findExistingTask(currentTasks, action.data.taskUUID)
        const currentValue = task ? task.time_dropped_off : null;
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        const data = {payload: {...action.data.payload, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(updateTaskDropoffTimeSuccess(data))
        if (currentValue === null) {
            // only notify if marking rejected for the first time
            const restoreActions = () => [updateTaskDropoffTimeRequest({
                taskUUID: action.data.taskUUID,
                payload: {time_dropped_off: null}
            })];
            const viewLink = `/task/${encodeUUID(action.data.taskUUID)}`
            yield put(displayInfoNotification("Task marked dropped off", restoreActions, viewLink))
        }
    } catch (error) {
        yield put(updateTaskDropoffTimeFailure(error))
    }
}

function* updateTaskPriority(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        const data = {payload: {...action.data.payload, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(updateTaskPrioritySuccess(data))
    } catch (error) {
        yield put(updateTaskPriorityFailure(error))
    }
}

function* updateTaskPatch(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        const data = {payload: {...action.data.payload, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(updateTaskPatchSuccess(data))
    } catch (error) {
        yield put(updateTaskPatchFailure(error))
    }
}

function* updateTaskPatchFromServer(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.getTaskAssignedRiders], action.data.taskUUID);
        const lastResult = result.slice(-1)[0]
        const payload = lastResult ? {patch: lastResult.patch, patch_id: lastResult.patch_id} : {
            patch: "",
            patch_id: null
        };
        yield put(updateTaskPatchAction({taskUUID: action.data.taskUUID, payload}))
    } catch (error) {
        yield put(updateTaskPatchFailure(error))
    }
}

function* updateTaskCancelledTime(action) {
    try {
        // get the current task rejected_time value to make sure it isn't already marked
        const currentTasks = yield select((state) => state.tasks.tasks);
        const task = yield findExistingTask(currentTasks, action.data.taskUUID)
        const currentValue = task ? task.time_cancelled : null;
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        // set the relays all to null to prevent visual indication on the grid
        const data = {
            payload: {
                ...action.data.payload,
                etag: result.etag,
                relay_previous_uuid: null,
                relay_next: null,
                relay_previous: null
            }, taskUUID: action.data.taskUUID
        }
        yield put(updateTaskCancelledTimeSuccess(data))
        yield put(resetGroupRelayUUIDs(task.parent_id))
        if (currentValue === null) {
            // only notify if marking rejected for the first time
            const restoreActions = () => [updateTaskCancelledTimeRequest({
                taskUUID: action.data.taskUUID,
                payload: {time_cancelled: null}
            })];
            const viewLink = `/task/${encodeUUID(action.data.taskUUID)}`
            yield put(displayInfoNotification("Task marked cancelled", restoreActions, viewLink))
        }
    } catch (error) {
        yield put(updateTaskCancelledTimeFailure(error))
    }
}

function* updateTaskRejectedTime(action) {
    try {
        // get the current task rejected_time value to make sure it isn't already marked
        const currentTasks = yield select((state) => state.tasks.tasks);
        const task = yield findExistingTask(currentTasks, action.data.taskUUID)
        const currentValue = task ? task.time_rejected : null;
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        // set the relays all to null to prevent visual indication on the grid
        const data = {
            payload: {
                ...action.data.payload,
                etag: result.etag,
                relay_previous_uuid: null,
                relay_next: null,
                relay_previous: null
            }, taskUUID: action.data.taskUUID
        }
        yield put(updateTaskRejectedTimeSuccess(data))
        // then recalculate it
        yield put(groupRelaysTogether())
        yield put(resetGroupRelayUUIDs(task.parent_id))

        if (currentValue === null) {
            // only notify if marking rejected for the first time
            const restoreActions = () => [updateTaskRejectedTimeRequest({
                taskUUID: action.data.taskUUID,
                payload: {time_rejected: null}
            })];
            const viewLink = `/task/${encodeUUID(action.data.taskUUID)}`
            yield put(displayInfoNotification("Task marked rejected", restoreActions, viewLink))
        }
    } catch (error) {
        yield put(updateTaskRejectedTimeFailure(error))
    }
}

export function* watchUpdateTask() {
    yield takeEvery(UPDATE_TASK_REQUEST, updateTask)
}

export function* watchUpdateTaskRequesterContact() {
    yield debounce(500, UPDATE_TASK_REQUESTER_CONTACT_REQUEST, updateTaskRequesterContact)
}

export function* watchUpdateTaskPickupAddress() {
    yield debounce(500, UPDATE_TASK_PICKUP_ADDRESS_REQUEST, updateTaskPickupAddress)
}

export function* watchUpdateTaskPickupAddressFromSaved() {
    yield takeEvery(UPDATE_TASK_PICKUP_ADDRESS_FROM_SAVED_REQUEST, updateTaskPickupAddressFromSaved)
}

export function* watchUpdateTaskDropoffAddress() {
    yield debounce(500, UPDATE_TASK_DROPOFF_ADDRESS_REQUEST, updateTaskDropoffAddress)
}

export function* watchUpdateTaskDropoffAddressFromSaved() {
    yield takeEvery(UPDATE_TASK_DROPOFF_ADDRESS_FROM_SAVED_REQUEST, updateTaskDropoffAddressFromSaved)
}

export function* watchUpdateTaskPickupTime() {
    yield debounce(300, UPDATE_TASK_PICKUP_TIME_REQUEST, updateTaskPickupTime)
}

export function* watchUpdateTaskDropoffTime() {
    yield debounce(300, UPDATE_TASK_DROPOFF_TIME_REQUEST, updateTaskDropoffTime)
}

export function* watchUpdateTaskPriority() {
    yield debounce(500, UPDATE_TASK_PRIORITY_REQUEST, updateTaskPriority)
}

export function* watchUpdateTaskPatch() {
    yield debounce(300, UPDATE_TASK_PATCH_REQUEST, updateTaskPatch)
}

export function* watchUpdateTaskPatchFromServer() {
    yield debounce(300, UPDATE_TASK_PATCH_FROM_SERVER, updateTaskPatchFromServer)
}

export function* watchUpdateTaskCancelledTime() {
    yield debounce(300, UPDATE_TASK_CANCELLED_TIME_REQUEST, updateTaskCancelledTime)
}

export function* watchUpdateTaskRejectedTime() {
    yield debounce(300, UPDATE_TASK_REJECTED_TIME_REQUEST, updateTaskRejectedTime)
}

function* getTask(action) {
    try {
        const currentTasks = yield select((state) => state.tasks.tasks);
        let task = findExistingTask(currentTasks, action.data)
        if (task) {
            // if it's already in the list of tasks, no need to get it
            yield put(getTaskSuccess(task))
        } else {
            // not in the list so call the api
            const api = yield select(getApiControl);
            const result = yield call([api, api.tasks.getTask], action.data);
            yield put(getTaskSuccess(result))
        }
    } catch (error) {
        if (error.name === "HttpError") {
            if (error.response.status === 404) {
                yield put(getTaskNotFound(error))
            }
        }
        yield put(getTaskFailure(error))
    }
}

export function* watchGetTask() {
    yield takeLatest(GET_TASK_REQUEST, getTask)
}

function* getTasks(action) {
    try {
        const api = yield select(getApiControl);
        // get all the different tasks for different status and combine them
        const tasksNew = yield call([api, api.tasks.getTasks], action.data, 0, action.role, "new");
        const tasksActive = yield call([api, api.tasks.getTasks], action.data, 0, action.role, "active");
        const tasksPickedUp = yield call([api, api.tasks.getTasks], action.data, 0, action.role, "picked_up");
        const tasksDelivered = yield call([api, api.tasks.getTasks], action.data, action.page, action.role, "delivered");
        const tasksCancelled = yield call([api, api.tasks.getTasks], action.data, action.page, action.role, "cancelled");
        const tasksRejected = yield call([api, api.tasks.getTasks], action.data, action.page, action.role, "rejected");
        yield put(getAllTasksSuccess({
            tasksNew,
            tasksActive,
            tasksPickedUp,
            tasksDelivered,
            tasksCancelled,
            tasksRejected
        }))
    } catch (error) {
        throw error;
        if (error.name === "HttpError") {
            if (error.response.status === 404) {
                yield put(getAllTasksNotFound(error))
            }
        }
        yield put(getAllTasksFailure(error))
    }
}

export function* watchGetTasks() {
    yield takeLatest(GET_TASKS_REQUEST, getTasks)
}

export function* refreshTasksFromSocket(action) {
    //TODO: figure out why this always refreshes the task even when it doesn't need to
    while (true) {
        const loadingSelector = yield createLoadingSelector(['GET_TASKS']);
        const isFetching = yield select(state => loadingSelector(state));
        const isPostingNewTaskSelector = yield createPostingSelector(["UPDATE_TASK_PRIORITY"]);
        const isPosting = yield select(state => isPostingNewTaskSelector(state));
        const isIdle = yield select((state) => state.idleStatus);
        if (isPosting || isFetching || isIdle) {
            console.log("waiting")
            yield delay(3 * 1000);
        } else {
            const currentTasks = yield select((state) => state.tasks.tasks);
            const currentRole = yield select((state) => state.roleView);
            const uuidEtags = yield getTaskUUIDEtags(currentTasks);
            const uuids = yield Object.keys(uuidEtags);
            if (action.userUUID)
                yield put(refreshTaskAssignmentsSocket(action.userUUID, uuids, currentRole))
            yield put(refreshTasksDataSocket(uuidEtags));
            yield delay(30 * 1000);
        }
    }
}

export function* watchRefreshTasksFromSocket() {
    yield takeLatest(START_REFRESH_TASKS_LOOP_FROM_SOCKET, refreshTasksFromSocket)
}


function* setRoleViewAndGetTasks(action) {
    yield put(getAllTasksRequest(action.userUUID, action.page, action.role))
    yield put(setRoleView(action.role))
}

export function* watchSetRoleViewAndGetTasks() {
    yield takeLatest(SET_ROLE_VIEW_AND_GET_TASKS, setRoleViewAndGetTasks)
}

function* refreshTasks(action) {
    try {
        const api = yield select(getApiControl);
        let result = yield call([api, api.tasks.getTasks], action.data);
        yield put(getAllTasksSuccess(result))
    } catch (error) {
        if (error.name === "HttpError") {
            if (error.response.status === 404) {
                yield put(getAllTasksNotFound(error))
            }
        }
        yield put(getAllTasksFailure(error))
    }
}

export function* watchRefreshTasks() {
    yield takeLatest(REFRESH_TASKS_REQUEST, refreshTasks)
}

function* getMyTasks() {
    try {
        const api = yield select(getApiControl);
        const whoami = yield call([api, api.users.whoami]);
        const result = yield call([api, api.users.getAssignedTasks], whoami.uuid);
        yield put(getAllMyTasksSuccess(result))
    } catch (error) {
        if (error.name === "HttpError") {
            if (error.response.status === 404) {
                yield put(getAllMyTasksNotFound(error))
            }
        }
        yield put(getAllMyTasksFailure(error))
    }
}

export function* watchGetMyTasks() {
    yield takeLatest(GET_MY_TASKS_REQUEST, getMyTasks)
}

export function* watchRefreshMyTasks() {
    yield takeLatest(REFRESH_MY_TASKS_REQUEST, getMyTasks)
}
