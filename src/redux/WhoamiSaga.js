import { call, put, takeLatest } from "redux-saga/effects";
import {
    GET_WHOAMI_REQUEST,
    getWhoamiFailure,
    getWhoamiSuccess,
    REFRESH_WHOAMI_REQUEST,
} from "./Actions";
import API from "@aws-amplify/api";
import { Auth, DataStore } from "aws-amplify";
import * as models from "../models/index";
import * as queries from "../graphql/queries";
import { NotFound } from "http-errors";
import { userRoles } from "../apiConsts";

const fakeUser = {
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
    if (
        process.env.REACT_APP_DEMO_MODE === "true" ||
        process.env.REACT_APP_OFFLINE_ONLY === "true"
    ) {
        const existingUser = yield call(
            [DataStore, DataStore.query],
            models.User,
            (u) => u.username("eq", "offline")
        );
        if (existingUser.length === 0) {
            let userResult = fakeUser;
            if (process.env.REACT_APP_DEMO_MODE === "true") {
                userResult = {
                    ...fakeUser,
                    name: "Demo User",
                    displayName: "Demo User",
                    roles: [
                        userRoles.user,
                        userRoles.coordinator,
                        userRoles.user,
                    ],
                };
            }
            const userModel = yield new models.User(userResult);
            const newFakeUser = yield call(
                [DataStore, DataStore.save],
                userModel
            );
            yield put(getWhoamiSuccess(newFakeUser));
        } else {
            yield put(getWhoamiSuccess(existingUser[0]));
        }
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
