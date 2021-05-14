import * as taskActions from "./TasksActions";
import {unsetTaskDropoffDestinationRequest} from "../taskDestinations/TaskDestinationsActions";

export const actionTimeCancelledRestoreFactory = (action) => () => [taskActions.updateTaskCancelledTimeRequest(action.data.taskUUID, {time_cancelled: null})]
export const actionDeleteWithRelaysRestoreFactory = (action, relayPreviousUUID) => () => [
    taskActions.restoreTaskRequest(action.data),
    unsetTaskDropoffDestinationRequest(
        relayPreviousUUID
    ),
];
export const actionDeleteRestoreFactory = (action) => () => [
        taskActions.restoreTaskRequest(action.data)
];
