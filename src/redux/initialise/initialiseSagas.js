import { put, takeLatest, call, all } from "redux-saga/effects";
import { initialiseAwsDataStoreListener } from "../awsHubListener/awsHubListenerActions";
import { GET_WHOAMI_SUCCESS, getWhoamiRequest } from "../Actions";
import * as actions from "./initialiseActions";
import * as fakeData from "../fakeOfflineData.json";
import * as models from "../../models/index";
import { DataStore } from "@aws-amplify/datastore";
import _ from "lodash";
import path from "path";
import { userRoles } from "../../apiConsts";

function importAll(r) {
    let images = {};
    r.keys().forEach((item, index) => {
        images[item.replace("./", "")] = r(item);
    });
    return images;
}

const profilePictures = importAll(
    require.context("../../assets/profilePictures", false, /\.(png|jpe?g|svg)$/)
);
const profilePictureThumbnails = importAll(
    require.context(
        "../../assets/profilePictureThumbnails",
        false,
        /\.(png|jpe?g|svg)$/
    )
);

function* initialiseApp() {
    if (process.env.REACT_APP_DEMO_MODE === "true") {
        yield call([DataStore, DataStore.start]);
        yield call([DataStore, DataStore.stop]);
        yield call([DataStore, DataStore.clear]);
        yield call([DataStore, DataStore.start]);
    }
    if (
        process.env.REACT_APP_DEMO_MODE === "true" ||
        (process.env.REACT_APP_OFFLINE_ONLY === "true" &&
            process.env.REACT_APP_POPULATE_FAKE_DATA === "true")
    ) {
        yield call(populateFakeData);
    }
    yield put(getWhoamiRequest());
}

export function* watchInitialiseApp() {
    yield takeLatest(actions.INITIALISE_APP, initialiseApp);
}

function* getStaticData() {
    yield all([put(initialiseAwsDataStoreListener())]);
}

export function* watchInitialWhoamiCompleted() {
    yield takeLatest(GET_WHOAMI_SUCCESS, getStaticData);
}

async function populateFakeData() {
    if (fakeData.users) {
        const profilePicsArray = _.shuffle(
            Object.entries(profilePictures).map(([key, value]) => ({
                key,
                value: value.default,
            }))
        );
        const checker = await DataStore.query(models.User);
        if (checker.length === 0) {
            for (const value of Object.values(fakeData.users)) {
                let userToSave = value;
                if (
                    value.username === "offline" &&
                    process.env.REACT_APP_DEMO_MODE === "true"
                ) {
                    userToSave = {
                        ...value,
                        name: "Demo User",
                        displayName: "Demo User",
                        roles: [
                            userRoles.rider,
                            userRoles.coordinator,
                            userRoles.user,
                        ],
                    };
                }
                const profilePicture = profilePicsArray.pop();
                console.log(profilePicture, profilePicsArray);
                let thumbnail = null;
                let profilePicURL = null;
                if (profilePicture) {
                    profilePicURL = profilePicture.value;
                    const extension = path.extname(profilePicURL);
                    const baseName = path.basename(
                        profilePicture.key,
                        extension
                    );
                    const thumbnailGet =
                        profilePictureThumbnails[
                            `${baseName}_thumbnail${extension}`
                        ];

                    thumbnail = thumbnailGet ? thumbnailGet.default : "";
                }
                let { address, dateOfBirth, ...rest } = userToSave;
                dateOfBirth = new Date().toISOString();
                const addressContact = await DataStore.save(
                    new models.AddressAndContactDetails(address)
                );
                await DataStore.save(
                    new models.User({
                        ...rest,
                        dateOfBirth,
                        profilePictureURL: profilePicURL,
                        profilePictureThumbnailURL: thumbnail,
                        userContactId: addressContact.id,
                    })
                );
            }
        }
    }
    if (fakeData.vehicles) {
        const checker = await DataStore.query(models.Vehicle);
        if (checker.length === 0) {
            for (const value of Object.values(fakeData.vehicles)) {
                let { dateOfManufacture, dateOfRegistration, ...rest } = value;
                dateOfRegistration = new Date().toISOString();
                dateOfManufacture = new Date().toISOString();
                await DataStore.save(
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
        const checker = await DataStore.query(models.DeliverableType);
        if (checker.length === 0) {
            for (const value of Object.values(fakeData.deliverables)) {
                await DataStore.save(new models.DeliverableType(value));
            }
        }
    }
    if (fakeData.responsibilities) {
        const checker = await DataStore.query(models.RiderResponsibility);
        if (checker.length === 0) {
            for (const value of Object.values(fakeData.responsibilities)) {
                await DataStore.save(new models.RiderResponsibility(value));
            }
        }
    }
    if (fakeData.locations) {
        const checker = await DataStore.query(models.Location);
        if (checker.length === 0) {
            for (const value of Object.values(fakeData.locations)) {
                const { address, ...rest } = value;
                await DataStore.save(
                    new models.Location({
                        ...rest,
                        ...address,
                    })
                );
            }
        }
    }
}
