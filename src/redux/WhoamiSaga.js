import {
    throttle,
    call,
    put,
    takeEvery,
    takeLatest,
    select,
} from "redux-saga/effects";
import {
    GET_WHOAMI_REQUEST,
    getWhoamiFailure,
    getWhoamiSuccess,
    REFRESH_WHOAMI_REQUEST,
} from "./Actions";
import { getApiControl } from "./Selectors";
import API from "@aws-amplify/api";
import { Auth } from "aws-amplify";
import * as queries from "../graphql/queries";
import { NotFound } from "http-errors";

function* agetWhoami() {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.users.whoami]);
        yield put(getWhoamiSuccess(result));
    } catch (error) {
        yield put(getWhoamiFailure(error));
    }
}

function* getWhoami() {
    try {
        const loggedInUser = yield call([Auth, Auth.currentAuthenticatedUser]);
        if (loggedInUser) {
            const result = yield call([API, API.graphql], {
                query: queries.getUser,
                variables: { id: loggedInUser.attributes.sub },
            });
            yield put(getWhoamiSuccess(result.data.getUser));
            console.log(result);
        } else {
            yield put(
                getWhoamiFailure(new NotFound("Could not find logged in user"))
            );
        }
    } catch (error) {
        console.log(error);
        yield put(getWhoamiFailure(error));
    }
}

export function* watchGetWhoami() {
    yield takeLatest(GET_WHOAMI_REQUEST, getWhoami);
}

export function* watchRefreshWhoami() {
    yield takeLatest(REFRESH_WHOAMI_REQUEST, getWhoami);
}
