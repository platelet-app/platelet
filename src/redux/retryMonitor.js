import {put, takeEvery} from "redux-saga/effects";
const ignoreActionTypes = [];

function identifyAction(action) {
    return action.type.split('_').slice(0, -1).join('_')
}

function getFailType(action) {
    return `${identifyAction(action)}_FAILURE`
}


function monitorableAction(action) {
    return action.type.includes("REQUEST") && !action.type.includes("SOCKET") &&
        ignoreActionTypes.every(fragment => !action.type.includes(fragment))
}

function* monitor(monitoredAction) {
    if (monitoredAction.meta && monitoredAction.meta.retries > 0) {
        console.log("retry failed, bailing")
    }
    yield put({...monitoredAction, meta: {retries: 0}})
}
export default function* retryMonitor() {
    yield takeEvery(monitorableAction, monitor)
}
