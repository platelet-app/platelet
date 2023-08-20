import * as actions from "./awsHubListenerActions";
import { takeLatest } from "@redux-saga/core/effects";
import { Hub } from "aws-amplify";
import { call, take, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import AsyncStorage from "@react-native-async-storage/async-storage";

function listener() {
    return eventChannel((emitter) => {
        const hubListener = Hub.listen("datastore", async (hubData) => {
            emitter(hubData);
        });
        return () => {
            Hub.remove("datastore", hubListener);
        };
    });
}

const setLastSyncedDate = () => {
    const dateLastSynced = new Date().toISOString().split("T")[0];
    AsyncStorage.setItem("dateLastSynced", dateLastSynced);
};

const clearLastSyncedDate = () => {
    AsyncStorage.removeItem("dateLastSynced");
};

function* initialiseDataStoreListener() {
    if (
        process.env.NODE_ENV === "test" ||
        process.env.REACT_APP_DEMO_MODE === "true"
    ) {
        yield put(actions.setNetworkStatus(true));
        yield put(actions.setReadyStatus(true));
        yield put(actions.setModelSyncedAll());
        return;
    } else if (process.env.REACT_APP_OFFLINE_ONLY === "true") {
        yield put(actions.setNetworkStatus(false));
        yield put(actions.setReadyStatus(true));
        return;
    }
    const channel = yield call(listener);
    try {
        while (true) {
            const hubData = yield take(channel);
            const { event, data } = hubData.payload;
            if (event === "networkStatus") {
                // TODO: Why doesn't this work in chrome but is fine in firefox?
                yield put(actions.setNetworkStatus(data.active));
                console.log(`User has a network connection: ${data.active}`);
            } else if (event === "ready") {
                yield call(setLastSyncedDate);
                yield put(actions.setReadyStatus(true));
                console.log("DataStore is ready");
            } else if (event === "outboxStatus") {
                const { isEmpty } = data;
                if (!isEmpty) {
                    console.log(
                        "outbox is not empty, clearing last synced date"
                    );
                    yield call(clearLastSyncedDate);
                } else {
                    console.log("outbox is empty, setting last synced date");
                    yield call(setLastSyncedDate);
                }
            } else if (event === "modelSynced") {
                console.log(`${data.model.name} is synced`);
                yield put(actions.setModelSyncedStatus(data.model.name));
            }
        }
    } finally {
        console.log("stop DataStore listener");
    }
}

export function* watchInitialiseDataStoreListener() {
    yield takeLatest(
        actions.initialiseAwsDataStoreListenerAction,
        initialiseDataStoreListener
    );
}
