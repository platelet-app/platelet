import {call, put, takeLatest, select} from 'redux-saga/effects'
import {
    getAvailablePatchesActions,
    getAvailablePatchesSuccess,
} from "./PatchesActions"

import { getApiControl } from "../Selectors";
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
    yield takeLatest(getAvailablePatchesActions.request, getAvailablePatches)
}
