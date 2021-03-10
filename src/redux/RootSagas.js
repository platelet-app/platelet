import {
    watchPostNewTask,
    watchPostNewTaskRelay,
    watchGetTasks,
    watchUpdateTask,
    watchDeleteTask,
    watchRestoreTask,
    watchUpdateTaskDropoffTime,
    watchUpdateTaskPickupTime,
    watchUpdateTaskPriority,
    watchUpdateTaskRejectedTime,
    watchUpdateTaskPatch,
    watchUpdateTaskRequesterContact,
    watchSetRoleViewAndGetTasks,
    watchRefreshTasksFromSocket, watchUpdateTaskTimeOfCall, watchUpdateTaskTimeCancelled
} from "./tasks/TasksSagas"
import {
    watchAddNewDropoffLocationAndSetTask,
    watchAddNewPickupLocationAndSetTask,
    watchSetTaskDropoffDestination,
    watchSetTaskPickupDestination,
    watchUnsetTaskDropoffDestination,
    watchUnsetTaskPickupDestination, watchUpdateDropoffLocationAndUpdateTask,
    watchUpdatePickupLocationAndUpdateTask
} from "./taskDestinations/TaskDestinationsSagas"
import {
    watchDeleteDeliverable,
    watchGetAvailableDeliverables,
    watchGetDeliverables,
    watchPostNewDeliverable,
    watchUpdateDeliverable
} from "./deliverables/DeliverablesSagas"
import {
    watchDeleteComment,
    watchGetComments,
    watchPostNewComment,
    watchRestoreComment,
    watchUpdateComment,

} from "./comments/CommentsSagas";
import {
    watchPostNewVehicle,
    watchGetVehicles,
    watchUpdateVehicle,
    watchVehicle,
    watchDeleteVehicle,
    watchRestoreVehicle,
} from "./vehicles/VehiclesSagas"

import { all, call } from 'redux-saga/effects'
import {watchGetAvailablePriorities} from "./priorities/PrioritiesSagas";
import {watchGetAvailableLocations, watchGetLocation, watchUpdateLocation, watchAddNewLocation} from "./locations/LocationsSagas";
import {
    watchGetUsers,
    watchGetUser,
    watchAddUser,
    watchDeleteUser,
    watchRestoreUser,
    watchUpdateUser, watchUpdateUserPassword, watchUploadUserProfilePicture
} from "./users/UsersSagas";
import {watchGetWhoami, watchRefreshWhoami} from "./WhoamiSaga";
import {watchLogin, watchLogout, watchRefreshToken} from "./login/LoginSagas"
import {watchGetAvailablePatches} from "./patches/PatchesSagas";
import {watchGetServerSettings} from "./ServerSettings/ServerSettingsSagas";
import {
    watchGetTaskAssignedRiders, watchUpdateTaskAddAssignedCoordinator,
    watchUpdateTaskAddAssignedRider, watchUpdateTaskRemoveCoordinator,
    watchUpdateTaskRemoveRider
} from "./taskAssignees/TaskAssigneesSagas";
import {
    watchGetActionsRecord,
    watchGetTasksActionsRecord,
} from "./actionsRecord/ActionsRecordSagas";
import {watchGetUserStatistics} from "./statistics/statisticsSagas";
import {
    watchAppendTasksCancelled,
    watchAppendTasksDelivered,
    watchAppendTasksRejected
} from "./tasks/TaskWaypointSagas";
import {watchInitialiseApp, watchInitialWhoamiCompleted} from "./initialise/initialiseSagas";
import authenticationMonitor from "./login/AuthenticationMonitor";
import updateActiveTaskMonitor from "./activeTask/ActiveTaskMonitors"
import {watchGetTask} from "./activeTask/ActiveTaskSagas"
import {watchDebounceDashboardFilter} from "./dashboardFilter/DashboardFilterSagas";

export default function* rootSaga() {
    yield all([
        call(watchPostNewTask),
        call(watchPostNewTaskRelay),
        call(watchDeleteTask),
        call(watchGetTask),
        call(watchGetTasks),
        call(watchUpdateTask),
        call(watchGetTaskAssignedRiders),
        call(watchUpdateTaskAddAssignedRider),
        call(watchUpdateTaskAddAssignedCoordinator),
        call(watchUpdateTaskRemoveRider),
        call(watchUpdateTaskRemoveCoordinator),
        call(watchUpdateTaskRequesterContact),
        call(watchUpdateTaskDropoffTime),
        call(watchUpdateTaskPickupTime),
        call(watchUpdateTaskPriority),
        call(watchUpdateTaskPatch),
        call(watchUpdateTaskTimeCancelled),
        call(watchUpdateTaskRejectedTime),
        call(watchUpdateTaskTimeOfCall),
        call(watchDeleteDeliverable),
        call(watchGetDeliverables),
        call(watchGetAvailableDeliverables),
        call(watchGetAvailablePriorities),
        call(watchGetAvailableLocations),
        call(watchAddNewLocation),
        call(watchGetLocation),
        call(watchUpdateLocation),
        call(watchPostNewDeliverable),
        call(watchUpdateDeliverable),
        call(watchGetVehicles),
        call(watchUpdateVehicle),
        call(watchPostNewVehicle),
        call(watchVehicle),
        call(watchDeleteVehicle),
        call(watchRestoreVehicle),
        call(watchGetUsers),
        call(watchGetUser),
        call(watchGetWhoami),
        call(watchRefreshWhoami),
        call(watchLogin),
        call(watchLogout),
        call(watchRestoreTask),
        call(watchGetAvailablePatches),
        call(watchGetComments),
        call(watchUpdateComment),
        call(watchPostNewComment),
        call(watchDeleteComment),
        call(watchRestoreComment),
        call(watchGetServerSettings),
        call(watchAddUser),
        call(watchDeleteUser),
        call(watchRestoreUser),
        call(watchUpdateUser),
        call(watchUploadUserProfilePicture),
        call(watchUpdateUserPassword),
        call(watchGetActionsRecord),
        call(watchGetTasksActionsRecord),
        call(watchSetRoleViewAndGetTasks),
        call(watchRefreshTasksFromSocket),
        call(watchGetUserStatistics),
        call(watchAppendTasksCancelled),
        call(watchAppendTasksRejected),
        call(watchAppendTasksDelivered),
        call(watchInitialiseApp),
        call(watchInitialWhoamiCompleted),
        call(authenticationMonitor),
        call(watchRefreshToken),
        call(watchSetTaskPickupDestination),
        call(watchSetTaskDropoffDestination),
        call(watchUnsetTaskDropoffDestination),
        call(watchUnsetTaskPickupDestination),
        call(watchAddNewPickupLocationAndSetTask),
        call(watchUpdatePickupLocationAndUpdateTask),
        call(watchUpdateDropoffLocationAndUpdateTask),
        call(watchAddNewDropoffLocationAndSetTask),
        call(updateActiveTaskMonitor),
        call(watchDebounceDashboardFilter)
    ])
}
