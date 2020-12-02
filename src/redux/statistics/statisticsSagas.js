import {call, put, select, takeEvery} from "redux-saga/effects";
import {GET_USER_STATISTICS_REQUEST, getUserStatisticsFailure, getUserStatisticsSuccess} from "./statisticsActions";
import {getApiControl} from "../Api";

function* getUserStatistics(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.statistics.getUserStatistics], action.userUUID, action.startDateTime, action.endDateTime, action.role);
        yield put(getUserStatisticsSuccess(result))
    } catch(error) {
        yield put(getUserStatisticsFailure(error))

    }

}

export function* watchGetUserStatistics() {
    yield takeEvery(GET_USER_STATISTICS_REQUEST, getUserStatistics);
}

