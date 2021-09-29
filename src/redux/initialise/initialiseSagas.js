import {
    call,
    put,
    takeLatest,
    all,
    take,
    select,
    delay,
} from "redux-saga/effects";
import { initialiseAwsDataStoreListener } from "../awsHubListener/awsHubListenerActions";
import { INITIALISE_APP } from "./initialiseActions";
import moment from "moment-timezone";
import { logoutUser } from "../login/LoginActions";
import { useEffect } from "react";
import {
    clearWhoami,
    GET_WHOAMI_SUCCESS,
    getWhoamiRequest,
    getWhoamiSuccess,
} from "../Actions";
import { getAvailablePrioritiesRequest } from "../priorities/PrioritiesActions";
import { getAvailableDeliverablesRequest } from "../deliverables/DeliverablesActions";
import { getAvailableLocationsRequest } from "../locations/LocationsActions";
import { getUsersRequest } from "../users/UsersActions";
import { getAvailablePatchesRequest } from "../patches/PatchesActions";
import {
    getAllTasksRequest,
    setRoleViewAndGetTasks,
    startRefreshTasksLoopFromSocket,
} from "../tasks/TasksActions";
import { getRoleView, getWhoami } from "../Selectors";
import { getServerSettingsRequest } from "../ServerSettings/ServerSettingsActions";
import {
    connectAssignmentsSocket,
    connectCommentsSocket,
    connectSocket,
} from "../sockets/SocketActions";
import { getApiURL, getDashboardRoleMode } from "../../utilities";
import { useSelector } from "react-redux";
import { DataStore } from "aws-amplify";
// function loginCheck() {
//     if (whoami && whoami.login_expiry) {
//         // if the login is going to expire in 3 days, log out the user
//         if (whoami.login_expiry < moment().add("days", 3).unix()) {
//             dispatch(logoutUser());
//         } else {
//             setConfirmLogin(true);
//         }
//     }
// }
//
// useEffect(loginCheck, [whoami])
//
// function firstWhoami() {
//     if (isInitialised)
//         dispatch(getWhoamiRequest());
//     else
//         dispatch(clearWhoami())
// }
//
// useEffect(firstWhoami, [isInitialised])
//
// function getStaticData() {
//     if (isInitialised) {
//         dispatch(getAvailablePrioritiesRequest());
//         dispatch(getAvailableDeliverablesRequest());
//         dispatch(getAvailableLocationsRequest());
//         dispatch(getUsersRequest());
//         dispatch(getAvailablePatchesRequest())
//     }
// }
//
// useEffect(getStaticData, [confirmLogin]);

function* initialiseApp() {
    yield put(getWhoamiRequest());
}

export function* watchInitialiseApp() {
    yield takeLatest(INITIALISE_APP, initialiseApp);
}

function* getStaticData() {
    const whoami = yield select(getWhoami);
    yield all([
        put(initialiseAwsDataStoreListener()),
        put(connectSocket()),
        put(connectCommentsSocket()),
        put(connectAssignmentsSocket()),
        put(getAvailablePrioritiesRequest()),
        put(getAvailableDeliverablesRequest()),
        put(getAvailableLocationsRequest()),
        put(getUsersRequest()),
        put(getAvailablePatchesRequest()),
        put(startRefreshTasksLoopFromSocket(whoami.id)),
    ]);
}

export function* watchInitialWhoamiCompleted() {
    yield takeLatest(GET_WHOAMI_SUCCESS, getStaticData);
}
