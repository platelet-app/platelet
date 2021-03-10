import {takeEvery, race, take, put, select, delay} from 'redux-saga/effects'
import {
    refreshTokenRequest,
    logoutUser, refreshUserTokenActions
} from './LoginActions'
import {displayErrorNotification} from "../notifications/NotificationsActions";
import {refreshUserTokenPrefix, loginUserPrefix} from "./LoginActions";

const ignoreActionTypes = [refreshUserTokenPrefix, "SERVER_SETTINGS", loginUserPrefix]

function monitorableAction(action) {
    return action.type.includes("REQUEST") && !action.type.includes("SOCKET") &&
        ignoreActionTypes.every(fragment => !action.type.includes(fragment))
}

function identifyAction(action) {
    return action.type.split('_').slice(0, -1).join('_')
}

function getSuccessType(action) {
    return `${identifyAction(action)}_SUCCESS`
}

function getFailType(action) {
    return `${identifyAction(action)}_FAILURE`
}

function* monitor(monitoredAction) {
    //console.log('started monitoring', monitoredAction.type)
    const {fail} = yield race({
        success: take(getSuccessType(monitoredAction)),
        fail: take(getFailType(monitoredAction)),
    })
    let retries = 0;
    if (monitoredAction.meta && monitoredAction.meta.retries)
        retries = monitoredAction.meta.retries;
    if (fail && monitoredAction.meta && monitoredAction.meta.retries > 2) {
        yield put(displayErrorNotification("Failed multiple times to refresh authentication. Data may not be saved!"))
        return
    }
    if (fail && fail.error && fail.error.status_code === 425) {
        console.log("token is already refreshed, trying action again")
        yield put({...monitoredAction, meta: {retries: retries++}})
    } else if (fail && fail.error && fail.error.status_code === 401) {
        console.log('detected 401, refreshing token')
        yield put(refreshTokenRequest())

        const {success} = yield race({
            success: take(refreshUserTokenActions.success),
            fail: take(refreshUserTokenActions.failure),
        })

        if (success) {
            console.log('token refreshed, retrying', monitoredAction.type)
            yield put({...monitoredAction, meta: {retries: retries++}})
        } else {
            console.log('token refresh failed, logging out user')
            yield put(logoutUser())
        }
    }

    //console.log('monitoring', monitoredAction.type, 'finished')
}

export default function* authenticationMonitor() {
    yield takeEvery(monitorableAction, monitor)
}
