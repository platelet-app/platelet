import * as actions from "./awsHubListenerActions";
import { takeLatest } from "@redux-saga/core/effects";
import { Hub } from "aws-amplify";
import { call, take, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";

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

function* initialiseDataStoreListener() {
    if (
        process.env.NODE_ENV === "test" ||
        process.env.REACT_APP_DEMO_MODE === "true"
    ) {
        yield put(actions.setNetworkStatus(true));
        yield put(actions.setReadyStatus(true));
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
                yield put(actions.setReadyStatus(true));
                // set all of modelsycned to true
                // because when first logging in for some reason they don't all get triggered
                // but datastore ready status does..
                yield put(actions.setModelSyncedAll());
                console.log("DataStore is ready");
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
