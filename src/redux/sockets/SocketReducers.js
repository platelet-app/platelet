import {SOCKET_SUBSCRIBE_RESPONSE_RECEIVED} from "./SocketActions";

const subscriptionInitialState = {
    tab_id: null,
    object_uuid: null,
    data: null,
}

export function subscription(state = {}, action) {
    switch (action.type) {
        case SOCKET_SUBSCRIBE_RESPONSE_RECEIVED:
            return action.data;
        default:
            return state;
    }
}
