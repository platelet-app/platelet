import {watchGetSessions, watchPostNewSession, watchGetSession} from "./SessionSagas"
import {
    watchPostNewTask,
    watchGetTasks,
    watchUpdateTask,
    watchGetMyTasks,
    watchGetTask,
    watchDeleteTask,
    watchDeleteTaskUndoable,
    watchUndoDeleteTask,
    watchUpdateTaskAssignedRider,
    watchUpdateTaskContactName,
    watchUpdateTaskContactNumber,
    watchUpdateTaskDropoffAddress,
    watchUpdateTaskDropoffTime,
    watchUpdateTaskPickupTime,
    watchUpdateTaskPickupAddress,
    watchUpdateTaskPriority, watchUpdateTaskCancelledTime, watchUpdateTaskRejectedTime
} from "./TaskSagas"
import {
    watchGetAvailableDeliverables,
    watchGetDeliverables,
    watchPostNewDeliverable,
    watchUpdateDeliverable
} from "./DeliverableSagas"
import {watchPostNewVehicle, watchGetVehicles, watchUpdateVehicle, watchVehicle} from "./VehicleSagas"

import { all, call } from 'redux-saga/effects'
import {watchGetAvailablePriorities} from "./PrioritiesSagas";
import {watchGetAvailableLocations} from "./LocationsSagas";
import {watchGetUsers} from "./UserSagas";
import {watchGetWhoami} from "./WhoamiSaga";
import {watchLogin} from "./LoginSagas"

export default function* rootSaga() {
    yield all([
        call(watchPostNewSession),
        call(watchPostNewTask),
        call(watchDeleteTask),
        call(watchGetSessions),
        call(watchGetSession),
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
        call(watchDeleteTaskUndoable),
        call(watchUndoDeleteTask),
    ])
}
