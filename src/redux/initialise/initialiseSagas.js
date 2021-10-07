import { put, takeLatest, call, all } from "redux-saga/effects";
import { initialiseAwsDataStoreListener } from "../awsHubListener/awsHubListenerActions";
import { INITIALISE_APP } from "./initialiseActions";
import { GET_WHOAMI_SUCCESS, getWhoamiRequest } from "../Actions";
import * as fakeData from "../fakeOfflineData.json";
import * as models from "../../models/index";
import { DataStore } from "@aws-amplify/datastore";

function* initialiseApp() {
    yield put(getWhoamiRequest());
    if (
        process.env.REACT_APP_OFFLINE_ONLY === "true" &&
        process.env.REACT_APP_POPULATE_FAKE_DATA === "true"
    ) {
        if (fakeData.users) {
            const checker = yield call(
                [DataStore, DataStore.query],
                models.User
            );
            if (checker.length < 2) {
                for (const value of Object.values(fakeData.users)) {
                    let { address, dateOfBirth, ...rest } = value;
                    dateOfBirth = new Date().toISOString();
                    const addressContact = yield call(
                        [DataStore, DataStore.save],
                        new models.AddressAndContactDetails(address)
                    );
                    yield call(
                        [DataStore, DataStore.save],
                        new models.User({
                            ...rest,
                            dateOfBirth,
                            userContactId: addressContact.id,
                        })
                    );
                }
            }
        }
        if (fakeData.vehicles) {
            const checker = yield call(
                [DataStore, DataStore.query],
                models.Vehicle
            );
            if (checker.length === 0) {
                for (const value of Object.values(fakeData.vehicles)) {
                    let { dateOfManufacture, dateOfRegistration, ...rest } =
                        value;
                    dateOfRegistration = new Date().toISOString();
                    dateOfManufacture = new Date().toISOString();
                    yield call(
                        [DataStore, DataStore.save],
                        new models.Vehicle({
                            ...rest,
                            dateOfManufacture,
                            dateOfRegistration,
                        })
                    );
                }
            }
        }
        if (fakeData.deliverables) {
            const checker = yield call(
                [DataStore, DataStore.query],
                models.DeliverableType
            );
            if (checker.length === 0) {
                for (const value of Object.values(fakeData.deliverables)) {
                    yield call(
                        [DataStore, DataStore.save],
                        new models.DeliverableType(value)
                    );
                }
            }
        }
        if (fakeData.responsibilities) {
            const checker = yield call(
                [DataStore, DataStore.query],
                models.RiderResponsibility
            );
            if (checker.length === 0) {
                for (const value of Object.values(fakeData.responsibilities)) {
                    yield call(
                        [DataStore, DataStore.save],
                        new models.RiderResponsibility(value)
                    );
                }
            }
        }
        if (fakeData.locations) {
            const checker = yield call(
                [DataStore, DataStore.query],
                models.Location
            );
            if (checker.length === 0) {
                for (const value of Object.values(fakeData.locations)) {
                    const { address, ...rest } = value;
                    yield call(
                        [DataStore, DataStore.save],
                        new models.Location({
                            ...rest,
                            ...address,
                        })
                    );
                }
            }
        }
    }
}

export function* watchInitialiseApp() {
    yield takeLatest(INITIALISE_APP, initialiseApp);
}

function* getStaticData() {
    yield all([put(initialiseAwsDataStoreListener())]);
}

export function* watchInitialWhoamiCompleted() {
    yield takeLatest(GET_WHOAMI_SUCCESS, getStaticData);
}
