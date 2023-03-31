import LocationDetailAndSelector from "./LocationDetailAndSelector";
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

export const protectedFields = [
    "id",
    "_version",
    "_lastChangedAt",
    "_deleted",
    "updatedAt",
    "createdAt",
    "tenantId",
];

type ProtectedFieldsType =
    | "id"
    | "_version"
    | "_lastChangedAt"
    | "_deleted"
    | "updatedAt"
    | "createdAt"
    | "tenantId";

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

const LocationDetailsPanel: React.SFC<LocationDetailsPanelProps> = (props) => {
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
    const currentUserRole = useAssignmentRole(props.taskId);
    const hasFullPermissions = currentUserRole === models.Role.COORDINATOR;
    const taskObserver = useRef({ unsubscribe: () => {} });
    const locationObserver = useRef({ unsubscribe: () => {} });
    const initialSetEdit = useRef(false);
    const errorMessage = "Sorry, an error occurred";

    async function getLocation() {
        if (!loadedOnce.current) setIsFetching(true);
        if (!props.taskId) return;
        try {
            const task = await DataStore.query(models.Task, props.taskId);
            if (!task) {
                throw new Error("Task not found");
            }
            taskObserver.current.unsubscribe();
            taskObserver.current = DataStore.observe(
                models.Task,
                task.id
            ).subscribe(({ opType, element }) => {
                if (opType === "UPDATE") {
                    // datastore weirdness
                    // when using an observer the location id is returned and not
                    // the location record
                    const locId =
                        // @ts-ignore
                        element[`${props.locationKey}Id` as LocationKeyId];
                    if ((!state && locId) || (state && locId !== state.id)) {
                        DataStore.query(models.Location, locId).then((result) =>
                            setState(result || null)
                        );
                        locationObserver.current.unsubscribe();
                        locationObserver.current = DataStore.observe(
                            models.Location,
                            locId
                        ).subscribe(({ opType, element }) => {
                            if (opType === "UPDATE") {
                                setState(element);
                            }
                        });
                    } else if (!locId) {
                        setState(null);
                    }
                }
            });
            const location = task[props.locationKey] || null;
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
    }
    useEffect(() => {
        getLocation();
    }, [props.taskId, locationModelSynced, taskModelsSynced]);
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
            if (!props.taskId) throw new Error("No task id");
            const result = await DataStore.query(models.Task, props.taskId);
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
                    updated[props.locationKey] = newLocation;
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
            if (!props.taskId) throw new Error("No task id");
            const result = await DataStore.query(models.Task, props.taskId);
            if (!result) throw new Error("Task doesn't exist");
            if (!location) return;
            if (state && !confirmReplaceSelection) {
                setConfirmReplaceSelection(true);
                currentlySelectedPreset.current = location;
            } else {
                if (result && location) {
                    await DataStore.save(
                        models.Task.copyOf(result, (updated) => {
                            updated[props.locationKey] = location;
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
            if (!props.taskId) throw new Error("No task id");
            const result = await DataStore.query(models.Task, props.taskId);
            if (!result) throw new Error("Task doesn't exist");
            const existingLocation = result[props.locationKey];
            if (existingLocation) {
                const currentLocation = await DataStore.query(
                    models.Location,
                    existingLocation.id
                );
                if (currentLocation?.listed === 1) {
                    await DataStore.save(
                        models.Task.copyOf(result, (updated) => {
                            updated[props.locationKey] = null;
                        })
                    );
                    if (process.env.REACT_APP_OFFLINE_ONLY !== "true") {
                        const gqlClearResult = await API.graphql(
                            graphqlOperation(queries.getTask, {
                                id: props.taskId,
                            })
                        );
                        // TODO: when merge old tasks pull request
                        // get the type from there
                        // @ts-ignore
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
                    if (currentLocation) {
                        await DataStore.save(
                            models.Location.copyOf(
                                currentLocation,
                                (updated) => {
                                    for (const field of Object.keys(
                                        _.omit(
                                            currentLocation,
                                            ...protectedFields
                                        )
                                    )) {
                                        updated[field as keyof LocationType] =
                                            null;
                                    }
                                }
                            )
                        );
                        await DataStore.save(
                            models.Task.copyOf(result, (updated) => {
                                updated[props.locationKey] = null;
                            })
                        );
                        if (process.env.REACT_APP_OFFLINE_ONLY !== "true") {
                            const gqlClearResult = await API.graphql(
                                graphqlOperation(queries.getTask, {
                                    id: props.taskId,
                                })
                            );
                            const { id, _version } =
                                // @ts-ignore
                                gqlClearResult.data.getTask;
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
        const key = props.locationKey;
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
            if (props.taskId) {
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
        }
        setState(locationResult);
    }
    async function changeLocationDetails(values: LocationType) {
        const locationId = state ? state.id : null;
        const key = props.locationKey;
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
                        if (!!value) {
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
                                {props.locationKey === "pickUpLocation"
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
                        {props.locationKey === "pickUpLocation"
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
LocationDetailsPanel.defaultProps = {
    locationId: null,
    locationKey: "pickUpLocation",
    taskId: null,
};
export default LocationDetailsPanel;
