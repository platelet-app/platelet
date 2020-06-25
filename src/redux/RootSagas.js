import {
    watchGetSessions,
    watchPostNewSession,
    watchPostNewSessionAndSetcurrent,
    watchGetSession,
    watchDeleteSession,
    watchRestoreSession,
    watchGetSessionStatistics, watchRefreshCurrentSession, watchAddSessionCollaborator
} from "./sessions/SessionsSagas"
import {
    watchPostNewTask,
    watchGetTasks,
    watchUpdateTask,
    watchGetMyTasks,
    watchGetTask,
    watchDeleteTask,
    watchRestoreTask,
    watchUpdateTaskContactName,
    watchUpdateTaskContactNumber,
    watchUpdateTaskDropoffAddress,
    watchUpdateTaskDropoffTime,
    watchUpdateTaskPickupTime,
    watchUpdateTaskPickupAddress,
    watchUpdateTaskPriority,
    watchUpdateTaskCancelledTime,
    watchUpdateTaskRejectedTime,
    watchUpdateTaskPatch,
    watchRefreshTasks, watchRefreshMyTasks, watchUpdateTaskPatchFromServer
} from "./tasks/TasksSagas"
import {
    watchDeleteDeliverable,
    watchGetAvailableDeliverables,
    watchGetDeliverables,
    watchPostNewDeliverable,
    watchUpdateDeliverable
} from "./deliverables/DeliverablesSagas"
import {
    watchDeleteComment, watchDeleteSidebarComment,
    watchGetComments,
    watchGetSidebarComments,
    watchPostNewComment,
    watchPostNewSidebarComment, watchRestoreComment, watchRestoreSidebarComment, watchUpdateComment,
    watchUpdateSidebarComment
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
import {
    watchGetUsers,
    watchGetUser,
    watchAddUser,
    watchDeleteUser,
    watchRestoreUser,
    watchUpdateUser
} from "./users/UsersSagas";
import {watchGetWhoami, watchRefreshWhoami} from "./WhoamiSaga";
import {watchLogin} from "./login/LoginSagas"
import {watchGetAvailablePatches} from "./patches/PatchesSagas";
import {watchGetServerSettings} from "./ServerSettings/ServerSettingsSagas";
import {
    watchGetTaskAssignedRiders,
    watchUpdateTaskAddAssignedRider,
    watchUpdateTaskRemoveRider
} from "./taskAssignees/taskAssigneesSagas";

export default function* rootSaga() {
    yield all([
        call(watchPostNewSession),
        call(watchPostNewTask),
        call(watchDeleteTask),
        call(watchGetSessions),
        call(watchGetSession),
        call(watchRefreshCurrentSession),
        call(watchGetSessionStatistics),
        call(watchDeleteSession),
        call(watchRestoreSession),
        call(watchAddSessionCollaborator),
        call(watchGetTask),
        call(watchGetTasks),
        call(watchRefreshTasks),
        call(watchRefreshMyTasks),
        call(watchUpdateTask),
        call(watchGetTaskAssignedRiders),
        call(watchUpdateTaskAddAssignedRider),
        call(watchUpdateTaskRemoveRider),
        call(watchUpdateTaskContactName),
        call(watchUpdateTaskContactNumber),
        call(watchUpdateTaskDropoffAddress),
        call(watchUpdateTaskPickupAddress),
        call(watchUpdateTaskDropoffTime),
        call(watchUpdateTaskPickupTime),
        call(watchUpdateTaskPriority),
        call(watchUpdateTaskPatch),
        call(watchUpdateTaskPatchFromServer),
        call(watchUpdateTaskCancelledTime),
        call(watchUpdateTaskRejectedTime),
        call(watchGetMyTasks),
        call(watchDeleteDeliverable),
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
        call(watchRefreshWhoami),
        call(watchLogin),
        call(watchRestoreTask),
        call(watchGetAvailablePatches),
        call(watchGetComments),
        call(watchUpdateComment),
        call(watchPostNewComment),
        call(watchDeleteComment),
        call(watchRestoreComment),
        call(watchGetSidebarComments),
        call(watchUpdateSidebarComment),
        call(watchDeleteSidebarComment),
        call(watchRestoreSidebarComment),
        call(watchPostNewSidebarComment),
        call(watchGetServerSettings),
        call(watchAddUser),
        call(watchDeleteUser),
        call(watchRestoreUser),
        call(watchUpdateUser)
    ])
}
