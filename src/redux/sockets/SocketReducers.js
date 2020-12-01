import {
    SOCKET_SUBSCRIBE_COMMENTS_RESPONSE_RECEIVED,
    SOCKET_SUBSCRIBE_RESPONSE_RECEIVED,
    SOCKET_CONNECTED,
    SOCKET_DISCONNECTED,
    SOCKET_COMMENTS_CONNECTED,
    SOCKET_COMMENTS_DISCONNECTED
} from "./SocketActions";

const subscriptionInitialState = {
    tab_id: null,
    object_uuid: null,
    data: null,
    calling_user_uuid: null,
    calling_user_display_name: null
}

export function subscription(state = {}, action) {
    switch (action.type) {
        case SOCKET_SUBSCRIBE_RESPONSE_RECEIVED:
            return action.data;
        default:
            return state;
    }
}

export function commentsSubscription(state = {}, action) {
    switch (action.type) {
        case SOCKET_SUBSCRIBE_COMMENTS_RESPONSE_RECEIVED:
            return action.data;
        default:
            return state;
    }
}

export function socketConnectionStatus(state = false, action) {
    switch (action.type) {
        case SOCKET_DISCONNECTED:
            return false;
        case SOCKET_CONNECTED:
            return true;
        default:
            return state;
    }
}

export function socketCommentsConnectionStatus(state = false, action) {
    switch (action.type) {
        case SOCKET_COMMENTS_DISCONNECTED:
            return false;
        case SOCKET_COMMENTS_CONNECTED:
            return true;
        default:
            return state;
    }
}
