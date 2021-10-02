import { put, takeLatest, all } from "redux-saga/effects";
import { initialiseAwsDataStoreListener } from "../awsHubListener/awsHubListenerActions";
import { INITIALISE_APP } from "./initialiseActions";
import { GET_WHOAMI_SUCCESS, getWhoamiRequest } from "../Actions";

function* initialiseApp() {
    yield put(getWhoamiRequest());
}

export function* watchInitialiseApp() {
    yield takeLatest(INITIALISE_APP, initialiseApp);
}

function* getStaticData() {
    yield all([put(initialiseAwsDataStoreListener())]);
}

export function* watchInitialWhoamiCompleted() {
    yield takeLatest(GET_WHOAMI_SUCCESS, getStaticData);
}
