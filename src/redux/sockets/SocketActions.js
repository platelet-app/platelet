export const SOCKET_CONNECT = "SOCKET_CONNECT";
export const SOCKET_CONNECTED = "SOCKET_CONNECTED";
export const SOCKET_DISCONNECTED = "SOCKET_DISCONNECTED";
export const SOCKET_DISCONNECT = "SOCKET_DISCONNECT";
export const SOCKET_SUBSCRIBE_RESPONSE_RECEIVED = "SOCKET_SUBSCRIBE_RESPONSE_RECEIVED";
export const SOCKET_SUBSCRIBE_UUID = "SOCKET_SUBSCRIBE_UUID";
export const SOCKET_UNSUBSCRIBE_UUID = "SOCKET_UNSUBSCRIBE_UUID";
export const SOCKET_SUBSCRIBE_UUID_MANY = "SOCKET_SUBSCRIBE_UUID_MANY";
export const SOCKET_UNSUBSCRIBE_UUID_MANY = "SOCKET_UNSUBSCRIBE_UUID_MANY";

export const SOCKET_CONNECT_ASSIGNMENTS = "SOCKET_CONNECT_ASSIGNMENTS";
export const SOCKET_DISCONNECT_ASSIGNMENTS = "SOCKET_DISCONNECT_ASSIGNMENTS";
export const SOCKET_SUBSCRIBE_ASSIGNMENTS = "SOCKET_SUBSCRIBE_ASSIGNMENTS";
export const SOCKET_UNSUBSCRIBE_ASSIGNMENTS = "SOCKET_UNSUBSCRIBE_ASSIGNMENTS";
export const SOCKET_ASSIGNMENTS_CONNECTED = "SOCKET_ASSIGNMENTS_CONNECTED";
export const SOCKET_ASSIGNMENTS_DISCONNECTED = "SOCKET_ASSIGNMENTS_DISCONNECTED";
export const SOCKET_SUBSCRIBE_ASSIGNMENTS_RESPONSE_RECEIVED = "SOCKET_SUBSCRIBE_ASSIGNMENTS_RESPONSE_RECEIVED";


export const SOCKET_SUBSCRIBE_COMMENTS = "SOCKET_SUBSCRIBE_COMMENTS";
export const SOCKET_UNSUBSCRIBE_COMMENTS = "SOCKET_UNSUBSCRIBE_COMMENTS";
export const SOCKET_CONNECT_COMMENTS = "SOCKET_CONNECT_COMMENTS";
export const SOCKET_COMMENTS_CONNECTED = "SOCKET_COMMENTS_CONNECTED";
export const SOCKET_COMMENTS_DISCONNECTED = "SOCKET_COMMENTS_DISCONNECTED";
export const SOCKET_SUBSCRIBE_COMMENTS_RESPONSE_RECEIVED = "SOCKET_SUBSCRIBE_COMMENTS_RESPONSE_RECEIVED";
export const SOCKET_DISCONNECT_COMMENTS = "SOCKET_DISCONNECT_COMMENTS";

export function connectSocket( url ) {
    return { type: SOCKET_CONNECT, url };
}

export function connectCommentsSocket( url ) {
    return { type: SOCKET_CONNECT_COMMENTS, url };
}

export function connectAssignmentsSocket( url ) {
    return { type: SOCKET_CONNECT_ASSIGNMENTS, url };
}

export function disconnectSocket() {
    return { type: SOCKET_DISCONNECT };
}

export function disconnectCommentsSocket() {
    return { type: SOCKET_DISCONNECT_COMMENTS };
}

export function disconnectAssignmentsSocket() {
    return { type: SOCKET_DISCONNECT_ASSIGNMENTS };
}

// these should only be dispatched by the middleware to indicate connection status

export function socketConnected() {
    return { type: SOCKET_CONNECTED };
}

export function socketDisconnected() {
    return { type: SOCKET_DISCONNECTED};
}

export function socketCommentsConnected() {
    return { type: SOCKET_COMMENTS_CONNECTED };
}

export function socketCommentsDisconnected() {
    return { type: SOCKET_COMMENTS_DISCONNECTED};
}

export function socketAssignmentsConnected() {
    return { type: SOCKET_ASSIGNMENTS_CONNECTED };
}

export function socketAssignmentsDisconnected() {
    return { type: SOCKET_ASSIGNMENTS_DISCONNECTED};
}

//*************

export function subscribedResponseReceived(data) {
    return { type: SOCKET_SUBSCRIBE_RESPONSE_RECEIVED, data };
}

export function subscribedCommentsResponseReceived(data) {
    return { type: SOCKET_SUBSCRIBE_COMMENTS_RESPONSE_RECEIVED, data };
}

export function subscribedAssignmentsResponseReceived(data) {
    return { type: SOCKET_SUBSCRIBE_ASSIGNMENTS_RESPONSE_RECEIVED, data };
}

export function subscribeToUUID(uuid) {
    return { type: SOCKET_SUBSCRIBE_UUID, uuid };
}

export function subscribeToUUIDs(uuids) {
    return { type: SOCKET_SUBSCRIBE_UUID_MANY, uuids };
}

export function unsubscribeFromUUID(uuid) {
    return { type: SOCKET_UNSUBSCRIBE_UUID, uuid };
}

export function unsubscribeFromUUIDs(uuids) {
    return { type: SOCKET_UNSUBSCRIBE_UUID_MANY, uuids };
}

export function subscribeToComments(uuid) {
    return { type: SOCKET_SUBSCRIBE_COMMENTS, uuid };
}

export function unsubscribeFromComments(uuid) {
    return { type: SOCKET_UNSUBSCRIBE_COMMENTS, uuid };
}
export function subscribeToAssignments(uuid) {
    return { type: SOCKET_SUBSCRIBE_ASSIGNMENTS, uuid };
}

export function unsubscribeFromAssigments(uuid) {
    return { type: SOCKET_UNSUBSCRIBE_ASSIGNMENTS, uuid };
}
