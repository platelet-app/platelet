export const SOCKET_CONNECT = 'SOCKET_CONNECT';
export const SOCKET_SUBSCRIBE_RESPONSE_RECEIVED = 'SOCKET_SUBSCRIBE_RESPONSE_RECEIVED';
export const SOCKET_SUBSCRIBE_UUID = 'SOCKET_SUBSCRIBE_UUID';
export const SOCKET_UNSUBSCRIBE_UUID = 'SOCKET_UNSUBSCRIBE_UUID';

export function connectSocket(url) {
    return { type: SOCKET_CONNECT, url };
}

export function subscribedResponseReceived(data) {
    return { type: SOCKET_SUBSCRIBE_RESPONSE_RECEIVED, data };
}

export function subscribeToUUID(uuid) {
    return { type: SOCKET_SUBSCRIBE_UUID, uuid };
}

export function unsubscribeFromUUID(uuid) {
    return { type: SOCKET_UNSUBSCRIBE_UUID, uuid };
}
