export const SOCKET_CONNECT = "SOCKET_CONNECT";
export const SOCKET_CONNECT_COMMENTS = "SOCKET_CONNECT_COMMENTS";
export const SOCKET_SUBSCRIBE_RESPONSE_RECEIVED = "SOCKET_SUBSCRIBE_RESPONSE_RECEIVED";
export const SOCKET_SUBSCRIBE_COMMENTS_RESPONSE_RECEIVED = "SOCKET_SUBSCRIBE_COMMENTS_RESPONSE_RECEIVED";
export const SOCKET_SUBSCRIBE_UUID = "SOCKET_SUBSCRIBE_UUID";
export const SOCKET_UNSUBSCRIBE_UUID = "SOCKET_UNSUBSCRIBE_UUID";
export const SOCKET_SUBSCRIBE_COMMENTS = "SOCKET_SUBSCRIBE_COMMENTS";
export const SOCKET_UNSUBSCRIBE_COMMENTS = "SOCKET_UNSUBSCRIBE_COMMENTS";

export function connectSocket(url) {
    return { type: SOCKET_CONNECT, url };
}

export function connectCommentsSocket(url) {
    return { type: SOCKET_CONNECT_COMMENTS, url };
}

export function subscribedResponseReceived(data) {
    return { type: SOCKET_SUBSCRIBE_RESPONSE_RECEIVED, data };
}

export function subscribedCommentsResponseReceived(data) {
    return { type: SOCKET_SUBSCRIBE_COMMENTS_RESPONSE_RECEIVED, data };
}

export function subscribeToUUID(uuid) {
    return { type: SOCKET_SUBSCRIBE_UUID, uuid };
}

export function unsubscribeFromUUID(uuid) {
    return { type: SOCKET_UNSUBSCRIBE_UUID, uuid };
}

export function subscribeToComments(uuid) {
    return { type: SOCKET_SUBSCRIBE_COMMENTS, uuid };
}

export function unsubscribeFromComments(uuid) {
    return { type: SOCKET_UNSUBSCRIBE_COMMENTS, uuid };
}
