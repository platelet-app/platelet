import {
    call,
    put,
    takeEvery,
    takeLatest,
    delay,
    select,
    all
} from 'redux-saga/effects'
import * as taskActions from "./TasksActions"
import {getApiControl, getWhoami} from "../Selectors"
import {
    refreshTaskAssignmentsSocket,
    refreshTasksDataSocket,
    subscribeToUUID,
} from "../sockets/SocketActions";
import {findExistingTask} from "./task_redux_utilities";
import {setRoleView} from "../Actions";
import {getTaskUUIDEtags} from "../../scenes/Dashboard/utilities/functions";
import {createLoadingSelector, createPostingSelector} from "../selectors";
import {convertTaskListsToObjects} from "./task_redux_utilities";


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
        const result = yield call([api, api.tasks.createTask], action.data.payload, action.data.autoAssign);
        const parentID = result.parent_id ? parseInt(result.parent_id) : 0
        const task = {
            ...action.data.payload,
            "uuid": result.uuid,
            parent_id: parentID,
            order_in_relay: 1,
            reference: result.reference
        };
        yield put(taskActions.addTaskSuccess({payload: task, autoAssign: action.data.autoAssign}));
    } catch (error) {
        yield put(taskActions.addTaskFailure(error))
    }
}

export function* watchPostNewTask() {
    yield takeEvery(taskActions.addTaskActions.request, postNewTask)
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
        }, action.data.autoAssign);
        const orderInRelay = result.order_in_relay ? parseInt(result.order_in_relay) : 0;
        const task = {
            ...emptyTask, ...prevTaskData,
            author_uuid: whoami.uuid,
            uuid: result.uuid,
            order_in_relay: orderInRelay,
            reference: result.reference
        };
        yield put(taskActions.addTaskRelaySuccess({payload: task, autoAssign: action.data.autoAssign}));
    } catch (error) {
        yield put(taskActions.addTaskRelayFailure(error))
    }
}

export function* watchPostNewTaskRelay() {
    yield takeEvery(taskActions.addTaskRelayActions.request, postNewTaskRelay)
}


function* deleteTask(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.tasks.deleteTask], action.data.taskUUID);
        yield put(taskActions.deleteTaskSuccess(action.data.taskUUID))
    } catch (error) {
        yield put(taskActions.deleteTaskFailure(error));
    }
}

export function* watchDeleteTask() {
    yield takeEvery(taskActions.deleteTaskActions.request, deleteTask)
}

function* restoreTask(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.tasks.restoreTask], action.data.taskUUID);
        const result = yield call([api, api.tasks.getTask], action.data.taskUUID);
        yield put(taskActions.restoreTaskSuccess(result))
        const currentTasks = yield select((state) => state.tasks.tasks);
        const afterRestore = yield findExistingTask(currentTasks, action.data.taskUUID)
        if (afterRestore) {
            yield put(taskActions.resetGroupRelayUUIDs(afterRestore.parent_id))
        }
        yield put(subscribeToUUID(result.uuid))
    } catch (error) {
        yield put(taskActions.restoreTaskFailure(error))
    }
}

export function* watchRestoreTask() {
    yield takeEvery(taskActions.restoreTaskActions.request, restoreTask)
}

function* updateTask(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        const data = {payload: {...action.data.payload, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(taskActions.updateTaskSuccess(data))
    } catch (error) {
        yield put(taskActions.updateTaskFailure(error))
    }
}

function* updateTaskRequesterContact(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        const data = {payload: {...action.data.payload, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(taskActions.updateTaskRequesterContactSuccess(data))
    } catch (error) {
        yield put(taskActions.updateTaskRequesterContactFailure(error))
    }
}


function* updateTaskPickupTime(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        const data = {payload: {...action.data.payload, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(taskActions.updateTaskPickupTimeSuccess(data))
    } catch (error) {
        yield put(taskActions.updateTaskPickupTimeFailure(error))
    }
}

function* updateTaskTimeOfCall(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        const data = {payload: {...action.data.payload, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(taskActions.updateTaskTimeOfCallSuccess(data))
    } catch (error) {
        yield put(taskActions.updateTaskTimeOfCallFailure(error))
    }
}

function* updateTaskDropoffTime(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        const data = {payload: {...action.data.payload, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(taskActions.updateTaskDropoffTimeSuccess(data))
    } catch (error) {
        yield put(taskActions.updateTaskDropoffTimeFailure(error))
    }
}

function* updateTaskPriority(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        const data = {payload: {...action.data.payload, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(taskActions.updateTaskPrioritySuccess(data))
    } catch (error) {
        yield put(taskActions.updateTaskPriorityFailure(error))
    }
}

function* updateTaskPatch(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.tasks.updateTask], action.data.taskUUID, action.data.payload);
        const data = {payload: {...action.data.payload, etag: result.etag}, taskUUID: action.data.taskUUID}
        yield put(taskActions.updateTaskPatchSuccess(data))
    } catch (error) {
        yield put(taskActions.updateTaskPatchFailure(error))
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
        yield put(taskActions.updateTaskPatchRequest(action.data.taskUUID, payload))
    } catch (error) {
        yield put(taskActions.updateTaskPatchFailure(error))
    }
}

function* updateTaskTimeCancelled(action) {
    try {
        // get the current task rejected_time value to make sure it isn't already marked
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
        yield put(taskActions.updateTaskCancelledTimeSuccess(data))
    } catch (error) {
        yield put(taskActions.updateTaskCancelledTimeFailure(error))
    }
}

function* updateTaskRejectedTime(action) {
    try {
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
        yield put(taskActions.updateTaskRejectedTimeSuccess(data))
    } catch (error) {
        yield put(taskActions.updateTaskRejectedTimeFailure(error))
    }
}

export function* watchUpdateTask() {
    yield takeEvery(taskActions.updateTaskActions.request, updateTask)
}

export function* watchUpdateTaskRequesterContact() {
    yield takeEvery(taskActions.updateTaskRequesterContactActions.request, updateTaskRequesterContact)
}

export function* watchUpdateTaskPickupTime() {
    yield takeEvery(taskActions.updateTaskPickupTimeActions.request, updateTaskPickupTime)
}

export function* watchUpdateTaskDropoffTime() {
    yield takeEvery(taskActions.updateTaskDropoffTimeActions.request, updateTaskDropoffTime)
}

export function* watchUpdateTaskTimeOfCall() {
    yield takeEvery(taskActions.updateTaskTimeOfCallActions.request, updateTaskTimeOfCall)
}

export function* watchUpdateTaskPriority() {
    yield takeEvery(taskActions.updateTaskPriorityActions.request, updateTaskPriority)
}

export function* watchUpdateTaskPatch() {
    yield takeEvery(taskActions.updateTaskPatchActions.request, updateTaskPatch)
}

export function* watchUpdateTaskTimeCancelled() {
    yield takeEvery(taskActions.updateTaskCancelledTimeActions.request, updateTaskTimeCancelled)
}

export function* watchUpdateTaskRejectedTime() {
    yield takeEvery(taskActions.updateTaskRejectedTimeActions.request, updateTaskRejectedTime)
}

function* getTasks(action) {
    try {
        const api = yield select(getApiControl);
        // get all the different tasks for different status and combine them
        const [tasksNew, tasksActive, tasksPickedUp, tasksDelivered, tasksCancelled, tasksRejected] = yield all([
            call([api, api.tasks.getTasks], action.data.userUUID, 0, action.data.role, "new", 0, "descending"),
            call([api, api.tasks.getTasks], action.data.userUUID, 0, action.data.role, "active", 0, "ascending"),
            call([api, api.tasks.getTasks], action.data.userUUID, 0, action.data.role, "picked_up", 0, "ascending"),
            call([api, api.tasks.getTasks], action.data.userUUID, 1, action.data.role, "delivered", 0, "descending"),
            call([api, api.tasks.getTasks], action.data.userUUID, 1, action.data.role, "cancelled", 0, "descending"),
            call([api, api.tasks.getTasks], action.data.userUUID, 1, action.data.role, "rejected", 0, "descending"),
        ]);
        const result = convertTaskListsToObjects(
            {
                tasksNew,
                tasksActive,
                tasksPickedUp,
                tasksDelivered,
                tasksCancelled,
                tasksRejected
            });
        yield put(taskActions.getTasksSuccess(result));
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(taskActions.getTasksNotFound(error))
            }
        }
        yield put(taskActions.getTasksFailure(error))
    }
}

export function* watchGetTasks() {
    yield takeLatest(taskActions.getTasksActions.request, getTasks)
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
    yield takeLatest(taskActions.START_REFRESH_TASKS_LOOP_FROM_SOCKET, refreshTasksFromSocket)
}

function* setRoleViewAndGetTasks(action) {
    yield put(setRoleView(action.data.role))
    yield put(taskActions.getAllTasksRequest(action.data.userUUID, action.data.page, action.data.role))
}

export function* watchSetRoleViewAndGetTasks() {
    yield takeLatest(taskActions.SET_ROLE_VIEW_AND_GET_TASKS, setRoleViewAndGetTasks)
}
