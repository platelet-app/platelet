import {watchGetSessions, watchPostNewSession, watchGetSession} from "./SessionSagas"
import {watchPostNewTask, watchGetTasks, watchUpdateTask, watchGetMyTasks, watchGetTask} from "./TaskSagas"
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

export default function* rootSaga() {
    yield all([
        call(watchPostNewSession),
        call(watchPostNewTask),
        call(watchGetSessions),
        call(watchGetSession),
        call(watchGetTask),
        call(watchGetTasks),
        call(watchUpdateTask),
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
        call(watchGetWhoami)

    ])
}
