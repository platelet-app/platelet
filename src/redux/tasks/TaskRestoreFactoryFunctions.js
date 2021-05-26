import * as taskActions from "./TasksActions";
import {unsetTaskDropoffDestinationRequest} from "../taskDestinations/TaskDestinationsActions";

export const actionTimeCancelledRestoreFactory = (action) => () => [taskActions.updateTaskCancelledTimeRequest(action.data.taskUUID, {time_cancelled: null})]
export const actionTimeRejectedRestoreFactory  = (action) => () => [taskActions.updateTaskRejectedTimeRequest(action.data.taskUUID, {time_rejected: null})]
export const actionTimePickedUpRestoreFactory  = (action) => () => [taskActions.updateTaskPickupTimeRequest(action.data.taskUUID, {time_picked_up: null})]
export const actionTimeDroppedOffRestoreFactory  = (action) => () => [taskActions.updateTaskDropoffTimeRequest(action.data.taskUUID, {time_dropped_off: null})]

export const actionDeleteWithRelaysRestoreFactory = (action, relayPreviousUUID) => () => [
    taskActions.restoreTaskRequest(action.data),
    unsetTaskDropoffDestinationRequest(
        relayPreviousUUID
    ),
];
export const actionDeleteRestoreFactory = (action) => () => [
        taskActions.restoreTaskRequest(action.data)
];
