import {call, put, takeLatest, all, select} from "redux-saga/effects";
import {INITIALISE_APP} from "./initialiseActions";
import {startTokenRefreshLoop} from "../login/LoginActions";
import _ from "lodash"
import {getWhoamiRequest, getWhoamiSuccess} from "../Actions";
import {getAvailablePrioritiesRequest} from "../priorities/PrioritiesActions";
import {getAvailableDeliverablesRequest} from "../deliverables/DeliverablesActions";
import {getAvailableLocationsRequest} from "../locations/LocationsActions";
import {getUsersRequest} from "../users/UsersActions";
import {getAvailablePatchesRequest} from "../patches/PatchesActions";
import {getApiControl} from "../Api";
import {connectAssignmentsSocket, connectCommentsSocket, connectSocket} from "../sockets/SocketActions";
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
    //const api = yield select(getApiControl);
    //const whoami = yield call([api, api.users.whoami]);
    //yield put(getWhoamiSuccess(_.omit(whoami, "login_expiry")))
    //yield put(startTokenRefreshLoop(whoami.refresh_expiry))
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
