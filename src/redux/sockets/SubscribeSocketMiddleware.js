import * as io from 'socket.io-client'
import {
    SOCKET_CONNECT, SOCKET_CONNECT_COMMENTS, SOCKET_SUBSCRIBE_COMMENTS,
    SOCKET_SUBSCRIBE_UUID, SOCKET_UNSUBSCRIBE_COMMENTS,
    SOCKET_UNSUBSCRIBE_UUID, subscribedCommentsResponseReceived,
    subscribedResponseReceived
} from "./SocketActions";

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
