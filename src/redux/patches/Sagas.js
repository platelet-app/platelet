import { throttle, call, put, takeEvery , takeLatest, select} from 'redux-saga/effects'
import {
    GET_AVAILABLE_PATCHES_REQUEST,
    getAvailablePatchesSuccess,
} from "./Actions"

import { getApiControl } from "../Api";

export function* getAvailablePatches() {
    const api = yield select(getApiControl);
    const result = yield call([api, api.patches.getAvailablePatches]);
    yield put(getAvailablePatchesSuccess(result))
}

export function* watchGetAvailablePatches() {
    yield takeLatest(GET_AVAILABLE_PATCHES_REQUEST, getAvailablePatches)
}
