import {
    watchGetSessions,
    watchPostNewSession,
    watchGetSession,
    watchDeleteSession,
    watchRestoreSession
} from "./sessions/Sagas"
import {
    watchPostNewTask,
    watchGetTasks,
    watchUpdateTask,
    watchGetMyTasks,
    watchGetTask,
    watchDeleteTask,
    watchRestoreTask,
    watchUpdateTaskAssignedRider,
    watchUpdateTaskContactName,
    watchUpdateTaskContactNumber,
    watchUpdateTaskDropoffAddress,
    watchUpdateTaskDropoffTime,
    watchUpdateTaskPickupTime,
    watchUpdateTaskPickupAddress,
    watchUpdateTaskPriority, watchUpdateTaskCancelledTime, watchUpdateTaskRejectedTime
} from "./tasks/Sagas"
import {
    watchGetAvailableDeliverables,
    watchGetDeliverables,
    watchPostNewDeliverable,
    watchUpdateDeliverable
} from "./deliverables/Sagas"
import {watchPostNewVehicle, watchGetVehicles, watchUpdateVehicle, watchVehicle} from "./vehicles/Sagas"

import { all, call } from 'redux-saga/effects'
import {watchGetAvailablePriorities} from "./priorities/Sagas";
import {watchGetAvailableLocations} from "./locations/Sagas";
import {watchGetUsers} from "./users/Sagas";
import {watchGetWhoami} from "./WhoamiSaga";
import {watchLogin} from "./login/Sagas"
import {watchGetAvailablePatches} from "./patches/Sagas";

export default function* rootSaga() {
    yield all([
        call(watchPostNewSession),
        call(watchPostNewTask),
        call(watchDeleteTask),
        call(watchGetSessions),
        call(watchGetSession),
        call(watchDeleteSession),
        call(watchRestoreSession),
        call(watchGetTask),
        call(watchGetTasks),
        call(watchUpdateTask),
        call(watchUpdateTaskAssignedRider),
        call(watchUpdateTaskContactName),
        call(watchUpdateTaskContactNumber),
        call(watchUpdateTaskDropoffAddress),
        call(watchUpdateTaskPickupAddress),
        call(watchUpdateTaskDropoffTime),
        call(watchUpdateTaskPickupTime),
        call(watchUpdateTaskPriority),
        call(watchUpdateTaskCancelledTime),
        call(watchUpdateTaskRejectedTime),
        call(watchGetMyTasks),
        call(watchGetDeliverables),
        call(watchGetAvailableDeliverables),
        call(watchGetAvailablePriorities),
        call(watchGetAvailableLocations),
        call(watchPostNewDeliverable),
        call(watchUpdateDeliverable),
        call(watchGetVehicles),
        call(watchUpdateVehicle),
        call(watchPostNewVehicle),
        call(watchVehicle),
        call(watchGetUsers),
        call(watchGetWhoami),
        call(watchLogin),
        call(watchRestoreTask),
        call(watchGetAvailablePatches),
    ])
}
