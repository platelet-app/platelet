import {watchGetSessions, watchPostNewSession} from "./SessionSagas"
import {watchPostNewTask, watchGetTasks, watchUpdateTask, watchGetMyTasks, watchGetTask} from "./TaskSagas"
import {watchGetDeliverables, watchPostNewDeliverable, watchUpdateDeliverable} from "./DeliverableSagas"
import {watchPostNewVehicle, watchGetVehicles, watchUpdateVehicle, watchVehicle} from "./VehicleSagas"

import { all, call } from 'redux-saga/effects'

export default function* rootSaga() {
    yield all([
        call(watchPostNewSession),
        call(watchPostNewTask),
        call(watchGetSessions),
        call(watchGetTask),
        call(watchGetTasks),
        call(watchUpdateTask),
        call(watchGetMyTasks),
        call(watchGetDeliverables),
        call(watchPostNewDeliverable),
        call(watchUpdateDeliverable),
        call(watchGetVehicles),
        call(watchUpdateVehicle),
        call(watchPostNewVehicle),
        call(watchVehicle)
    ])
}
