import {call, put, takeLatest, all, take, select} from "redux-saga/effects";
import {INITIALISE_APP} from "./initialiseActions";
import moment from "moment-timezone";
import {logoutUser} from "../login/LoginActions";
import {useEffect} from "react";
import {clearWhoami, GET_WHOAMI_SUCCESS, getWhoamiRequest, getWhoamiSuccess} from "../Actions";
import {getAvailablePrioritiesRequest} from "../priorities/PrioritiesActions";
import {getAvailableDeliverablesRequest} from "../deliverables/DeliverablesActions";
import {getAvailableLocationsRequest} from "../locations/LocationsActions";
import {getUsersRequest} from "../users/UsersActions";
import {getAvailablePatchesRequest} from "../patches/PatchesActions";
import {getAllTasksRequest, setRoleViewAndGetTasks} from "../tasks/TasksActions";
import {getRoleView, getWhoami} from "../Api";
import {getServerSettingsRequest} from "../ServerSettings/ServerSettingsActions";
import {connectAssignmentsSocket, connectCommentsSocket, connectSocket} from "../sockets/SocketActions";
import {getApiURL, getDashboardRoleMode} from "../../utilities";
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
    yield all([
        put(getWhoamiRequest()),
        put(connectSocket()),
        put(connectCommentsSocket()),
        put(connectAssignmentsSocket()),
        put(getAvailablePrioritiesRequest()),
        put(getAvailableDeliverablesRequest()),
        put(getAvailableLocationsRequest()),
        put(getUsersRequest()),
        put(getAvailablePatchesRequest()),
    ])

}

export function* watchInitialiseApp() {
    yield takeLatest(INITIALISE_APP, initialiseApp)
}
