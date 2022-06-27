import * as awsHubSagas from "./awsHubListener/awsHubListenerSagas";

import { all, call } from "redux-saga/effects";
import { watchGetWhoami, watchRefreshWhoami } from "./WhoamiSaga";
import { watchLogin, watchLogout, watchRefreshToken } from "./login/LoginSagas";
import {
    watchInitialiseApp,
    watchInitialWhoamiCompleted,
} from "./initialise/initialiseSagas";
import { watchDebounceDashboardFilter } from "./dashboardFilter/DashboardFilterSagas";
import { watchInitialiseBroadcastAPIListener } from "./broadcastAPI/broadcastAPISagas";
import { watchInitializeTaskAssigneesObserver } from "./taskAssignees/taskAssigneesSagas";
import {
    watchSelectAllItems,
    watchFilterFromAvailableItems,
} from "./selectionMode/selectionModeSagas";

export default function* rootSaga() {
    yield all([
        call(awsHubSagas.watchInitialiseDataStoreListener),
        call(watchGetWhoami),
        call(watchRefreshWhoami),
        call(watchLogin),
        call(watchLogout),
        call(watchInitialiseApp),
        call(watchInitialWhoamiCompleted),
        call(watchRefreshToken),
        call(watchDebounceDashboardFilter),
        call(watchInitialiseBroadcastAPIListener),
        call(watchInitializeTaskAssigneesObserver),
        call(watchSelectAllItems),
        call(watchFilterFromAvailableItems),
    ]);
}
