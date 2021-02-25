import {
    debounce,
    call,
    put,
    takeEvery,
    takeLatest,
    delay,
    select,
    all
} from 'redux-saga/effects'
import {
    restoreTaskRequest,
    updateTaskRejectedTimeRequest,
    updateTaskDropoffTimeRequest,
    updateTaskPickupTimeRequest,
    addTaskRelaySuccess,
    addTaskRelayFailure,
    resetGroupRelayUUIDs,
    groupRelaysTogether,
    getAllTasksRequest,
    SET_ROLE_VIEW_AND_GET_TASKS,
    START_REFRESH_TASKS_LOOP_FROM_SOCKET,
    updateTaskTimeOfCallFailure,
    updateTaskTimeOfCallSuccess,
    updateTaskTimeOfCallActions,
    updateTaskCancelledTimeRequest,
    addTaskActions,
    addTaskRelayActions,
    deleteTaskActions,
    restoreTaskActions,
    updateTaskCancelledTimeSuccess,
    updateTaskCancelledTimeFailure,
    updateTaskActions,
    getTasksActions,
    getTasksSuccess,
    getTasksNotFound,
    getTasksFailure,
    updateTaskRequesterContactActions,
    updateTaskPickupTimeActions,
    updateTaskDropoffTimeActions,
    updateTaskPriorityActions,
    updateTaskPatchActions,
    updateTaskCancelledTimeActions,
    updateTaskRejectedTimeActions,
} from "./TasksActions"
import {
    addTaskSuccess,
    updateTaskSuccess,
    restoreTaskSuccess,
    deleteTaskSuccess,
    updateTaskRequesterContactSuccess,
    updateTaskPickupTimeSuccess,
    updateTaskDropoffTimeSuccess,
    updateTaskPrioritySuccess,
    updateTaskRejectedTimeSuccess,
    updateTaskPatchSuccess,
    addTaskFailure,
    deleteTaskFailure,
    restoreTaskFailure,
    updateTaskFailure,
    updateTaskRequesterContactFailure,
    updateTaskPickupTimeFailure,
    updateTaskDropoffTimeFailure,
    updateTaskPriorityFailure,
    updateTaskPatchFailure,
    updateTaskRejectedTimeFailure,
    updateTaskPatchRequest
} from "./TasksActions"


import {getApiControl, getWhoami} from "../Api"
import {
    refreshTaskAssignmentsSocket,
    refreshTasksDataSocket,
    subscribeToUUID,
    unsubscribeFromUUID
} from "../sockets/SocketActions";
import {displayInfoNotification} from "../notifications/NotificationsActions";
import {encodeUUID, findExistingTask, findExistingTaskParent} from "../../utilities";
import {addTaskAssignedCoordinatorRequest} from "../taskAssignees/TaskAssigneesActions";
import { setRoleView } from "../Actions";
import {getTaskUUIDEtags} from "../../scenes/Dashboard/utilities";
import {createLoadingSelector, createPostingSelector} from "../selectors";
import {convertTaskListsToObjects, taskGroupSort} from "./task_redux_utilities";
import {
    setTaskDropoffDestinationRequest,
    unsetTaskDropoffDestinationRequest
} from "../taskDestinations/TaskDestinationsActions";


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
        const result = yield call([api, api.tasks.createTask], action.data.payload);
        const parentID = result.parent_id ? parseInt(result.parent_id) : 0
        const task = {...action.data.payload, "uuid": result.uuid, parent_id: parentID, order_in_relay: 1, reference: result.reference};
        yield put(addTaskAssignedCoordinatorRequest(task.uuid, result.author_uuid))
        yield put(addTaskSuccess(task));
        yield put(subscribeToUUID(task.uuid))
    } catch (error) {
        yield put(addTaskFailure(error))
    }
}

export function* watchPostNewTask() {
    yield takeEvery(addTaskActions.request, postNewTask)
}

const emptyAddress = {
    ward: null,
    line1: null,
    line2: null,
    town: null,
    county: null,
    country: null,
    postcode: null,
    what3words: null
}

function* postNewTaskRelay(action) {
    try {
        const timeNow = new Date().toISOString();
        const currentTasks = yield select((state) => state.tasks.tasks);
        const previousTask = yield findExistingTask(currentTasks, action.data.relayPrevious)
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
                parent_id,
                uuid = null,
            } = {...previousTask};
            prevTaskData = {
                time_of_call,
                requester_contact,
                priority,
                priority_id,
            }
            if (parent_id && uuid)
                prevTaskData = {parent_id, relay_previous_uuid: uuid, ...prevTaskData}


        }
        const api = yield select(getApiControl);
        const whoami = yield select(getWhoami);
        const result = yield call([api, api.tasks.createTask], {
            ...emptyTask, ...prevTaskData,
        });
        const orderInRelay = result.order_in_relay ? parseInt(result.order_in_relay) : 0;
        const task = {
            ...emptyTask, ...prevTaskData,
            author_uuid: whoami.uuid,
            uuid: result.uuid,
            order_in_relay: orderInRelay,
            reference: result.reference
        };
        yield put(addTaskAssignedCoordinatorRequest(
            task.uuid, whoami.uuid
            ))
        yield put(updateTaskSuccess({
                taskUUID: action.data.relayPrevious,
                payload: {relay_next: task}
            }
        ))
        if (previousTask.dropoff_location && previousTask.dropoff_location.uuid) {
            yield put(setTaskDropoffDestinationRequest(task.uuid, previousTask.dropoff_location.uuid))
            yield put(unsetTaskDropoffDestinationRequest(previousTask.uuid))
        }
        yield put(addTaskRelaySuccess(task));
        yield put(subscribeToUUID(task.uuid))
    } catch (error) {
        yield put(addTaskRelayFailure(error))
    }
}

export function* watchPostNewTaskRelay() {
    yield takeEvery(addTaskRelayActions.request, postNewTaskRelay)
}


function* deleteTask(action) {
    try {
        const api = yield select(getApiControl);
        const currentTasks = yield select((state) => state.tasks.tasks);
        yield call([api, api.tasks.deleteTask], action.data.taskUUID);
        const {taskGroup} = yield findExistingTaskParent(currentTasks, action.data.taskUUID)
        const beforeDelete = yield taskGroup[action.data.taskUUID]

        yield put(deleteTaskSuccess(action.data.taskUUID))
        let relayPrevious;
        if (beforeDelete) {
            const groupSorted = Object.values(taskGroup).sort(taskGroupSort)
            if (beforeDelete.dropoff_location && beforeDelete.relay_previous_uuid && groupSorted[groupSorted.length - 1].uuid === beforeDelete.uuid) {
                relayPrevious = yield findExistingTask(currentTasks, beforeDelete.relay_previous_uuid);
                yield put(setTaskDropoffDestinationRequest(
                    beforeDelete.relay_previous_uuid,
                    beforeDelete.dropoff_location.uuid
                ));
            }
            yield put(resetGroupRelayUUIDs(beforeDelete.parent_id));
        }
        yield put(unsubscribeFromUUID(action.data.taskUUID));
        let restoreActions;
        if (relayPrevious) {
            restoreActions = () => [
                restoreTaskRequest(action.data.taskUUID),
                unsetTaskDropoffDestinationRequest(
                    beforeDelete.relay_previous_uuid
                ),
            ];
        } else {
            restoreActions = () => [
                restoreTaskRequest(action.data.taskUUID)]
        }
        yield put(displayInfoNotification("Task deleted", restoreActions));
    } catch (error) {
        yield put(deleteTaskFailure(error));
    }
}

export function* watchDeleteTask() {
    yield takeEvery(deleteTaskActions.request, deleteTask)
}

function* restoreTask(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.tasks.restoreTask], action.data.taskUUID);
        const result = yield call([api, api.tasks.getTask], action.data.taskUUID);
        yield put(restoreTaskSuccess(result))
        const currentTasks = yield select((state) => state.tasks.tasks);
        const afterRestore = yield findExistingTask(currentTasks, action.data.taskUUID)
        if (afterRestore) {
            yield put(resetGroupRelayUUIDs(afterRestore.parent_id))
        }
        yield put(subscribeToUUID(result.uuid))
    } catch (error) {
        yield put(restoreTaskFailure(error))
    }
}

export function* watchRestoreTask() {
    yield takeEvery(restoreTaskActions.request, restoreTask)
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
            // only notify if marking picked up for the first time
            const restoreActions = () => [updateTaskPickupTimeRequest(
                action.data.taskUUID,
                {time_picked_up: null}
            )];
            const viewLink = `/task/${encodeUUID(action.data.taskUUID)}`
            yield put(displayInfoNotification("Task marked picked up", restoreActions, viewLink))
        }
    } catch (error) {
        yield put(updateTaskPickupTimeFailure(error))
    }
}

function* updateTaskTimeOfCall(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        const data = {payload: {...action.data.payload, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(updateTaskTimeOfCallSuccess(data))
    } catch (error) {
        yield put(updateTaskTimeOfCallFailure(error))
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
            // only notify if marking dropped off for the first time
            const restoreActions = () => [updateTaskDropoffTimeRequest(
                action.data.taskUUID,
                {time_dropped_off: null}
            )];
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
        yield put(updateTaskPatchRequest(action.data.taskUUID, payload))
    } catch (error) {
        yield put(updateTaskPatchFailure(error))
    }
}

function* updateTaskTimeCancelled(action) {
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
            const restoreActions = () => [updateTaskCancelledTimeRequest(
                action.data.taskUUID,
                {time_cancelled: null}
            )];
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
            const restoreActions = () => [updateTaskRejectedTimeRequest(
                action.data.taskUUID,
                {time_rejected: null}
            )];
            const viewLink = `/task/${encodeUUID(action.data.taskUUID)}`
            yield put(displayInfoNotification("Task marked rejected", restoreActions, viewLink))
        }
    } catch (error) {
        yield put(updateTaskRejectedTimeFailure(error))
    }
}

export function* watchUpdateTask() {
    yield takeEvery(updateTaskActions.request, updateTask)
}

export function* watchUpdateTaskRequesterContact() {
    yield takeEvery(updateTaskRequesterContactActions.request, updateTaskRequesterContact)
}

export function* watchUpdateTaskPickupTime() {
    yield takeEvery(updateTaskPickupTimeActions.request, updateTaskPickupTime)
}

export function* watchUpdateTaskDropoffTime() {
    yield takeEvery(updateTaskDropoffTimeActions.request, updateTaskDropoffTime)
}

export function* watchUpdateTaskTimeOfCall() {
    yield takeEvery(updateTaskTimeOfCallActions.request, updateTaskTimeOfCall)
}

export function* watchUpdateTaskPriority() {
    yield takeEvery(updateTaskPriorityActions.request, updateTaskPriority)
}

export function* watchUpdateTaskPatch() {
    yield takeEvery(updateTaskPatchActions.request, updateTaskPatch)
}

export function* watchUpdateTaskTimeCancelled() {
    yield takeEvery(updateTaskCancelledTimeActions.request, updateTaskTimeCancelled)
}

export function* watchUpdateTaskRejectedTime() {
    yield takeEvery(updateTaskRejectedTimeActions.request, updateTaskRejectedTime)
}

function* getTasks(action) {
    try {
        const api = yield select(getApiControl);
        // get all the different tasks for different status and combine them
        const [tasksNew, tasksActive, tasksPickedUp, tasksDelivered, tasksCancelled, tasksRejected] = yield all([
            call([api, api.tasks.getTasks], action.data.userUUID, 0, action.data.role, "new", "", "descending"),
            call([api, api.tasks.getTasks], action.data.userUUID, 0, action.data.role, "active", "", "ascending"),
            call([api, api.tasks.getTasks], action.data.userUUID, 0, action.data.role, "picked_up", "", "ascending"),
            call([api, api.tasks.getTasks], action.data.userUUID, 1, action.data.role, "delivered", "", "descending"),
            call([api, api.tasks.getTasks], action.data.userUUID, 1, action.data.role, "cancelled", "", "descending"),
            call([api, api.tasks.getTasks], action.data.userUUID, 1, action.data.role, "rejected", "", "descending"),
        ])
        const result = convertTaskListsToObjects(
            {
                tasksNew,
                tasksActive,
                tasksPickedUp,
                tasksDelivered,
                tasksCancelled,
                tasksRejected
            });
        yield put(getTasksSuccess(result))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(getTasksNotFound(error))
            }
        }
        yield put(getTasksFailure(error))
    }
}

export function* watchGetTasks() {
    yield takeLatest(getTasksActions.request, getTasks)
}


export function* refreshTasksFromSocket(action) {
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
    yield put(setRoleView(action.data.role))
    yield put(getAllTasksRequest(action.data.userUUID, action.data.page, action.data.role))
}

export function* watchSetRoleViewAndGetTasks() {
    yield takeLatest(SET_ROLE_VIEW_AND_GET_TASKS, setRoleViewAndGetTasks)
}
