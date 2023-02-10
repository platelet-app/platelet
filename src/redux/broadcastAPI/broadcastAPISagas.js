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
    try {
        const channel = yield call(listener);
        while (true) {
            const broadcastData = yield take(channel);
            const data = broadcastData.payload;
            if (data === "logout") {
                yield put(logoutUser({ broadcast: false }));
                console.log("User was logged out through the broadcast API");
            }
        }
    } catch (error) {
        console.log("failed to init broadcast listener", error);
    }
}

export function* watchInitialiseBroadcastAPIListener() {
    yield takeLatest(
        actions.initialiseBroadcastAPIListener,
        initialiseBroadcastAPIListener
    );
}
