import {
    watchGetSessions,
    watchPostNewSession,
    watchGetSession,
    watchDeleteSession,
    watchRestoreSession, watchGetSessionStatistics
} from "./sessions/SessionsSagas"
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
} from "./tasks/TasksSagas"
import {
    watchGetAvailableDeliverables,
    watchGetDeliverables,
    watchPostNewDeliverable,
    watchUpdateDeliverable
} from "./deliverables/DeliverablesSagas"
import {
    watchGetComments, watchGetSessionComments, watchPostNewComment, watchPostNewSessionComment
} from "./comments/CommentsSagas";
import {
    watchPostNewVehicle,
    watchGetVehicles,
    watchUpdateVehicle,
    watchVehicle,
    watchDeleteVehicle,
    watchRestoreVehicle,
    watchUpdateVehicleName,
    watchUpdateVehicleManufacturer,
    watchUpdateVehicleModel, watchUpdateVehicleRegistration
} from "./vehicles/VehiclesSagas"

import { all, call } from 'redux-saga/effects'
import {watchGetAvailablePriorities} from "./priorities/PrioritiesSagas";
import {watchGetAvailableLocations} from "./locations/LocationsSagas";
import {watchGetUsers, watchGetUser} from "./users/UsersSagas";
import {watchGetWhoami} from "./WhoamiSaga";
import {watchLogin} from "./login/LoginSagas"
import {watchGetAvailablePatches} from "./patches/PatchesSagas";

export default function* rootSaga() {
    yield all([
        call(watchPostNewSession),
        call(watchPostNewTask),
        call(watchDeleteTask),
        call(watchGetSessions),
        call(watchGetSession),
        call(watchGetSessionStatistics),
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
        call(watchUpdateVehicleName),
        call(watchUpdateVehicleManufacturer),
        call(watchUpdateVehicleModel),
        call(watchUpdateVehicleRegistration),
        call(watchPostNewVehicle),
        call(watchVehicle),
        call(watchDeleteVehicle),
        call(watchRestoreVehicle),
        call(watchGetUsers),
        call(watchGetUser),
        call(watchGetWhoami),
        call(watchLogin),
        call(watchRestoreTask),
        call(watchGetAvailablePatches),
        call(watchGetComments),
        call(watchPostNewComment),
        call(watchGetSessionComments),
        call(watchPostNewSessionComment)
    ])
}
