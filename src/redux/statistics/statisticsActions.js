export const GET_USER_STATISTICS_REQUEST = "GET_USER_STATISTICS_REQUEST";
export const GET_USER_STATISTICS_SUCCESS = "GET_USER_STATISTICS_SUCCESS";
export const GET_USER_STATISTICS_FAILURE = "GET_USER_STATISTICS_FAILURE";

export function getUserStatisticsRequest(userUUID, role, startDateTime, endDateTime) {
    return { type: GET_USER_STATISTICS_REQUEST, userUUID, role, startDateTime, endDateTime }
}

export function getUserStatisticsSuccess(data) {
    return { type: GET_USER_STATISTICS_SUCCESS, data }
}

export function getUserStatisticsFailure(error) {
    return { type: GET_USER_STATISTICS_FAILURE, error }
}
