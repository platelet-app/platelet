import * as io from 'socket.io-client'
import {
    SOCKET_CONNECT,
    SOCKET_CONNECT_ASSIGNMENTS,
    SOCKET_CONNECT_COMMENTS, SOCKET_SUBSCRIBE_ASSIGNMENTS, SOCKET_SUBSCRIBE_ASSIGNMENTS_RESPONSE_RECEIVED,
    SOCKET_SUBSCRIBE_COMMENTS,
    SOCKET_SUBSCRIBE_RESPONSE_RECEIVED,
    SOCKET_SUBSCRIBE_UUID,
    SOCKET_SUBSCRIBE_UUID_MANY, SOCKET_UNSUBSCRIBE_ASSIGNMENTS,
    SOCKET_UNSUBSCRIBE_COMMENTS,
    SOCKET_UNSUBSCRIBE_UUID,
    SOCKET_UNSUBSCRIBE_UUID_MANY, subscribedAssignmentsResponseReceived,
    subscribedCommentsResponseReceived,
    subscribedResponseReceived, subscribeToUUID
} from "./SocketActions";
import {findExistingTask, findExistingTaskParentByID, getTabIdentifier} from "../../utilities";
import {
    addTaskFromSocket, addTaskRelayFromSocket, deleteTaskFromSocket, restoreTaskFromSocket,
    updateTaskAssignedRiderFromSocket,
    updateTaskFromSocket,
    updateTaskRemoveAssignedRiderFromSocket
} from "../tasks/TasksActions";

export const createSubscribeSocketMiddleware = () => {
    let socket;
    return storeAPI => next => action => {
        switch(action.type) {
            case SOCKET_CONNECT: {
                socket = io.connect(action.url);
                socket.on("subscribed_response", (message) => {
                    console.log(message)
                    storeAPI.dispatch(subscribedResponseReceived(message));
                });
                socket.on("response", (message) => {
                    console.log(message.data);
                });
                break;
            }
            case SOCKET_SUBSCRIBE_UUID: {
                if (socket)
                    socket.emit('subscribe', action.uuid);
                break;
            }
            case SOCKET_UNSUBSCRIBE_UUID: {
                if (socket)
                    socket.emit('unsubscribe', action.uuid);
                break;
            }
            case SOCKET_SUBSCRIBE_UUID_MANY: {
                if (socket)
                    socket.emit('subscribe_many', action.uuids);
                break;
            }
            case SOCKET_UNSUBSCRIBE_UUID_MANY: {
                if (socket)
                    socket.emit('unsubscribe_many', action.uuids);
                break;
            }
            case SOCKET_SUBSCRIBE_RESPONSE_RECEIVED:
                if (Object.keys(action.data).length === 0 && action.data.constructor === Object) {
                    console.log("ignore")
                } else {
                    if (action.data.tab_id != null && getTabIdentifier() !== action.data.tab_id) {
                        switch (action.data.type) {
                            case "UPDATE_TASK":
                                storeAPI.dispatch(updateTaskFromSocket({
                                    taskUUID: action.data.object_uuid,
                                    payload: action.data.data
                                }))
                                break;
                            case "ASSIGN_RIDER_TO_TASK":
                                const user_uuid = action.data.data.user_uuid
                                const assignedUser = storeAPI.getState().users.users.find(u => user_uuid === u.uuid)
                                if (assignedUser) {
                                    const rider = assignedUser
                                    storeAPI.dispatch(updateTaskAssignedRiderFromSocket({
                                        taskUUID: action.data.object_uuid,
                                        payload: {rider, user_uuid}
                                    }))
                                }
                                break;
                            case "REMOVE_ASSIGNED_RIDER_FROM_TASK":
                                const user_uuid_remove = action.data.data.user_uuid
                                storeAPI.dispatch(updateTaskRemoveAssignedRiderFromSocket({
                                    taskUUID: action.data.object_uuid,
                                    payload: {user_uuid: user_uuid_remove}
                                }))
                                break;
                            case "DELETE_TASK":
                                storeAPI.dispatch(deleteTaskFromSocket(
                                    action.data.object_uuid
                                ))
                                break;
                            case "RESTORE_TASK":
                                storeAPI.dispatch(restoreTaskFromSocket(
                                    action.data.data
                                ))
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
export const createSubscribeCommentsSocketMiddleware = () => {
    let socket;
    return storeAPI => next => action => {
        switch(action.type) {
            case SOCKET_CONNECT_COMMENTS: {
                socket = io.connect(action.url);
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
                if (socket)
                    socket.emit('subscribe', action.uuid);

                break;
            }
            case SOCKET_UNSUBSCRIBE_COMMENTS: {
                if (socket)
                    socket.emit('unsubscribe', action.uuid);
                break;
            }
            default:
                return next(action);
        }
    }
}

export const createSubscribeAssignmentsSocketMiddleware = () => {
    let socket;
    return storeAPI => next => action => {
        switch(action.type) {
            case SOCKET_CONNECT_ASSIGNMENTS: {
                socket = io.connect(action.url);
                socket.on("subscribed_response", (message) => {
                    console.log(message)
                    storeAPI.dispatch(subscribedAssignmentsResponseReceived(message));
                });
                socket.on("response", (message) => {
                    console.log(message.data);
                });
                break;
            }
            case SOCKET_SUBSCRIBE_ASSIGNMENTS: {
                if (socket)
                    socket.emit('subscribe', action.uuid);

                break;
            }
            case SOCKET_UNSUBSCRIBE_ASSIGNMENTS: {
                if (socket)
                    socket.emit('unsubscribe', action.uuid);
                break;
            }
            case SOCKET_SUBSCRIBE_ASSIGNMENTS_RESPONSE_RECEIVED:
                if (Object.keys(action.data).length === 0 && action.data.constructor === Object) {
                    console.log("ignore")
                } else {
                    if (action.data.tab_id != null && getTabIdentifier() !== action.data.tab_id) {
                        switch (action.data.type) {
                            case "ASSIGN_COORDINATOR_TO_TASK": {
                                const task = findExistingTask(storeAPI.getState().tasks.tasks, action.data.uuid)
                                if (task)
                                    break;
                                const parent = findExistingTaskParentByID(storeAPI.getState().tasks.tasks, action.data.parent_id)
                                if (parent.taskGroup) {
                                    storeAPI.dispatch(addTaskRelayFromSocket({
                                        ...action.data.data
                                    }))
                                } else {
                                    storeAPI.dispatch(addTaskFromSocket({
                                        ...action.data.data
                                    }))
                                }
                                storeAPI.dispatch(subscribeToUUID(action.data.data.uuid))
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

