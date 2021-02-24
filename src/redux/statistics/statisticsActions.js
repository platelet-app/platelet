import {createRequestActions, createRequestFunctions} from "../reduxActionsFactory";

export const getUserStatisticsPrefix = "GET_USER_STATISTICS";
export const getUserStatisticsActions = createRequestActions(getUserStatisticsPrefix);
export const {getUserStatisticsSuccess, getUserStatisticsFailure} = createRequestFunctions(getUserStatisticsActions);

export function getUserStatisticsRequest(userUUID, role, startDateTime, endDateTime) {
    return { type: getUserStatisticsActions.request, userUUID, role, startDateTime, endDateTime }
}
