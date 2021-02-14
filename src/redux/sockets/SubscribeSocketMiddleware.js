import * as io from 'socket.io-client'
import _ from "lodash"
import {encodeUUID, getApiURL} from "../../utilities";
import {
    requestResponseReceived,
    SOCKET_CONNECT,
    SOCKET_CONNECT_ASSIGNMENTS,
    SOCKET_CONNECT_COMMENTS, SOCKET_REFRESH_TASKS_ASSIGNMENTS,
    SOCKET_REFRESH_TASKS_DATA, SOCKET_REQUEST_RESPONSE_RECEIVED,
    SOCKET_SUBSCRIBE_COORDINATOR_ASSIGNMENTS,
    SOCKET_SUBSCRIBE_RIDER_ASSIGNMENTS,
    SOCKET_SUBSCRIBE_ASSIGNMENTS_RESPONSE_RECEIVED,
    SOCKET_SUBSCRIBE_COMMENTS,
    SOCKET_SUBSCRIBE_COMMENTS_RESPONSE_RECEIVED,
    SOCKET_SUBSCRIBE_RESPONSE_RECEIVED,
    SOCKET_SUBSCRIBE_UUID,
    SOCKET_SUBSCRIBE_UUID_MANY,
    SOCKET_UNSUBSCRIBE_COORDINATOR_ASSIGNMENTS,
    SOCKET_UNSUBSCRIBE_RIDER_ASSIGNMENTS,
    SOCKET_UNSUBSCRIBE_COMMENTS,
    SOCKET_UNSUBSCRIBE_UUID,
    SOCKET_UNSUBSCRIBE_UUID_MANY,
    subscribedAssignmentsResponseReceived,
    subscribedCommentsResponseReceived,
    subscribedResponseReceived,
    subscribeToUUID, unsubscribeFromUUID, SOCKET_AUTHENTICATE
} from "./SocketActions";
import {findExistingTask, findExistingTaskParentByID, getTabIdentifier} from "../../utilities";
import {
    addTaskFromSocket,
    addTaskRelayFromSocket,
    deleteTaskFromSocket,
    putTaskFromSocket,
    resetGroupRelayUUIDs,
    restoreTaskFromSocket, updateTaskAssignedCoordinatorFromSocket,
    updateTaskAssignedRiderFromSocket, updateTaskDropoffLocationFromSocket,
    updateTaskFromSocket, updateTaskPickupLocationFromSocket, updateTaskRemoveAssignedCoordinatorFromSocket,
    updateTaskRemoveAssignedRiderFromSocket,
    updateTaskTimeCancelledFromSocket,
    updateTaskTimeRejectedFromSocket
} from "../tasks/TasksActions";
import {
    addCommentFromSocket,
    deleteCommentFromSocket,
    restoreCommentFromSocket, updateCommentFromSocket
} from "../comments/CommentsActions";
import {displayInfoNotification} from "../notifications/NotificationsActions";

function getTaskUpdatedMessages(data) {
    const {
        time_picked_up,
        time_dropped_off,
        time_cancelled,
        time_rejected
    } = {...data}

    let result = [];
    if (time_picked_up)
        result.push("marked a task picked up.")
    if (time_dropped_off)
        result.push("marked a task delivered.")
    if (time_cancelled)
        result.push("marked a task cancelled.")
    if (time_rejected)
        result.push("marked a task rejected.")
    return result;
}

const apiURL = getApiURL();

export const createSubscribeSocketMiddleware = () => {
    let socket;
    return storeAPI => next => action => {
        switch (action.type) {
            case SOCKET_CONNECT: {
                socket = io(`${apiURL}subscribe`);
                const token = storeAPI.getState().apiControl.token
                socket.on("subscribed_response", (message) => {
                    console.log(message)
                    storeAPI.dispatch(subscribedResponseReceived(message));
                });
                socket.on("request_response", message => {
                    storeAPI.dispatch(requestResponseReceived(message))
                })
                socket.on("response", (message) => {
                    console.log(message.data);
                });
                socket.on("auth_response", (message) => {
                    socket.authenticated = message.auth_status
                    console.log(message.data);
                });
                socket.emit('authenticate', token)
                break;
            }
            case SOCKET_SUBSCRIBE_UUID: {
                if (socket) {
                    if (!socket.authenticated) {
                        const token = storeAPI.getState().apiControl.token
                        socket.emit('authenticate', token)
                    }
                    socket.emit('subscribe', action.uuid);
                }
                break;
            }
            case SOCKET_UNSUBSCRIBE_UUID: {
                if (socket) {
                    if (!socket.authenticated) {
                        const token = storeAPI.getState().apiControl.token
                        socket.emit('authenticate', token)
                    }
                    socket.emit('unsubscribe', action.uuid);
                }
                break;
            }
            case SOCKET_SUBSCRIBE_UUID_MANY: {
                if (socket) {
                    if (!socket.authenticated) {
                        const token = storeAPI.getState().apiControl.token
                        socket.emit('authenticate', token)
                    }

                    socket.emit('subscribe_many', action.uuids);
                }
                break;
            }
            case SOCKET_UNSUBSCRIBE_UUID_MANY: {
                if (socket) {
                    if (!socket.authenticated) {
                        const token = storeAPI.getState().apiControl.token
                        socket.emit('authenticate', token)
                    }
                    socket.emit('unsubscribe_many', action.uuids);
                }
                break;
            }
            case SOCKET_REFRESH_TASKS_DATA:
                if (socket) {
                    if (!socket.authenticated) {
                        const token = storeAPI.getState().apiControl.token
                        socket.emit('authenticate', token)
                    }
                    socket.emit("refresh_task_data", action.uuids_etags)
                }
                break;
            case SOCKET_REFRESH_TASKS_ASSIGNMENTS:
                if (socket) {
                    if (!socket.authenticated) {
                        const token = storeAPI.getState().apiControl.token
                        socket.emit('authenticate', token)
                    }
                    socket.emit("refresh_task_assignments", action.userUUID, action.taskUUIDs, action.role)
                }
                break;
            case SOCKET_SUBSCRIBE_RESPONSE_RECEIVED:
                if (Object.keys(action.data).length === 0 && action.data.constructor === Object) {
                    console.log("ignore")
                } else {
                    if (action.data.tab_id != null && getTabIdentifier() !== action.data.tab_id) {
                        switch (action.data.type) {
                            case "TASKS_REFRESH":
                                for (const task of action.data.data) {
                                    storeAPI.dispatch(putTaskFromSocket(task))
                                }
                                break;
                            case "UPDATE_TASK":
                                const {time_rejected, time_cancelled, etag, ...everythingElse} = {...action.data.data};
                                if (!!time_rejected || time_rejected === null) {
                                    console.log(time_rejected)
                                    storeAPI.dispatch(updateTaskTimeRejectedFromSocket({
                                        taskUUID: action.data.object_uuid,
                                        payload: {time_rejected, etag}
                                    }));
                                }
                                if (!!time_cancelled || time_cancelled === null) {
                                    console.log(time_cancelled)
                                    storeAPI.dispatch(updateTaskTimeCancelledFromSocket({
                                        taskUUID: action.data.object_uuid,
                                        payload: {time_cancelled, etag}
                                    }));
                                }
                                if (!_.isEmpty(everythingElse)) {
                                    storeAPI.dispatch(updateTaskFromSocket({
                                        taskUUID: action.data.object_uuid,
                                        payload: {...everythingElse, etag}
                                    }));
                                }
                                const whoami = storeAPI.getState().whoami.user
                                if (action.data.calling_user_uuid !== whoami.uuid) {
                                    const link = `/task/${encodeUUID(action.data.object_uuid)}`
                                    for (const message of getTaskUpdatedMessages(action.data.data)) {
                                        const finalMessage = `${action.data.calling_user_display_name} ${message}`
                                        storeAPI.dispatch(displayInfoNotification(finalMessage, undefined, link))

                                    }
                                }
                                break;
                            case "UPDATE_TASK_PICKUP_LOCATION": {
                                const data = {
                                    taskUUID: action.data.object_uuid,
                                    payload: action.data.data
                                }
                                storeAPI.dispatch(updateTaskPickupLocationFromSocket(data));
                            }
                            break;
                            case "UPDATE_TASK_DROPOFF_LOCATION": {
                                const data = {
                                    taskUUID: action.data.object_uuid,
                                    payload: action.data.data
                                }
                                storeAPI.dispatch(updateTaskDropoffLocationFromSocket(data));
                            }
                            break;
                            case "ASSIGN_RIDER_TO_TASK": {
                                const user_uuid = action.data.data.user_uuid
                                const assignedUser = storeAPI.getState().users.users[user_uuid]
                                if (assignedUser) {
                                    const rider = assignedUser
                                    storeAPI.dispatch(updateTaskAssignedRiderFromSocket({
                                        taskUUID: action.data.object_uuid,
                                        payload: {rider, user_uuid}
                                    }))
                                } }
                                break;
                            case "REMOVE_ASSIGNED_RIDER_FROM_TASK": {
                                const user_uuid_remove = action.data.data.user_uuid
                                storeAPI.dispatch(updateTaskRemoveAssignedRiderFromSocket({
                                    taskUUID: action.data.object_uuid,
                                    payload: {user_uuid: user_uuid_remove}
                                }))}
                                break;
                            case "ASSIGN_COORDINATOR_TO_TASK": {
                                const user_uuid = action.data.data.user_uuid
                                const assignedUser = storeAPI.getState().users.users[user_uuid]
                                if (assignedUser) {
                                    const user = assignedUser
                                    storeAPI.dispatch(updateTaskAssignedCoordinatorFromSocket({
                                        taskUUID: action.data.object_uuid,
                                        payload: {user, user_uuid}
                                    }))
                                } }
                                break;
                            case "REMOVE_ASSIGNED_COORDINATOR_FROM_TASK": {
                                const user_uuid_remove = action.data.data.user_uuid
                                storeAPI.dispatch(updateTaskRemoveAssignedCoordinatorFromSocket({
                                    taskUUID: action.data.object_uuid,
                                    payload: {user_uuid: user_uuid_remove}
                                }))}
                                break;
                            case "DELETE_TASK":
                                const curTasks = storeAPI.getState().tasks.tasks;
                                const beforeDeleted = findExistingTask(curTasks, action.data.object_uuid)
                                storeAPI.dispatch(deleteTaskFromSocket(
                                    action.data.object_uuid
                                ))
                                if (beforeDeleted) {
                                    storeAPI.dispatch(resetGroupRelayUUIDs(beforeDeleted.parent_id))
                                }
                                break;
                            case "RESTORE_TASK":
                                storeAPI.dispatch(restoreTaskFromSocket(
                                    action.data.data
                                ))
                                const currentTasks = storeAPI.getState().tasks.tasks;
                                const afterRestore = findExistingTask(currentTasks, action.data.data.uuid)
                                if (afterRestore) {
                                    storeAPI.dispatch(resetGroupRelayUUIDs(afterRestore.parent_id))
                                }
                                storeAPI.dispatch(subscribeToUUID(action.data.data.uuid))
                                break;
                            default:
                                break;
                        }
                        console.log(action.data.data)
                    } else
                        console.log("this came from us")
                }
            case SOCKET_REQUEST_RESPONSE_RECEIVED:
                if (Object.keys(action.data).length === 0 && action.data.constructor === Object) {
                    console.log("ignore")
                } else {
                    switch (action.data.type) {
                        case "TASKS_REFRESH": {
                            console.log("TASKS REFRESH")
                            const tasks = JSON.parse(action.data.data);
                            console.log(tasks)
                            if (tasks.length !== 0) {
                                for (const task of tasks) {
                                    if (task.deleted) {
                                        storeAPI.dispatch(deleteTaskFromSocket(task.uuid))
                                    } else {
                                        storeAPI.dispatch(putTaskFromSocket(task))
                                        storeAPI.dispatch(resetGroupRelayUUIDs(task.parent_id))
                                    }
                                }
                            }
                            break;
                        }
                        case "TASK_ASSIGNMENTS_REFRESH": {
                            console.log("ASSIGNMENTS REFRESH")
                            const tasks = action.data.data;
                            for (const task of tasks) {
                                const parent = findExistingTaskParentByID(storeAPI.getState().tasks.tasks, task.parent_id);
                                if (parent.taskGroup) {
                                    const findCheck = parent.taskGroup[task.uuid]
                                    if (findCheck) {
                                        storeAPI.dispatch(putTaskFromSocket(task))
                                    } else {
                                        storeAPI.dispatch(addTaskRelayFromSocket(task))
                                    }
                                    storeAPI.dispatch(resetGroupRelayUUIDs(task.parent_id))
                                } else {
                                    storeAPI.dispatch(addTaskFromSocket(task))
                                }
                            }
                            console.log(tasks)
                            break;
                        }

                        default:
                            break;
                    }
                }
            default:
                return next(action);
        }
    }
}
export const createSubscribeCommentsSocketMiddleware = () => {
    let socket;
    return storeAPI => next => action => {
        switch (action.type) {
            case SOCKET_CONNECT_COMMENTS: {
                const token = storeAPI.getState().apiControl.token
                socket = io(`${apiURL}subscribe_comments`);
                socket.emit('authenticate', token)
                socket.on("subscribed_response", (message) => {
                    console.log(message)
                    storeAPI.dispatch(subscribedCommentsResponseReceived(message));
                });
                socket.on("response", (message) => {
                    console.log(message.data);
                });
                break;
            }
            case SOCKET_SUBSCRIBE_COMMENTS: {
                if (socket) {
                    if (!socket.authenticated) {
                        const token = storeAPI.getState().apiControl.token
                        socket.emit('authenticate', token)
                    }
                    socket.emit('subscribe', action.uuid);
                }

                break;
            }
            case SOCKET_UNSUBSCRIBE_COMMENTS: {
                if (socket) {
                    if (!socket.authenticated) {
                        const token = storeAPI.getState().apiControl.token
                        socket.emit('authenticate', token)
                    }
                    socket.emit('unsubscribe', action.uuid);
                }
                break;
            }
            case SOCKET_SUBSCRIBE_COMMENTS_RESPONSE_RECEIVED:
                if (Object.keys(action.data).length === 0 && action.data.constructor === Object) {
                    console.log("ignore")
                } else {
                    if (action.data.tab_id != null && getTabIdentifier() !== action.data.tab_id) {
                        console.log(action.data.type)
                        switch (action.data.type) {
                            case "ADD_COMMENT":
                                storeAPI.dispatch(addCommentFromSocket(action.data.data))
                                break;
                            case "DELETE_COMMENT":
                                storeAPI.dispatch(deleteCommentFromSocket(action.data.uuid))
                                break;
                            case "RESTORE_COMMENT":
                                storeAPI.dispatch(restoreCommentFromSocket(action.data.data))
                                break;
                            case "EDIT_COMMENT":
                                storeAPI.dispatch(updateCommentFromSocket({
                                    commentUUID: action.data.uuid,
                                    payload: action.data.data
                                }))
                                break;
                            default:
                                break;
                        }
                        console.log(action.data.data)
                    } else
                        console.log("this came from us")
                }
            default:
                return next(action);
        }
    }
}

export const createSubscribeAssignmentsSocketMiddleware = () => {
    let socket;
    return storeAPI => next => action => {
        switch (action.type) {
            case SOCKET_CONNECT_ASSIGNMENTS: {
                socket = io(`${apiURL}subscribe_assignments`);
                const token = storeAPI.getState().apiControl.token
                socket.emit('authenticate', token)
                socket.on("subscribed_response", (message) => {
                    console.log(message)
                    storeAPI.dispatch(subscribedAssignmentsResponseReceived(message));
                });
                socket.on("response", (message) => {
                    console.log(message.data);
                });
                break;
            }
            case SOCKET_SUBSCRIBE_COORDINATOR_ASSIGNMENTS: {
                if (socket) {
                    if (!socket.authenticated) {
                        const token = storeAPI.getState().apiControl.token
                        socket.emit('authenticate', token)
                    }
                    socket.emit('subscribe_coordinator', action.uuid);
                }

                break;
            }
            case SOCKET_UNSUBSCRIBE_COORDINATOR_ASSIGNMENTS: {
                if (socket) {
                    if (!socket.authenticated) {
                        const token = storeAPI.getState().apiControl.token
                        socket.emit('authenticate', token)
                    }
                    socket.emit('unsubscribe_coordinator', action.uuid);
                }
                break;
            }
            case SOCKET_SUBSCRIBE_RIDER_ASSIGNMENTS: {
                if (socket) {
                    if (!socket.authenticated) {
                        const token = storeAPI.getState().apiControl.token
                        socket.emit('authenticate', token)
                    }
                    socket.emit('subscribe_rider', action.uuid);
                }

                break;
            }
            case SOCKET_UNSUBSCRIBE_RIDER_ASSIGNMENTS: {
                if (socket) {
                    if (!socket.authenticated) {
                        const token = storeAPI.getState().apiControl.token
                        socket.emit('authenticate', token)
                    }
                    socket.emit('unsubscribe_rider', action.uuid);
                }
                break;
            }
            case SOCKET_SUBSCRIBE_ASSIGNMENTS_RESPONSE_RECEIVED: {
                if (Object.keys(action.data).length === 0 && action.data.constructor === Object) {
                    console.log("ignore")
                } else {
                    if (action.data.tab_id != null && getTabIdentifier() !== action.data.tab_id) {
                        switch (action.data.type) {
                            case "ASSIGN_COORDINATOR_TO_TASK":
                            case "ASSIGN_RIDER_TO_TASK": {
                                const task = findExistingTask(storeAPI.getState().tasks.tasks, action.data.uuid)
                                if (task)
                                    break;
                                const parent = findExistingTaskParentByID(storeAPI.getState().tasks.tasks, action.data.data.parent_id)
                                if (parent.taskGroup) {
                                    storeAPI.dispatch(addTaskRelayFromSocket({
                                        ...action.data.data
                                    }))
                                    storeAPI.dispatch(resetGroupRelayUUIDs(action.data.data.parent_id));
                                } else {
                                    storeAPI.dispatch(addTaskFromSocket({
                                        ...action.data.data
                                    }))
                                }
                                storeAPI.dispatch(subscribeToUUID(action.data.data.uuid))
                                const whoami = storeAPI.getState().whoami.user
                                if (action.data.calling_user_uuid !== whoami.uuid) {
                                    const coordRide = action.data.type === "ASSIGN_COORDINATOR_TO_TASK" ? "coordinate" : "deliver";
                                    const message = `${action.data.calling_user_display_name} assigned you to ${coordRide} a task.`
                                    const link = `/task/${encodeUUID(action.data.data.uuid)}`
                                    storeAPI.dispatch(displayInfoNotification(message, undefined, link))
                                }
                                break;
                            }
                            case "REMOVE_ASSIGNED_COORDINATOR_FROM_TASK":
                            case "REMOVE_ASSIGNED_RIDER_FROM_TASK": {
                                const task = findExistingTask(storeAPI.getState().tasks.tasks, action.data.data.uuid)
                                if (task) {
                                    storeAPI.dispatch(deleteTaskFromSocket(task.uuid))
                                    storeAPI.dispatch(unsubscribeFromUUID(task.uuid))
                                } else {
                                    break;
                                }

                                break;

                            }
                            default:
                                break;
                        }
                    }
                }
            }
            default:
                return next(action);
        }
    }
}

