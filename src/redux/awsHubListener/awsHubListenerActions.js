export const initialiseAwsDataStoreListenerAction =
    "INITIALISE_AWS_DATASTORE_LISTENER";
export const setNetworkStatusAction = "AWS_DATASTORE_SET_NETWORK_STATUS";
export const setReadyStatusAction = "AWS_DATASTORE_SET_READY_STATUS";
export const setModelSyncedStatusAction =
    "AWS_DATASTORE_SET_MODEL_SYNCED_STATUS";
export const setModelSyncedAllAction = "AWS_DATASTORE_SET_ALL_MODEL_SYNCED";

export function initialiseAwsDataStoreListener() {
    return { type: initialiseAwsDataStoreListenerAction };
}

export function setNetworkStatus(data) {
    return { type: setNetworkStatusAction, data };
}

export function setReadyStatus(data) {
    return { type: setReadyStatusAction, data };
}

export function setModelSyncedStatus(modelName) {
    return { type: setModelSyncedStatusAction, modelName };
}

export function setModelSyncedAll() {
    return { type: setModelSyncedAllAction };
}
