import {
    call,
    put,
    takeEvery,
    takeLatest,
    select,
    debounce,
} from "redux-saga/effects";
import * as actions from "./DeliverablesActions";

import {
    availableDeliverablesSelector,
    deliverablesSelector,
    getApiControl,
} from "../Selectors";
import { convertListDataToObjects } from "../redux_utilities";
import { sortByCreatedTime } from "../../utilities";

export function* postNewDeliverable(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call(
            [api, api.deliverables.createDeliverable],
            action.data.payload
        );
        const timeCreated = new Date().toISOString();
        const deliverable = {
            ...action.data.payload,
            uuid: result.uuid,
            time_created: timeCreated,
        };
        yield put(actions.addDeliverableSuccess(deliverable));
        yield put(actions.setDeliverablesSorted());
    } catch (error) {
        yield put(actions.addDeliverableFailure(error));
    }
}

export function* watchPostNewDeliverable() {
    yield takeEvery(actions.addDeliverableActions.request, postNewDeliverable);
}

export function* deleteDeliverable(action) {
    try {
        const api = yield select(getApiControl);
        yield call(
            [api, api.deliverables.deleteDeliverable],
            action.data.deliverableUUID
        );
        yield put(
            actions.deleteDeliverableSuccess(action.data.deliverableUUID)
        );
        yield put(actions.setDeliverablesSorted());
    } catch (error) {
        yield put(actions.deleteDeliverableFailure(error));
    }
}

export function* watchDeleteDeliverable() {
    yield takeEvery(
        actions.deleteDeliverableActions.request,
        deleteDeliverable
    );
}

export function* updateDeliverable(action) {
    try {
        const api = yield select(getApiControl);
        yield call(
            [api, api.deliverables.updateDeliverable],
            action.data.deliverableUUID,
            action.data.payload
        );
        yield put(actions.updateDeliverableSuccess(action.data));
        yield put(actions.setDeliverablesSorted());
    } catch (error) {
        yield put(actions.updateDeliverableFailure(error));
    }
}

export function* watchUpdateDeliverable() {
    yield takeEvery(
        actions.updateDeliverableActions.request,
        updateDeliverable
    );
}

export function* updateDeliverableCount(action) {
    try {
        const api = yield select(getApiControl);
        yield call(
            [api, api.deliverables.updateDeliverable],
            action.data.deliverableUUID,
            action.data.payload
        );
        yield put(actions.updateDeliverableCountSuccess(action.data));
    } catch (error) {
        yield put(actions.updateDeliverableCountFailure(error));
    }
}

export function* watchUpdateDeliverableCount() {
    yield debounce(
        300,
        actions.updateDeliverableCountActions.request,
        updateDeliverableCount
    );
}

export function* getDeliverables(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call(
            [api, api.deliverables.getDeliverables],
            action.data.parentUUID
        );
        const converted = yield convertListDataToObjects(result);
        yield put(actions.getDeliverablesSuccess(converted));
        yield put(actions.setDeliverablesSorted());
    } catch (error) {
        yield put(actions.getDeliverablesFailure(error));
    }
}

export function* watchGetDeliverables() {
    yield takeLatest(actions.getDeliverablesActions.request, getDeliverables);
}

export function* getAvailableDeliverables() {
    try {
        const api = yield select(getApiControl);
        const result = yield call([
            api,
            api.deliverables.getAvailableDeliverables,
        ]);
        yield put(actions.getAvailableDeliverablesSuccess(result));
    } catch (error) {
        yield put(actions.getAvailableDeliverablesFailure(error));
    }
}

export function* watchGetAvailableDeliverables() {
    yield takeLatest(
        actions.getAvailableDeliverablesActions.request,
        getAvailableDeliverables
    );
}

export function* setDeliverablesSorted() {
    const availableDeliverables = yield select(availableDeliverablesSelector);
    const deliverables = yield select(deliverablesSelector);
    const result = {
        deliverables: [],
        defaults: [],
    };
    for (const i of Object.values(availableDeliverables)) {
        const value = Object.values(deliverables).find(
            (d) => d.type_id === i.id
        );
        if (value) {
            result.deliverables.push(value);
        } else {
            result.defaults.push(i);
        }
    }
    result["deliverables"] = sortByCreatedTime(
        result["deliverables"],
        "oldest"
    );
    console.log(result["deliverables"]);
    yield put(actions.deliverablesSorted(result));
}

export function* watchSetDeliverablesSorted() {
    yield takeEvery(actions.SET_DELIVERABLES_SORTED, setDeliverablesSorted);
}

