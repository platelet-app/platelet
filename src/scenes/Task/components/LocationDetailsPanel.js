import LocationDetailAndSelector from "./LocationDetailAndSelector";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Divider, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import { useDispatch, useSelector } from "react-redux";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import * as models from "../../../models/index";
import { API, DataStore, graphqlOperation } from "aws-amplify";
import _ from "lodash";
import { protectedFields } from "../../../apiConsts";
import {
    dataStoreModelSyncedStatusSelector,
    tenantIdSelector,
} from "../../../redux/Selectors";
import GetError from "../../../ErrorComponents/GetError";
import EditModeToggleButton from "../../../components/EditModeToggleButton";
import * as mutations from "../../../graphql/mutations";
import * as queries from "../../../graphql/queries";

function LocationDetailsPanel(props) {
    const classes = dialogCardStyles();
    const dispatch = useDispatch();
    // I have no idea why the imported selector is undefined here
    const tenantId = useSelector((state) => state.tenantId);
    const [state, setState] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [errorState, setErrorState] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const loadedOnce = useRef(false);
    const locationModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Location;
    const taskModelsSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Task;

    const taskObserver = useRef({ unsubscribe: () => {} });
    const locationObserver = useRef({ unsubscribe: () => {} });
    const editModeRef = useRef(false);
    editModeRef.current = editMode;

    const initialSetEdit = useRef(false);

    const errorMessage = "Sorry, an error occurred";

    async function getLocation() {
        if (!loadedOnce.current) setIsFetching(true);
        try {
            const task = await DataStore.query(models.Task, props.taskId);
            taskObserver.current.unsubscribe();
            taskObserver.current = DataStore.observe(
                models.Task,
                task.id
            ).subscribe(({ opType, element }) => {
                if (opType === "UPDATE") {
                    debugger;
                    const locId = element[`${props.locationKey}Id`];
                    if ((!state && locId) || (state && locId !== state.id)) {
                        DataStore.query(models.Location, locId).then((result) =>
                            setState(result)
                        );
                        locationObserver.current.unsubscribe();
                        locationObserver.current = DataStore.observe(
                            models.Location,
                            locId
                        ).subscribe(({ opType, element }) => {
                            if (opType === "UPDATE" && !editModeRef.current) {
                                setState(element);
                            }
                        });
                    } else if (!locId) {
                        setState(null);
                    }
                }
            });

            const location = task[props.locationKey];
            locationObserver.current.unsubscribe();
            if (location) {
                locationObserver.current = DataStore.observe(
                    models.Location,
                    location.id
                ).subscribe(({ opType, element }) => {
                    if (opType === "UPDATE" && !editModeRef.current) {
                        setState(element);
                    }
                });
            }
            setState(location);
            loadedOnce.current = true;
            setIsFetching(false);
        } catch (err) {
            console.log(err);
            setErrorState(true);
        }
    }

    useEffect(
        () => getLocation(),
        [props.taskId, locationModelSynced, taskModelsSynced]
    );

    useEffect(
        () => () => {
            taskObserver.current.unsubscribe();
            locationObserver.current.unsubscribe();
        },
        []
    );

    useEffect(() => {
        if (!isFetching && !initialSetEdit.current) {
            initialSetEdit.current = true;
            setEditMode(!!!state);
        }
    }, [state, isFetching]);

    async function editPreset(additionalValues) {
        try {
            if (!props.taskId) throw new Error("No task id");
            const result = await DataStore.query(models.Task, props.taskId);
            if (!result) throw new Error("Task doesn't exist");
            const {
                createdAt,
                updatedAt,
                id,
                name,
                _version,
                _lastChangedAt,
                _deleted,
                ...rest
            } = state;
            const newValues = {
                ...rest,
                ..._.omit(additionalValues, ...protectedFields),
            };
            const newLocation = await DataStore.save(
                new models.Location({
                    ...newValues,
                    listed: 0,
                    name: `${name} (edited)`,
                    tenantId,
                })
            );
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated[props.locationKey] = newLocation;
                })
            );
            return newLocation;
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }
    async function selectPreset(location) {
        try {
            if (!props.taskId) throw new Error("No task id");
            const result = await DataStore.query(models.Task, props.taskId);
            if (!result) throw new Error("Task doesn't exist");
            if (!location) throw new Error("Location was not provided");
            if (result && location) {
                await DataStore.save(
                    models.Task.copyOf(result, (updated) => {
                        updated[props.locationKey] = location;
                    })
                );
            }
            setState(location);
            setEditMode(false);
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function clearLocation() {
        try {
            if (!props.taskId) throw new Error("No task id");
            const result = await DataStore.query(models.Task, props.taskId);
            if (!result) throw new Error("Task doesn't exist");
            const currentLocation = await DataStore.query(
                models.Location,
                result[props.locationKey].id
            );
            if (currentLocation.listed === 1) {
                await DataStore.save(
                    models.Task.copyOf(result, (updated) => {
                        updated[props.locationKey] = null;
                    })
                );
                if (process.env.REACT_APP_OFFLINE_ONLY !== "true") {
                    const gqlClearResult = await API.graphql(
                        graphqlOperation(queries.getTask, { id: props.taskId })
                    );
                    const { id, _version } = gqlClearResult.data.getTask;
                    await API.graphql(
                        graphqlOperation(mutations.updateTask, {
                            input: {
                                id,
                                _version,
                                [`${props.locationKey}Id`]: null,
                            },
                        })
                    );
                }
            } else {
                // clear the fields for an unlisted location before deleting it
                await DataStore.save(
                    models.Location.copyOf(currentLocation, (updated) => {
                        for (const field of Object.keys(
                            _.omit(currentLocation, ...protectedFields)
                        )) {
                            updated[field] = null;
                        }
                    })
                );
                await DataStore.save(
                    models.Task.copyOf(result, (updated) => {
                        updated[props.locationKey] = null;
                    })
                );
                if (process.env.REACT_APP_OFFLINE_ONLY !== "true") {
                    const gqlClearResult = await API.graphql(
                        graphqlOperation(queries.getTask, { id: props.taskId })
                    );
                    const { id, _version } = gqlClearResult.data.getTask;
                    await API.graphql(
                        graphqlOperation(mutations.updateTask, {
                            input: {
                                id,
                                _version,
                                [`${props.locationKey}Id`]: null,
                            },
                        })
                    );
                }
                DataStore.delete(currentLocation);
            }
            setState(null);
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function changeContactDetails(values) {
        let locationResult = null;
        const key = props.locationKey;
        const filtered = _.omit(values, ...protectedFields);
        if (state) {
            let locationToUpdate = await DataStore.query(
                models.Location,
                state.id
            );
            // check if existing location is listed or not
            if (locationToUpdate.listed === 1) {
                locationToUpdate = await editPreset();
            }
            if (!locationToUpdate.contact) {
                locationResult = await DataStore.save(
                    models.Location.copyOf(locationToUpdate, (updated) => {
                        updated.contact = filtered;
                    })
                );
            } else {
                locationResult = await DataStore.save(
                    models.Location.copyOf(locationToUpdate, (updated) => {
                        for (const [key, v] of Object.entries(filtered)) {
                            updated.contact[key] = v;
                        }
                    })
                );
            }
        } else {
            locationResult = await DataStore.save(
                new models.Location({
                    contact: values,
                    listed: 0,
                    tenantId,
                })
            );
            // find the existing task
            const existingTask = await DataStore.query(
                models.Task,
                props.taskId
            );
            if (!existingTask) throw new Error("Task doesn't exist");
            // link to new location
            await DataStore.save(
                models.Task.copyOf(existingTask, (updated) => {
                    updated[key] = locationResult;
                })
            );
        }
        setState(locationResult);
    }

    async function changeLocationDetails(values) {
        const locationId = state ? state.id : null;
        const key = props.locationKey;
        // display error if some location that doesn't exist is attempted to be created
        if (!["dropOffLocation", "pickUpLocation"].includes(key)) {
            dispatch(displayErrorNotification(errorMessage));
            console.log(`Trying to edit a bad location: ${key}`);
            return;
        }
        try {
            let locationResult;
            // if we are updating an existing location
            if (locationId) {
                let existingLocation = await DataStore.query(
                    models.Location,
                    locationId
                );
                if (!existingLocation)
                    throw new Error("Location doesn't exist");
                // don't do anything if values is empty
                if (!_.isEmpty(values)) {
                    if (!!existingLocation.listed) {
                        // copy the location first with the new values
                        locationResult = await editPreset(values);
                    } else {
                        // update the location and get the updated version back to locationResult
                        locationResult = await DataStore.save(
                            models.Location.copyOf(
                                existingLocation,
                                (updated) => {
                                    for (const [key, v] of Object.entries(
                                        values
                                    )) {
                                        if (!protectedFields.includes(key))
                                            updated[key] = v;
                                    }
                                }
                            )
                        );
                    }
                }
            } else {
                // if no location exists yet
                // make sure we aren't just sending empty values
                const result = {};
                if (!_.isEmpty(values)) {
                    for (const [key, value] of Object.entries(values)) {
                        if (!!value) {
                            result[key] = value;
                        }
                    }
                }
                if (_.isEmpty(result)) return;

                locationResult = await DataStore.save(
                    new models.Location({
                        ...values,
                        listed: 0,
                        tenantId,
                    })
                );
                // find the existing task
                if (!props.taskId) throw new Error("No task id");
                const existingTask = await DataStore.query(
                    models.Task,
                    props.taskId
                );
                if (!existingTask) throw new Error("Task doesn't exist");
                // link to new location
                await DataStore.save(
                    models.Task.copyOf(existingTask, (updated) => {
                        updated[key] = locationResult;
                    })
                );
            }
            setState(locationResult);
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    if (errorState) {
        return <GetError />;
    } else {
        return (
            <Paper className={classes.root}>
                <Stack
                    direction={"column"}
                    justifyContent={"space-between"}
                    spacing={1}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                    >
                        <Typography variant={"h6"}>
                            {props.locationKey === "pickUpLocation"
                                ? "Collect from"
                                : "Deliver to"}
                        </Typography>
                        {state && (
                            <EditModeToggleButton
                                value={editMode}
                                onChange={() =>
                                    setEditMode((prevState) => !prevState)
                                }
                            />
                        )}
                    </Stack>
                    <Divider />
                    {isFetching ? (
                        <Skeleton
                            variant={"rectangular"}
                            width={"100%"}
                            height={130}
                        />
                    ) : (
                        <LocationDetailAndSelector
                            onSelectPreset={selectPreset}
                            label={
                                props.locationKey === "pickUpLocation"
                                    ? "pick up"
                                    : "delivery"
                            }
                            onChange={changeLocationDetails}
                            onChangeContact={changeContactDetails}
                            onClear={clearLocation}
                            location={state}
                            displayPresets
                            editMode={editMode}
                        />
                    )}
                </Stack>
            </Paper>
        );
    }
}

LocationDetailsPanel.propTypes = {
    locationId: PropTypes.string,
    locationKey: PropTypes.oneOf(["pickUpLocation", "dropOffLocation"]),
    taskId: PropTypes.string,
};

LocationDetailsPanel.defaultProps = {
    locationId: null,
    locationKey: "pickUpLocation",
    taskId: null,
};

export default LocationDetailsPanel;
