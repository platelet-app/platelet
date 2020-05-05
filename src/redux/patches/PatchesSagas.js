import {call, put, takeLatest, select} from 'redux-saga/effects'
import {
    GET_AVAILABLE_PATCHES_REQUEST,
    getAvailablePatchesSuccess,
} from "./PatchesActions"

import { getApiControl } from "../Api";
import {getAvailableLocationsFailure} from "../locations/LocationsActions";

export function* getAvailablePatches() {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.patches.getAvailablePatches]);
        yield put(getAvailablePatchesSuccess(result))
    } catch(error) {
        yield put(getAvailableLocationsFailure(error))
    }
}

export function* watchGetAvailablePatches() {
    yield takeLatest(GET_AVAILABLE_PATCHES_REQUEST, getAvailablePatches)
}
