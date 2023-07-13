import { call, takeLatest } from "redux-saga/effects";
import { LOGOUT } from "./LoginActions";

import { Auth, DataStore } from "aws-amplify";

function* logout(action) {
    try {
        yield call([DataStore, DataStore.stop]);
        yield call([DataStore, DataStore.clear]);
    } catch (error) {
        console.log(error);
    } finally {
        // if DataStore fails to clear for some reason
        // we still want to logout the user
        yield call([Auth, Auth.signOut]);
        yield call([window, window.location.reload.bind(window.location)]);
    }
}

export function* watchLogout() {
    yield takeLatest(LOGOUT, logout);
}
