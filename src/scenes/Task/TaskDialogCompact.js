import React, { useEffect, useRef, useState } from "react";
import StatusBar from "./components/StatusBar";
import Dialog from "@material-ui/core/Dialog";
import { useDispatch, useSelector } from "react-redux";
import {
    convertListDataToObject,
    decodeUUID,
    determineTaskStatus,
} from "../../utilities";

import FormSkeleton from "../../SharedLoadingSkeletons/FormSkeleton";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import NotFound from "../../ErrorComponents/NotFound";
import Typography from "@material-ui/core/Typography";
import TaskOverview from "./components/TaskOverview";
import CommentsSideBar from "./components/CommentsSideBar";
import { Button, Hidden } from "@material-ui/core";
import CommentsSection from "../Comments/CommentsSection";
import * as models from "../../models/index";
import { DataStore } from "aws-amplify";
import { dataStoreReadyStatusSelector } from "../../redux/Selectors";
import _ from "lodash";
import { tasksStatus } from "../../apiConsts";
import {
    displayErrorNotification,
    displayWarningNotification,
} from "../../redux/notifications/NotificationsActions";

const drawerWidth = 500;
const drawerWidthMd = 400;

const useStyles = makeStyles((theme) => ({
    paper: {
        boxShadow: "none",
        background: theme.palette.background.default,
        padding: 0,
        minHeight: 300,
    },
    root: {
        flexGrow: 1,
        alignItems: "center",
        justify: "center",
    },
    overview: {
        marginRight: drawerWidth,
        [theme.breakpoints.down("md")]: {
            marginRight: drawerWidthMd,
        },
        [theme.breakpoints.down("sm")]: {
            marginRight: 0,
        },
    },
}));

const DialogWrapper = (props) => {
    const theme = useTheme();
    const { handleClose } = props;
    const classes = useStyles();
    return (
        <Dialog
            onKeyUp={(e) => {
                if (e.key === "Escape") handleClose(e);
            }}
            className={classes.root}
            disableEscapeKeyDown
            fullScreen={true}
            maxWidth={"md"}
            fullWidth={true}
            open={true}
            onClose={handleClose}
            PaperProps={{
                className: classes.paper,
            }}
            aria-labelledby="task-dialog"
        >
            {props.children}
        </Dialog>
    );
};

const initialLocationState = {
    address: null,
    contact: { name: null, telephone_number: null },
    protected: false,
    listed: false,
};
const initialState = {
    id: null,
    reference: "",
    etag: "",
    author: null,
    author_uuid: null,
    pickUpLocation: null,
    dropOffLocation: null,
    patch: null,
    requesterContact: {
        name: null,
        telephoneNumber: null,
    },
    priority: null,
    timeOfCall: null,
    deliverables: null,
    comments: null,
    links: null,
    timePickedUp: null,
    timeDroppedOff: null,
    rider: null,
    assignedRiders: [],
    assignedCoordinators: [],
    timeCancelled: null,
    timeRejected: null,
    createdAt: null,
    updatedAt: null,
    orderInRelay: 0,
    assignedRidersDisplayString: "",
    assignedCoordinatorsDisplayString: "",
};

function TaskDialogCompact(props) {
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [notFound, setNotFound] = useState(false);
    const classes = useStyles();
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.down("md"));
    const [isFetching, setIsFetching] = useState(false);
    const [task, setTask] = useState(initialState);
    // taskDeliverablesRef exists to keep track of which deliverables
    // have been added or removed without resending data to DeliverableGridSelect props by updating state
    const taskDeliverablesRef = useRef({});
    taskDeliverablesRef.current = task.deliverables;
    const taskRef = useRef();
    taskRef.current = task;
    const taskObserver = useRef({ unsubscribe: () => {} });
    const deliverablesObserver = useRef({ unsubscribe: () => {} });
    const dispatch = useDispatch();

    const taskUUID = props.taskId;

    async function getTask() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            try {
                const taskData = await DataStore.query(models.Task, taskUUID);
                if (taskData) {
                    const deliverables = await DataStore.query(
                        models.Deliverable,
                        (t) => t.taskDeliverablesId("eq", taskUUID)
                    );
                    setTask({
                        ...taskData,
                        deliverables: deliverables
                            ? convertListDataToObject(deliverables)
                            : {},
                    });
                    taskObserver.current.unsubscribe();
                    taskObserver.current = DataStore.observe(
                        models.Task,
                        taskUUID
                    ).subscribe((observeResult) => {
                        const task = observeResult.element;
                        setTask((prevState) => ({ ...prevState, ...task }));
                    });

                    if (deliverables) {
                        deliverablesObserver.current.unsubscribe();
                        deliverablesObserver.current = DataStore.observe(
                            models.Deliverable,
                            (t) => t.taskDeliverablesId("eq", taskUUID)
                        ).subscribe((observeResult) => {
                            const deliverable = observeResult.element;
                            if (observeResult.opType === "INSERT") {
                                setTask((prevState) => ({
                                    ...prevState,
                                    deliverables: {
                                        ...prevState.deliverables,
                                        [deliverable.id]: deliverable,
                                    },
                                }));
                            } else if (observeResult.opType === "UPDATE") {
                                setTask((prevState) => ({
                                    ...prevState,
                                    deliverables: {
                                        ...prevState.deliverables,
                                        [deliverable.id]: {
                                            ...prevState.deliverables[
                                                deliverable.id
                                            ],
                                            ...deliverables,
                                        },
                                    },
                                }));
                            }
                            if (observeResult.opType === "DELETE") {
                                setTask((prevState) => ({
                                    ...prevState,
                                    deliverables: _.omit(
                                        prevState.deliverables,
                                        deliverable.id
                                    ),
                                }));
                            }
                        });
                    }
                } else {
                    setNotFound(true);
                }
                setIsFetching(false);
            } catch (error) {
                setIsFetching(false);
                console.error("Request failed", error);
            }
        }
    }
    useEffect(() => getTask(), [dataStoreReadyStatus, props.taskId]);

    useEffect(() => () => taskObserver.current.unsubscribe(), []);
    useEffect(() => () => deliverablesObserver.current.unsubscribe(), []);

    async function setTimeDroppedOff(value) {
        const result = await DataStore.query(models.Task, taskUUID);
        if (result) {
            const status = determineTaskStatus({
                ...result,
                timeDroppedOff: value,
            });
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated.timeDroppedOff = value;
                    updated.status = status;
                })
            );
            taskRef.current = { ...taskRef.current, timeDroppedOff: value };
            setTask((prevState) => ({
                ...prevState,
                status,
                timeDroppedOff: value,
            }));
        }
    }

    async function setTimePickedUp(value) {
        const result = await DataStore.query(models.Task, taskUUID);
        if (result) {
            const status = determineTaskStatus({
                ...result,
                timePickedUp: value,
            });
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated.timePickedUp = value;
                    updated.status = status;
                })
            );
            taskRef.current = { ...taskRef.current, timePickedUp: value };
            setTask((prevState) => ({
                ...prevState,
                status,
                timePickedUp: value,
            }));
        }
    }

    async function setTimeCancelled(value) {
        const result = await DataStore.query(models.Task, taskUUID);
        if (result) {
            let status;
            if (value) {
                status = tasksStatus.cancelled;
            } else {
                status = determineTaskStatus({
                    ...result,
                    timeCancelled: value,
                });
            }
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated.timeCancelled = value;
                    updated.status = status;
                })
            );
            taskRef.current = { ...taskRef.current, timeCancelled: value };
            setTask((prevState) => ({
                ...prevState,
                status,
                timeCancelled: value,
            }));
        }
    }

    async function setTimeRejected(value) {
        const result = await DataStore.query(models.Task, taskUUID);
        if (result) {
            let status;
            if (value) {
                status = tasksStatus.rejected;
            } else {
                status = determineTaskStatus({
                    ...result,
                    timeRejected: value,
                });
            }
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated.timeRejected = value;
                    updated.status = status;
                })
            );
            taskRef.current = { ...taskRef.current, timeRejected: value };
            setTask((prevState) => ({
                ...prevState,
                status,
                timeRejected: value,
            }));
        }
    }

    async function selectPriority(priority) {
        const result = await DataStore.query(models.Task, taskUUID);
        if (result) {
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated.priority = priority;
                })
            );
        }
    }

    async function updateRequesterContact(requesterValue) {
        const result = await DataStore.query(models.Task, taskUUID);
        if (result && result.requesterContact) {
            await DataStore.save(
                models.AddressAndContactDetails.copyOf(
                    result.requesterContact,
                    (updated) => {
                        for (const [key, value] of Object.entries(
                            requesterValue
                        )) {
                            updated[key] = value;
                        }
                    }
                )
            );
        }
        taskRef.current = {
            ...taskRef.current,
            requesterContact: {
                ...taskRef.current.requesterContact,
                ...requesterValue,
            },
        };
    }
    async function editDropOffPreset(currentState) {
        const result = await DataStore.query(models.Task, taskUUID);
        const {
            createdAt,
            updatedAt,
            id,
            name,
            contact,
            _version,
            _lastChangedAt,
            _deleted,
            ...rest
        } = currentState;
        if (result && rest) {
            const newContact = await DataStore.save(
                new models.AddressAndContactDetails(contact)
            );
            const newLocation = await DataStore.save(
                new models.Location({
                    ...rest,
                    listed: 0,
                    locationContactId: newContact.id,
                    name: `Copy of ${name}`,
                })
            );
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated.dropOffLocationId = newLocation.id;
                })
            );
            setTask((prevState) => ({
                ...prevState,
                dropOffLocation: newLocation,
            }));
        }
    }

    async function editPickUpPreset(currentState) {
        const result = await DataStore.query(models.Task, taskUUID);
        const {
            createdAt,
            updatedAt,
            id,
            name,
            contact,
            _version,
            _lastChangedAt,
            _deleted,
            ...rest
        } = currentState;
        if (result && rest) {
            const newContact = await DataStore.save(
                new models.AddressAndContactDetails(contact)
            );
            const newLocation = await DataStore.save(
                new models.Location({
                    ...rest,
                    listed: 0,
                    locationContactId: newContact.id,
                    name: `Copy of ${name}`,
                })
            );
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated.pickUpLocationId = newLocation.id;
                })
            );
            setTask((prevState) => ({
                ...prevState,
                pickUpLocation: newLocation,
            }));
        }
    }
    async function selectPickUpPreset(location) {
        try {
            const result = await DataStore.query(models.Task, taskUUID);
            if (result && location) {
                await DataStore.save(
                    models.Task.copyOf(result, (updated) => {
                        updated.pickUpLocationId = location.id;
                    })
                );
            }
        } catch (e) {
            console.error("dumb error");
            console.error(e);
            setTask((prevState) => ({
                ...prevState,
                pickUpLocation: location,
            }));
        }
    }

    async function clearPickUpLocation() {
        const result = await DataStore.query(models.Task, taskUUID);
        if (result) {
            try {
                await DataStore.save(
                    models.Task.copyOf(result, (updated) => {
                        updated.pickUpLocationId = null;
                    })
                );
            } catch (e) {
                console.error("dumb error");
                console.error(e);
                setTask((prevState) => ({
                    ...prevState,
                    pickUpLocation: null,
                }));
            }
        }
    }

    async function selectDropOffPreset(location) {
        try {
            const result = await DataStore.query(models.Task, taskUUID);
            if (result && location) {
                await DataStore.save(
                    models.Task.copyOf(result, (updated) => {
                        updated.dropOffLocationId = location.id;
                    })
                );
            }
        } catch (e) {
            console.error("dumb error");
            console.error(e);
            setTask((prevState) => ({
                ...prevState,
                dropOffLocation: location,
            }));
        }
    }

    async function deleteDeliverable(deliverableTypeId) {
        // receive DeliverableTypeId only from selector component
        // check if one of this DeliverableType has already been saved so we can delete it
        const existing = Object.values(taskDeliverablesRef.current).find(
            (d) => d.deliverableTypeDeliverableTypeId === deliverableTypeId
        );
        if (existing) {
            const existingDeliverable = await DataStore.query(
                models.Deliverable,
                existing.id
            );
            if (existingDeliverable)
                await DataStore.delete(existingDeliverable);
            // remove it from the tracking reference
            taskDeliverablesRef.current = _.omit(
                taskDeliverablesRef.current,
                existing.id
            );
        }
    }

    async function clearDropOffLocation() {
        try {
            const result = await DataStore.query(models.Task, taskUUID);
            if (result) {
                await DataStore.save(
                    models.Task.copyOf(result, (updated) => {
                        updated.dropOffLocationId = null;
                    })
                );
            }
        } catch (e) {
            console.error("dumb error");
            console.error(e);
            setTask((prevState) => ({
                ...prevState,
                dropOffLocation: null,
            }));
        }
    }

    async function changeLocationDetails(locationId, values, key) {
        // display error if some location that doesn't exist is attempted to be created
        if (!["dropOffLocation", "pickUpLocation"].includes(key)) {
            dispatch(
                displayErrorNotification(
                    "An error has occurred while updating the location"
                )
            );
            return;
        }

        //separate any contact details with location details
        const { contact, ...rest } = values;
        let locationResult;
        let contactResult;
        // if we are updating an existing location
        if (locationId) {
            const existingLocation = await DataStore.query(
                models.Location,
                locationId
            );
            if (!!existingLocation.listed) {
                // can't edit a location if it's from the directory
                dispatch(
                    displayWarningNotification(
                        "You can't edit listed locations in this way."
                    )
                );
                return;
            }
            // if rest is empty, only contact data was sent
            if (!_.isEmpty(rest) && existingLocation) {
                // update the location and get the updated version back to locationResult
                locationResult = await DataStore.save(
                    models.Location.copyOf(existingLocation, (updated) => {
                        for (const [key, v] of Object.entries(rest)) {
                            updated[key] = v;
                        }
                    })
                );
            }
            // if contact is undefined, no contact data was sent
            if (contact && existingLocation) {
                // get the existing contact model
                const existingContact = await DataStore.query(
                    models.AddressAndContactDetails,
                    existingLocation.contact.id
                );
                // update the existing contact model and save the final version to contactResult
                contactResult = await DataStore.save(
                    models.AddressAndContactDetails.copyOf(
                        existingContact,
                        (updated) => {
                            for (const [key, v] of Object.entries(contact)) {
                                updated[key] = v;
                            }
                        }
                    )
                );
            }
        } else {
            // if no location exists yet
            // create a contact model
            contactResult = await DataStore.save(
                new models.AddressAndContactDetails(contact || {})
            );
            // create a new location and link it to the new contact model
            locationResult = await DataStore.save(
                new models.Location({
                    ...rest,
                    locationContactId: contactResult.id,
                })
            );
            // find the existing task
            const existingTask = await DataStore.query(models.Task, taskUUID);
            if (existingTask) {
                // find the id that we want to link to the new location
                const idName =
                    key === "dropOffLocation"
                        ? "dropOffLocationId"
                        : "pickUpLocationId";
                try {
                    await DataStore.save(
                        models.Task.copyOf(existingTask, (updated) => {
                            updated[idName] = locationResult.id;
                        })
                    );
                } catch (e) {
                    console.error("dumb error");
                    console.error(e);
                }
            }
        }

        // update local state, but find data from prevState to fill contactResult or locationResult if they are undefined
        setTask((prevState) => {
            if (!contactResult)
                contactResult = prevState[key] ? prevState[key].contact : null;
            if (!locationResult) locationResult = prevState[key];
            return {
                ...prevState,
                [key]: {
                    ...locationResult,
                    contact: contactResult,
                },
            };
        });
    }

    async function updateDeliverables(value) {
        // receive DeliverableType from selector component
        // check if one of this DeliverableType has already been saved
        const existing = Object.values(taskDeliverablesRef.current).find(
            (d) => d.deliverableTypeDeliverableTypeId === value.id
        );
        if (existing) {
            const existingDeliverable = await DataStore.query(
                models.Deliverable,
                existing.id
            );
            if (existingDeliverable) {
                await DataStore.save(
                    models.Deliverable.copyOf(
                        existingDeliverable,
                        (updated) => {
                            for (const [key, v] of Object.entries(value)) {
                                updated[key] = v;
                            }
                        }
                    )
                );
            }
        } else {
            const { id, ...rest } = value;
            const newDeliverable = await DataStore.save(
                new models.Deliverable({
                    taskDeliverablesId: taskUUID,
                    deliverableTypeDeliverableTypeId: id,
                    ...rest,
                })
            );
            // add it to the tracking reference
            taskDeliverablesRef.current[newDeliverable.id] = newDeliverable;
        }
    }

    const statusBar =
        !task || notFound ? (
            <Button onClick={props.onClose}>Close</Button>
        ) : (
            <StatusBar
                handleClose={props.onClose}
                status={task.status}
                taskUUID={taskUUID}
            />
        );

    if (isFetching) {
        return (
            <DialogWrapper handleClose={props.onClose}>
                <FormSkeleton />
            </DialogWrapper>
        );
    } else if (notFound) {
        return (
            <DialogWrapper handleClose={props.onClose}>
                {statusBar}
                <NotFound>
                    <Typography>
                        Task with UUID {taskUUID} not found.
                    </Typography>
                </NotFound>
            </DialogWrapper>
        );
    } else {
        return (
            <DialogWrapper handleClose={props.onClose}>
                <div className={classes.overview}>
                    {statusBar}
                    <TaskOverview
                        task={task}
                        taskUUID={taskUUID}
                        onSelectPriority={selectPriority}
                        onSelectPickUpPreset={selectPickUpPreset}
                        onEditPickUpPreset={editPickUpPreset}
                        onClearPickUpLocation={clearPickUpLocation}
                        onChangePickUpLocation={(locationId, values) =>
                            changeLocationDetails(
                                locationId,
                                values,
                                "pickUpLocation"
                            )
                        }
                        onSelectDropOffPreset={selectDropOffPreset}
                        onEditDropOffPreset={editDropOffPreset}
                        onClearDropOffLocation={clearDropOffLocation}
                        onChangeDropOffLocation={(locationId, values) =>
                            changeLocationDetails(
                                locationId,
                                values,
                                "dropOffLocation"
                            )
                        }
                        onChangeTimePickedUp={setTimePickedUp}
                        onChangeTimeDroppedOff={setTimeDroppedOff}
                        onChangeTimeCancelled={setTimeCancelled}
                        onChangeTimeRejected={setTimeRejected}
                        onChangeRequesterContact={updateRequesterContact}
                        onUpdateDeliverable={updateDeliverables}
                        onDeleteDeliverable={deleteDeliverable}
                    />
                </div>
                <Hidden smDown>
                    <CommentsSideBar
                        width={isMd ? drawerWidthMd : drawerWidth}
                        parentUUID={taskUUID}
                    />
                </Hidden>
                <Hidden mdUp>
                    <CommentsSection parentUUID={taskUUID} />
                </Hidden>
            </DialogWrapper>
        );
    }
}

export default TaskDialogCompact;
