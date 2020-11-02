import * as io from 'socket.io-client'
import {
    SOCKET_CONNECT, SOCKET_CONNECT_COMMENTS, SOCKET_SUBSCRIBE_COMMENTS, SOCKET_SUBSCRIBE_RESPONSE_RECEIVED,
    SOCKET_SUBSCRIBE_UUID, SOCKET_SUBSCRIBE_UUID_MANY, SOCKET_UNSUBSCRIBE_COMMENTS,
    SOCKET_UNSUBSCRIBE_UUID, SOCKET_UNSUBSCRIBE_UUID_MANY, subscribedCommentsResponseReceived,
    subscribedResponseReceived
} from "./SocketActions";
import {getTabIdentifier} from "../../utilities";
import {
    addTaskFromSocket, deleteTaskFromSocket,
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
                            case "ADD_NEW_TASK":
                                storeAPI.dispatch(addTaskFromSocket({
                                    payload: action.data.data
                                }))
                                break;
                            case "DELETE_TASK":
                                storeAPI.dispatch(deleteTaskFromSocket(
                                    action.data.object_uuid
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
