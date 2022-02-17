import * as actions from "./broadcastAPIActions";
import { takeLatest } from "@redux-saga/core/effects";
import { call, take, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { logoutUser } from "../login/LoginActions";

function listener() {
    const channel = new BroadcastChannel("platelet-broadcast-channel");
    return eventChannel((emitter) => {
        channel.onmessage = (event) => {
            emitter({
                payload: event.data,
            });
        };
        return () => {
            channel.close();
        };
    });
}

function* initialiseBroadcastAPIListener() {
    const channel = yield call(listener);
    try {
        while (true) {
            const broadcastData = yield take(channel);
            const data = broadcastData.payload;
            if (data === "logout") {
                yield put(logoutUser({ broadcast: false }));
                console.log("User was logged out through the broadcast API");
            }
        }
    } finally {
        //TODO: why does this run multiple times when interacting with the UI?
        console.log("stop BroadcastChannel");
    }
}

export function* watchInitialiseBroadcastAPIListener() {
    yield takeLatest(
        actions.initialiseBroadcastAPIListener,
        initialiseBroadcastAPIListener
    );
}
