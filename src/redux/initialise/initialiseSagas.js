import { put, takeLatest, call, all } from "redux-saga/effects";
import { initialiseAwsDataStoreListener } from "../awsHubListener/awsHubListenerActions";
import { GET_WHOAMI_SUCCESS, getWhoamiRequest } from "../Actions";
import * as actions from "./initialiseActions";
import * as fakeData from "../fakeOfflineData.json";
import * as models from "../../models/index";
import { DataStore } from "@aws-amplify/datastore";
import _ from "lodash";
import path from "path";
import { priorities, tasksStatus, userRoles } from "../../apiConsts";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function generateTimes(previous = null, hours = 2) {
    let date;
    if (previous) date = new Date(previous);
    else date = new Date();
    if (!previous) date.setHours(date.getHours() - hours);
    date.setMinutes(date.getMinutes() + getRandomInt(20, 30));
    const timeOfCall = date.toISOString();
    date.setMinutes(date.getMinutes() + getRandomInt(20, 30));
    const timePickedUp = date.toISOString();
    date.setMinutes(date.getMinutes() + getRandomInt(20, 30));
    const timeDroppedOff = date.toISOString();

    return { timeDroppedOff, timePickedUp, timeOfCall };
}

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
        yield call(populateTasks);
    }
    yield put(getWhoamiRequest());
}

export function* watchInitialiseApp() {
    yield takeLatest(actions.INITIALISE_APP, initialiseApp);
}

function* initialiseAwsHub() {
    yield all([put(initialiseAwsDataStoreListener())]);
}

export function* watchInitialWhoamiCompleted() {
    yield takeLatest(GET_WHOAMI_SUCCESS, initialiseAwsHub);
}

async function populateFakeData() {
    if (fakeData.responsibilities) {
        const checker = await DataStore.query(models.RiderResponsibility);
        if (checker.length === 0) {
            for (const value of Object.values(fakeData.responsibilities)) {
                await DataStore.save(new models.RiderResponsibility(value));
            }
        }
    }
    if (fakeData.users) {
        const profilePicsArray = _.shuffle(
            Object.entries(profilePictures).map(([key, value]) => ({
                key,
                value: value.default,
            }))
        );
        const checker = await DataStore.query(models.User);
        if (checker.length === 0) {
            const responsibilities = await DataStore.query(
                models.RiderResponsibility
            );
            for (const value of Object.values(fakeData.users)) {
                let userToSave = value;
                if (
                    value.username === "offline" &&
                    process.env.REACT_APP_DEMO_MODE === "true"
                ) {
                    userToSave = {
                        ...value,
                        name: "Demo User",
                        userRiderResponsibilityId:
                            _.sample(responsibilities).id || null,
                        displayName: "Demo User",
                        roles: [
                            userRoles.rider,
                            userRoles.coordinator,
                            userRoles.user,
                        ],
                    };
                }
                const profilePicture = profilePicsArray.pop();
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
                        riderResponsibility: _.sample(responsibilities) || null,
                        profilePictureURL: profilePicURL,
                        profilePictureThumbnailURL: thumbnail,
                        contact: addressContact,
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
    if (fakeData.locations) {
        const checker = await DataStore.query(models.Location);
        if (checker.length === 0) {
            for (const value of Object.values(fakeData.locations)) {
                const { address, ...rest } = value;
                const contact = await DataStore.save(
                    new models.AddressAndContactDetails({ ...address })
                );
                await DataStore.save(
                    new models.Location({
                        contact,
                        ...rest,
                        ...address,
                    })
                );
            }
        }
    }
}

async function populateTasks(whoamiId) {
    const whoamiFind = await DataStore.query(models.User, (u) =>
        u.username("eq", "offline")
    );
    const availableDeliverables = await DataStore.query(models.DeliverableType);
    const availableRiders = (await DataStore.query(models.User)).filter(
        (u) => u.roles && u.roles.includes(userRoles.rider)
    );
    const availableLocations = await DataStore.query(models.Location, (l) =>
        l.listed("eq", 1)
    );
    const whoami = whoamiFind[0];

    // tasksNew
    const tasksNewCheck = await DataStore.query(models.Task, (t) =>
        t.status("eq", tasksStatus.new)
    );
    if (tasksNewCheck.length === 0) {
        let timeOfCall = null;
        for (const i in _.range(2)) {
            const pickUpLocation = _.sample(availableLocations);
            const dropOffLocation = _.sample(
                availableLocations.filter((l) => l.id !== pickUpLocation.id)
            );
            timeOfCall = generateTimes(timeOfCall, 2).timeOfCall;
            const requesterContact = await DataStore.save(
                new models.AddressAndContactDetails({})
            );
            const priority = _.sample(priorities);
            const newTask = await DataStore.save(
                new models.Task({
                    status: tasksStatus.new,
                    priority,
                    timeOfCall,
                    pickUpLocation,
                    dropOffLocation,
                    requesterContact,
                    createdBy: whoami,
                })
            );
            await DataStore.save(
                new models.Deliverable({
                    deliverableType: _.sample(availableDeliverables),
                    count: getRandomInt(1, 4),
                    orderInGrid: 0,
                    task: newTask,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: newTask,
                    assignee: whoami,
                    role: userRoles.coordinator,
                })
            );
        }
    }
    // tasksCancelledRejected
    const tasksCancelledCheck = await DataStore.query(models.Task, (t) =>
        t.status("eq", tasksStatus.cancelled).status("eq", tasksStatus.rejected)
    );
    if (tasksCancelledCheck.length === 0) {
        for (const i in _.range(20)) {
            let timeOfCall = null;
            const pickUpLocation = _.sample(availableLocations);
            const dropOffLocation = _.sample(
                availableLocations.filter((l) => l.id !== pickUpLocation.id)
            );
            timeOfCall = generateTimes(timeOfCall, 3).timeOfCall;
            const requesterContact = await DataStore.save(
                new models.AddressAndContactDetails({})
            );
            const priority = _.sample(priorities);
            const newTask = await DataStore.save(
                new models.Task({
                    status:
                        i > 1 ? tasksStatus.rejected : tasksStatus.cancelled,
                    priority,
                    timeOfCall,
                    pickUpLocation,
                    dropOffLocation,
                    requesterContact,
                    createdBy: whoami,
                })
            );
            await DataStore.save(
                new models.Deliverable({
                    deliverableType: _.sample(availableDeliverables),
                    count: getRandomInt(1, 4),
                    orderInGrid: 0,
                    task: newTask,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: newTask,
                    assignee: whoami,
                    role: userRoles.coordinator,
                })
            );
        }
    }
    // tasksActive
    const tasksActiveCheck = await DataStore.query(models.Task, (task) =>
        task.status("eq", tasksStatus.active)
    );
    if (tasksActiveCheck.length === 0) {
        let timeOfCall = null;
        for (const i in _.range(20)) {
            timeOfCall = generateTimes(timeOfCall, 3).timeOfCall;
            const requesterContact = await DataStore.save(
                new models.AddressAndContactDetails({})
            );
            const rider = _.sample(availableRiders);
            const pickUpLocation = _.sample(availableLocations);
            const dropOffLocation = _.sample(
                availableLocations.filter((l) => l.id !== pickUpLocation.id)
            );
            const priority = _.sample(priorities);
            const newTask = await DataStore.save(
                new models.Task({
                    status: tasksStatus.active,
                    priority,
                    timeOfCall,
                    pickUpLocation,
                    dropOffLocation,
                    riderResponsibility: rider.riderResponsibility,
                    requesterContact,
                    createdBy: whoami,
                })
            );
            await DataStore.save(
                new models.Deliverable({
                    deliverableType: _.sample(availableDeliverables),
                    count: getRandomInt(1, 4),
                    orderInGrid: 0,
                    task: newTask,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: newTask,
                    assignee: whoami,
                    role: userRoles.coordinator,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: newTask,
                    assignee: rider,
                    role: userRoles.rider,
                })
            );
        }
    }
    // tasksPickedUp
    const tasksPickedUpCheck = await DataStore.query(models.Task, (task) =>
        task.status("eq", tasksStatus.pickedUp)
    );
    if (tasksPickedUpCheck.length === 0) {
        let timeOfCall = null;
        for (const i in _.range(10)) {
            const times = generateTimes(timeOfCall, 3);
            timeOfCall = times.timeOfCall;
            const requesterContact = await DataStore.save(
                new models.AddressAndContactDetails({})
            );
            const rider = _.sample(availableRiders);
            const pickUpLocation = _.sample(availableLocations);
            const dropOffLocation = _.sample(
                availableLocations.filter((l) => l.id !== pickUpLocation.id)
            );
            const priority = _.sample(priorities);
            const newTask = await DataStore.save(
                new models.Task({
                    status: tasksStatus.pickedUp,
                    priority,
                    timeOfCall,
                    pickUpLocation,
                    timePickedUp: times.timePickedUp,
                    dropOffLocation,
                    riderResponsibility: rider.riderResponsibility,
                    requesterContact,
                    createdBy: whoami,
                })
            );
            await DataStore.save(
                new models.Deliverable({
                    deliverableType: _.sample(availableDeliverables),
                    count: getRandomInt(1, 4),
                    orderInGrid: 0,
                    task: newTask,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: newTask,
                    assignee: whoami,
                    role: userRoles.coordinator,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: newTask,
                    assignee: rider,
                    role: userRoles.rider,
                })
            );
        }
    }
    // tasksDroppedOff
    const tasksDroppedOffCheck = await DataStore.query(models.Task, (task) =>
        task.status("eq", tasksStatus.droppedOff)
    );
    if (tasksDroppedOffCheck.length === 0) {
        let timeOfCall = null;
        for (const i in _.range(50)) {
            const times = generateTimes(timeOfCall, 10);
            timeOfCall = times.timeOfCall;
            const requesterContact = await DataStore.save(
                new models.AddressAndContactDetails({})
            );
            const rider = _.sample(availableRiders);
            const pickUpLocation = _.sample(availableLocations);
            const dropOffLocation = _.sample(
                availableLocations.filter((l) => l.id !== pickUpLocation.id)
            );
            const priority = _.sample(priorities);
            const newTask = await DataStore.save(
                new models.Task({
                    status: tasksStatus.droppedOff,
                    priority,
                    timeOfCall,
                    pickUpLocation,
                    timePickedUp: times.timePickedUp,
                    timeDroppedOff: times.timeDroppedOff,
                    dropOffLocation,
                    riderResponsibility: rider.riderResponsibility,
                    requesterContact,
                    createdBy: whoami,
                })
            );
            await DataStore.save(
                new models.Deliverable({
                    deliverableType: _.sample(availableDeliverables),
                    count: getRandomInt(1, 4),
                    orderInGrid: 0,
                    task: newTask,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: newTask,
                    assignee: whoami,
                    role: userRoles.coordinator,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: newTask,
                    assignee: rider,
                    role: userRoles.rider,
                })
            );
        }
    }
}
