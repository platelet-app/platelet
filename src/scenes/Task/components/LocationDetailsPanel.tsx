import LocationDetailAndSelector from "./LocationDetailAndSelector";
import { GraphQLQuery } from "@aws-amplify/api";
import React, { useEffect, useRef, useState } from "react";
import { Divider, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import { useDispatch, useSelector } from "react-redux";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import * as models from "../../../models";
import { API, DataStore, graphqlOperation } from "aws-amplify";
import _ from "lodash";
import { dataStoreModelSyncedStatusSelector } from "../../../redux/Selectors";
import GetError from "../../../ErrorComponents/GetError";
import EditModeToggleButton from "../../../components/EditModeToggleButton";
import * as mutations from "../../../graphql/mutations";
import * as queries from "../../../graphql/queries";
import { useAssignmentRole } from "../../../hooks/useAssignmentRole";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { GetTaskQuery } from "../../../API";

export const protectedFields = [
    "id",
    "_version",
    "_lastChangedAt",
    "_deleted",
    "updatedAt",
    "createdAt",
    "tenantId",
    "archived",
];

const locationClearFields = [
    "ward",
    "line1",
    "line2",
    "line3",
    "town",
    "county",
    "state",
    "country",
    "postcode",
    "what3words",
    "contact",
];

type LocationType = {
    name?: string | null;
    listed?: number | null;
    contact?: models.AddressAndContactDetails | null;
    ward?: string | null;
    line1?: string | null;
    line2?: string | null;
    line3?: string | null;
    town?: string | null;
    county?: string | null;
    state?: string | null;
    country?: string | null;
    postcode?: string | null;
    what3words?: string | null;
};

type LocationDetailsPanelProps = {
    locationId?: string | null;
    locationKey: "pickUpLocation" | "dropOffLocation";
    taskId?: string | null;
};

type LocationKeyId = "pickUpLocationId" | "dropOffLocationId";

const LocationDetailsPanel: React.FC<LocationDetailsPanelProps> = ({
    locationKey,
    taskId,
}) => {
    const { classes } = dialogCardStyles();
    const dispatch = useDispatch();
    // I have no idea why the imported selector is undefined here
    // @ts-ignore
    const tenantId = useSelector((state) => state.tenantId);
    const [state, setState] = useState<models.Location | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [errorState, setErrorState] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [confirmReplaceSelection, setConfirmReplaceSelection] =
        useState(false);
    const currentlySelectedPreset = useRef<models.Location | null>(null);
    const loadedOnce = useRef(false);
    const locationModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Location;
    const taskModelsSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Task;
    const currentUserRole = useAssignmentRole(taskId);
    const hasFullPermissions = currentUserRole === models.Role.COORDINATOR;
    const taskObserver = useRef({ unsubscribe: () => {} });
    const locationObserver = useRef({ unsubscribe: () => {} });
    const initialSetEdit = useRef(false);
    const errorMessage = "Sorry, an error occurred";

    const getLocation = React.useCallback(async () => {
        if (!loadedOnce.current) setIsFetching(true);
        if (!taskId) return;
        try {
            const task = await DataStore.query(models.Task, taskId);
            if (!task) {
                throw new Error("Task not found");
            }
            taskObserver.current.unsubscribe();
            taskObserver.current = DataStore.observe(
                models.Task,
                task.id
            ).subscribe(async ({ opType, element }) => {
                if (opType === "UPDATE") {
                    // datastore weirdness
                    // when using an observer the location id is returned and not
                    // the location record
                    const locId =
                        // @ts-ignore
                        element[`${locationKey}Id` as LocationKeyId];
                    const existingLocation = await DataStore.query(
                        models.Location,
                        locId
                    );
                    setState((prevState) => {
                        if (
                            (!prevState && locId) ||
                            (prevState && locId !== prevState.id)
                        ) {
                            locationObserver.current.unsubscribe();
                            locationObserver.current = DataStore.observe(
                                models.Location,
                                locId
                            ).subscribe(({ opType, element }) => {
                                if (opType === "UPDATE") {
                                    setState(element);
                                }
                            });
                            return existingLocation || null;
                        } else if (!locId) {
                            setState(null);
                        }
                        return prevState;
                    });
                }
            });
            const location = task[locationKey] || null;
            locationObserver.current.unsubscribe();
            if (location) {
                locationObserver.current = DataStore.observe(
                    models.Location,
                    location.id
                ).subscribe(({ opType, element }) => {
                    if (opType === "UPDATE") {
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
    }, [locationKey, taskId, locationModelSynced, taskModelsSynced]);
    useEffect(() => {
        getLocation();
    }, [getLocation]);
    useEffect(
        () => () => {
            taskObserver.current.unsubscribe();
            locationObserver.current.unsubscribe();
        },
        []
    );
    useEffect(() => {
        if (isFetching || !hasFullPermissions) return;
        if (!initialSetEdit.current) {
            initialSetEdit.current = true;
            setEditMode(!!!state);
        }
        if (state === null && hasFullPermissions) {
            setEditMode(true);
        }
    }, [state, isFetching, hasFullPermissions]);

    async function editPreset(additionalValues?: LocationType) {
        try {
            if (!taskId) throw new Error("No task id");
            const result = await DataStore.query(models.Task, taskId);
            if (!result) throw new Error("Task doesn't exist");
            if (!state) {
                throw new Error("No location to edit");
            }
            const { createdAt, updatedAt, id, name, ...rest } = state;
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
                    updated[locationKey] = newLocation;
                })
            );
            return newLocation;
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }
    async function selectPreset(location: models.Location) {
        try {
            if (!taskId) throw new Error("No task id");
            const result = await DataStore.query(models.Task, taskId);
            if (!result) throw new Error("Task doesn't exist");
            if (!location) return;
            if (state && !confirmReplaceSelection) {
                setConfirmReplaceSelection(true);
                currentlySelectedPreset.current = location;
            } else {
                if (result && location) {
                    await DataStore.save(
                        models.Task.copyOf(result, (updated) => {
                            updated[locationKey] = location;
                        })
                    );
                }
                setState(location);
                setEditMode(false);
                setConfirmReplaceSelection(false);
                currentlySelectedPreset.current = null;
            }
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
            setConfirmReplaceSelection(false);
            currentlySelectedPreset.current = null;
        }
    }
    async function clearLocation() {
        try {
            if (!taskId) throw new Error("No task id");
            const result = await DataStore.query(models.Task, taskId);
            if (!result) throw new Error("Task doesn't exist");
            const existingLocation = result[locationKey];
            if (existingLocation) {
                const currentLocation = await DataStore.query(
                    models.Location,
                    existingLocation.id
                );
                if (currentLocation?.listed === 1) {
                    await DataStore.save(
                        models.Task.copyOf(result, (updated) => {
                            updated[locationKey] = null;
                        })
                    );
                    if (process.env.REACT_APP_OFFLINE_ONLY !== "true") {
                        const variables = {
                            id: taskId,
                        };
                        const gqlClearResult = await API.graphql<
                            GraphQLQuery<GetTaskQuery>
                        >({
                            query: queries.getTask,
                            variables,
                        });
                        const data = gqlClearResult.data?.getTask;
                        if (data) {
                            const { id, _version } = data;
                            await API.graphql(
                                graphqlOperation(mutations.updateTask, {
                                    input: {
                                        id,
                                        _version,
                                        [`${locationKey}Id`]: null,
                                    },
                                })
                            );
                        }
                    }
                } else {
                    // clear the fields for an unlisted location before deleting it
                    if (currentLocation) {
                        const cleared = await DataStore.save(
                            models.Location.copyOf(
                                currentLocation,
                                (updated) => {
                                    for (const field of locationClearFields) {
                                        updated[field as keyof LocationType] =
                                            null;
                                    }
                                }
                            )
                        );
                        await DataStore.save(
                            models.Task.copyOf(result, (updated) => {
                                updated[locationKey] = null;
                            })
                        );
                        if (process.env.REACT_APP_OFFLINE_ONLY !== "true") {
                            const variables = {
                                id: taskId,
                            };
                            const gqlClearResult = await API.graphql<
                                GraphQLQuery<GetTaskQuery>
                            >({
                                query: queries.getTask,
                                variables,
                            });
                            const data = gqlClearResult.data?.getTask;
                            if (data) {
                                const { id, _version } = data;
                                await API.graphql(
                                    graphqlOperation(mutations.updateTask, {
                                        input: {
                                            id,
                                            _version,
                                            [`${locationKey}Id`]: null,
                                        },
                                    })
                                );
                            }
                        }
                        DataStore.delete(cleared);
                    }
                }
            }
            setState(null);
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }
    async function changeContactDetails(values: models.Location) {
        let locationResult: models.Location | null = null;
        const key = locationKey;
        const filtered = _.omit(values, ...protectedFields);
        if (state) {
            let locationToUpdate = await DataStore.query(
                models.Location,
                state.id
            );
            // check if existing location is listed or not
            if (locationToUpdate?.listed === 1) {
                locationToUpdate = await editPreset();
            }
            if (locationToUpdate && !locationToUpdate?.contact) {
                locationResult = await DataStore.save(
                    models.Location.copyOf(locationToUpdate, (updated) => {
                        updated.contact = filtered;
                    })
                );
            } else {
                if (locationToUpdate) {
                    locationResult = await DataStore.save(
                        models.Location.copyOf(locationToUpdate, (updated) => {
                            for (const [key, v] of Object.entries(filtered)) {
                                // @ts-ignore
                                updated.contact[
                                    key as keyof models.AddressAndContactDetails
                                ] = v;
                            }
                        })
                    );
                }
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
            if (taskId) {
                const existingTask = await DataStore.query(models.Task, taskId);
                if (!existingTask) throw new Error("Task doesn't exist");
                // link to new location
                await DataStore.save(
                    models.Task.copyOf(existingTask, (updated) => {
                        updated[key] = locationResult;
                    })
                );
            }
        }
        setState(locationResult);
    }
    async function changeLocationDetails(values: LocationType) {
        const locationId = state ? state.id : null;
        const key = locationKey;
        // display error if some location that doesn't exist is attempted to be created
        if (!["dropOffLocation", "pickUpLocation"].includes(key)) {
            dispatch(displayErrorNotification(errorMessage));
            console.log(`Trying to edit a bad location: ${key}`);
            return;
        }
        try {
            let locationResult: models.Location | null = null;
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
                        locationResult = (await editPreset(values)) || null;
                    } else {
                        // update the location and get the updated version back to locationResult
                        locationResult = await DataStore.save(
                            models.Location.copyOf(
                                existingLocation,
                                (updated) => {
                                    for (const [key, v] of Object.entries(
                                        _.omit(values, ...protectedFields)
                                    )) {
                                        // @ts-ignore
                                        updated[key as keyof LocationType] = v;
                                    }
                                }
                            )
                        );
                    }
                }
            } else {
                // if no location exists yet
                // make sure we aren't just sending empty values
                const result: LocationType = {};
                if (!_.isEmpty(values)) {
                    for (const [key, value] of Object.entries(
                        _.omit(values, ...protectedFields)
                    )) {
                        if (value) {
                            // @ts-ignore
                            result[key as keyof LocationType] = value;
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
                    if (!taskId) throw new Error("No task id");
                    const existingTask = await DataStore.query(
                        models.Task,
                        taskId
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
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }
    let contents = null;
    if (isFetching) {
        contents = (
            <Skeleton variant={"rectangular"} width={"100%"} height={130} />
        );
    } else if (hasFullPermissions || state) {
        contents = (
            <LocationDetailAndSelector
                onSelectPreset={selectPreset}
                label={
                    locationKey === "pickUpLocation" ? "pick up" : "delivery"
                }
                onChange={changeLocationDetails}
                onChangeContact={changeContactDetails}
                onClear={clearLocation}
                location={state}
                displayPresets
                editMode={editMode}
            />
        );
    } else {
        contents = <Typography>No location set.</Typography>;
    }
    if (errorState) {
        return <GetError />;
    } else {
        return (
            <>
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
                                {locationKey === "pickUpLocation"
                                    ? "Collect from"
                                    : "Deliver to"}
                            </Typography>
                            {hasFullPermissions && state && (
                                <EditModeToggleButton
                                    value={editMode}
                                    onChange={() =>
                                        setEditMode((prevState) => !prevState)
                                    }
                                />
                            )}
                        </Stack>
                        <Divider />
                        {contents}
                    </Stack>
                </Paper>
                <ConfirmationDialog
                    open={confirmReplaceSelection}
                    dialogTitle={"Replace existing location?"}
                    onConfirmation={() => {
                        if (currentlySelectedPreset.current) {
                            selectPreset(currentlySelectedPreset.current);
                        }
                    }}
                    onCancel={() => setConfirmReplaceSelection(false)}
                >
                    <Typography>
                        This will replace the{" "}
                        {locationKey === "pickUpLocation"
                            ? "pick-up"
                            : "delivery"}{" "}
                        location with the selected preset. Are you sure you want
                        to continue?
                    </Typography>
                </ConfirmationDialog>
            </>
        );
    }
};

export default LocationDetailsPanel;
