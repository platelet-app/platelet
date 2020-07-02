import * as io from 'socket.io-client'
import {
    SOCKET_CONNECT,
    SOCKET_SUBSCRIBE_UUID,
    SOCKET_UNSUBSCRIBE_UUID,
    subscribedResponseReceived
} from "./SocketActions";

export const createSubscribeSocketMiddleware = () => {
    let socket;
    return storeAPI => next => action => {
        switch(action.type) {
            case SOCKET_CONNECT: {
                socket = io.connect(action.url);
                socket.on("subscribed_response", (message) => {
                    storeAPI.dispatch(subscribedResponseReceived(message));
                });
                socket.on("response", (message) => {
                    console.log(message.data);
                });
                break;
            }
            case SOCKET_SUBSCRIBE_UUID: {
                socket.emit('subscribe', action.uuid);
                break;
            }
            case SOCKET_UNSUBSCRIBE_UUID: {
                socket.emit('unsubscribe', action.uuid);
                break;
            }
        default:
            return next(action);
        }
    }
}
