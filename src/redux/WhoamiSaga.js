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
import { Auth, DataStore } from "aws-amplify";
import * as models from "../models/index";
import * as queries from "../graphql/queries";
import { NotFound } from "http-errors";
import { userRoles } from "../apiConsts";

function* agetWhoami() {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.users.whoami]);
        yield put(getWhoamiSuccess(result));
    } catch (error) {
        yield put(getWhoamiFailure(error));
    }
}

const fakeUser = {
    id: "cc18f261-f764-4cdf-a4f5-4883cf6b236d",
    username: "offline",
    displayName: "Offline User",
    roles: Object.values(userRoles),
    name: "Offline User",
    dateOfBirth: null,
    profilePictureURL: null,
    profilePictureThumbnailURL: null,
    active: 1,
};

function* getWhoami() {
    if (process.env.REACT_APP_OFFLINE_ONLY === "true") {
        const userModel = yield new models.User(fakeUser);
        const newFakeUser = yield call([DataStore, DataStore.save], userModel);
        yield put(getWhoamiSuccess(newFakeUser));
    } else {
        try {
            const loggedInUser = yield call([
                Auth,
                Auth.currentAuthenticatedUser,
            ]);
            let result;
            if (loggedInUser) {
                result = yield call(
                    [DataStore, DataStore.query],
                    models.User,
                    loggedInUser.attributes.sub
                );
                if (!result) {
                    result = yield call([API, API.graphql], {
                        query: queries.getUser,
                        variables: { id: loggedInUser.attributes.sub },
                    });
                    yield put(getWhoamiSuccess(result.data.getUser));
                } else {
                    yield put(getWhoamiSuccess(result));
                }
            } else {
                yield put(
                    getWhoamiFailure(
                        new NotFound("Could not find logged in user")
                    )
                );
            }
        } catch (error) {
            console.log(error);
            yield put(getWhoamiFailure(error));
        }
    }
}

export function* watchGetWhoami() {
    yield takeLatest(GET_WHOAMI_REQUEST, getWhoami);
}

export function* watchRefreshWhoami() {
    yield takeLatest(REFRESH_WHOAMI_REQUEST, getWhoami);
}
