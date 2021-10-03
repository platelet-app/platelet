import * as actions from "./awsHubListenerActions";
import { takeLatest } from "@redux-saga/core/effects";
import { Hub } from "aws-amplify";
import { call, take, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";

function listener() {
    return eventChannel((emitter) => {
        const listener = Hub.listen("datastore", async (hubData) => {
            emitter(hubData);
        });
        return () => {
            listener();
        };
    });
}
function* initialiseDataStoreListener(action) {
    if (process.env.REACT_APP_OFFLINE_ONLY === "true") {
        yield put(actions.setNetworkStatus(true));
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
                console.log("DataStore is ready");
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
