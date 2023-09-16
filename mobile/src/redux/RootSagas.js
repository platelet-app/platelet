import * as awsHubSagas from "./awsHubListener/awsHubListenerSagas";

import { all, call } from "redux-saga/effects";
import {
    watchGetWhoami,
    watchInitWhoamiObserver,
    watchRefreshWhoami,
} from "./whoami/whoamiSagas";
import { watchLogout } from "./login/LoginSagas";
import {
    watchInitialiseApp,
    watchInitialWhoamiCompleted,
} from "./initialise/initialiseSagas";
import { watchDebounceDashboardFilter } from "./dashboardFilter/DashboardFilterSagas";
import {
    watchSelectAllItems,
    watchFilterFromAvailableItems,
} from "./selectionMode/selectionModeSagas";
import { watchInitializeTaskDeliverablesObserver } from "./taskDeliverables/taskDeliverablesSagas";
import { watchInitializeCommentsObserver } from "./comments/commentsSagas";

export default function* rootSaga() {
    yield all([
        call(awsHubSagas.watchInitialiseDataStoreListener),
        call(watchGetWhoami),
        call(watchRefreshWhoami),
        call(watchLogout),
        call(watchInitialiseApp),
        call(watchInitialWhoamiCompleted),
        call(watchDebounceDashboardFilter),
        call(watchSelectAllItems),
        call(watchFilterFromAvailableItems),
        call(watchInitWhoamiObserver),
        call(watchInitializeTaskDeliverablesObserver),
        call(watchInitializeCommentsObserver),
    ]);
}
