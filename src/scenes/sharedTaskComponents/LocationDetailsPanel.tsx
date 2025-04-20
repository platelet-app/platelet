import LocationDetailAndSelector from "./LocationDetailAndSelector";
import { GraphQLQuery } from "@aws-amplify/api";
import React, { useEffect, useRef, useState } from "react";
import { Paper, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import * as models from "../../models";
import { API, DataStore, graphqlOperation } from "aws-amplify";
import { PersistentModelConstructor } from "@aws-amplify/datastore";
import _ from "lodash";
import { dataStoreModelSyncedStatusSelector } from "../../redux/Selectors";
import GetError from "../../ErrorComponents/GetError";
import EditModeToggleButton from "../../components/EditModeToggleButton";
import * as mutations from "../../graphql/mutations";
import * as queries from "../../graphql/queries";
import { useAssignmentRole } from "../../hooks/useAssignmentRole";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import {
    DeleteLocationMutation,
    GetLocationQuery,
    GetTaskQuery,
    UpdateLocationMutation,
} from "../../API";
import TaskScheduleDetails from "./TaskScheduleDetails";
import useModelSubscription from "../../hooks/useModelSubscription";

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

type LocationDetailsPanelProps<T extends models.Task | models.ScheduledTask> = {
    locationKey: "pickUpLocation" | "dropOffLocation";
    taskId: string;
    taskModel: PersistentModelConstructor<T>;
    hasFullPermissionsOverride?: boolean;
};

const LocationDetailsPanel = <T extends models.Task | models.ScheduledTask>({
    locationKey,
    taskId,
    taskModel,
    hasFullPermissionsOverride,
}: LocationDetailsPanelProps<T>) => {
    const theme = useTheme();
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
    const hasFullPermissions =
        hasFullPermissionsOverride ??
        currentUserRole === models.Role.COORDINATOR;
    const taskObserver = useRef({ unsubscribe: () => {} });
    const locationObserver = useRef({ unsubscribe: () => {} });
    const initialSetEdit = useRef(false);
    const errorMessage = "Sorry, an error occurred";

    const hideScheduleDate = taskModel.name === "ScheduledTask";

    const { state: task } = useModelSubscription(taskModel, taskId);
    const schedule =
        locationKey === "pickUpLocation"
            ? task?.pickUpSchedule || null
            : task?.dropOffSchedule || null;

    let noWarning = true;
    if (taskModel.name === "Task") {
        if (task && locationKey === "pickUpLocation") {
            const t = task as models.Task;
            noWarning = !!t.timePickedUp;
        }
        if (task && locationKey === "dropOffLocation") {
            const t = task as models.Task;
            noWarning = !!t.timeDroppedOff;
        }
    }

    const getLocation = React.useCallback(async () => {
        if (!loadedOnce.current) setIsFetching(true);
        if (!taskId) return;
        try {
            // @ts-ignore
            const existingTask = await DataStore.query(taskModel, taskId);
            if (!existingTask) {
                throw new Error("Task not found");
            }
            taskObserver.current.unsubscribe();
            taskObserver.current = DataStore.observe(
                taskModel,
                existingTask.id
            ).subscribe(async ({ opType, element }) => {
                if (opType === "UPDATE") {
                    const locId = element[locationKey]?.id;
                    if (locId) {
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
                            }
                            return prevState;
                        });
                    } else {
                        setState(null);
                    }
                }
            });
            const location = existingTask[locationKey] || null;
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
    }, [locationKey, taskId, taskModel]);

    useEffect(() => {
        getLocation();
    }, [getLocation, locationModelSynced, taskModelsSynced]);

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

    const handleClearSchedule = async () => {
        // @ts-ignore
        const task = await DataStore.query(taskModel, taskId);
        if (!task) return;
        await DataStore.save(
            // @ts-ignore
            models.Task.copyOf(task, (updated) => {
                if (locationKey === "pickUpLocation") {
                    updated.pickUpSchedule = null;
                } else if (locationKey === "dropOffLocation") {
                    updated.dropOffSchedule = null;
                }
            })
        );
    };

    const handleEditSchedule = async (newSchedule: models.Schedule) => {
        // @ts-ignore
        const task = await DataStore.query(taskModel, taskId);
        if (!task) return;
        await DataStore.save(
            // @ts-ignore
            models.Task.copyOf(task, (updated) => {
                if (locationKey === "pickUpLocation") {
                    updated.pickUpSchedule = newSchedule;
                } else if (locationKey === "dropOffLocation") {
                    updated.dropOffSchedule = newSchedule;
                }
            })
        );
    };

    async function editPreset(additionalValues?: LocationType) {
        try {
            if (!taskId) throw new Error("No task id");
            // @ts-ignore
            const result = await DataStore.query(taskModel, taskId);
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
                taskModel.copyOf(result, (updated) => {
                    // @ts-ignore
                    updated[locationKey as keyof taskModel] = newLocation;
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
            // @ts-ignore
            const result = await DataStore.query(taskModel, taskId);
            if (!result) throw new Error("Task doesn't exist");
            if (!location) return;
            if (state && !confirmReplaceSelection) {
                setConfirmReplaceSelection(true);
                currentlySelectedPreset.current = location;
            } else {
                if (result && location) {
                    // online result
                    if (!location.id) {
                        location = await DataStore.save(
                            new models.Location({
                                ...location,
                                listed: 0,
                                tenantId,
                            })
                        );
                    }

                    await DataStore.save(
                        taskModel.copyOf(result, (updated) => {
                            // @ts-ignore
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
            // @ts-ignore
            const result = await DataStore.query(taskModel, taskId);
            if (!result) throw new Error("Task doesn't exist");
            const existingLocation = result[locationKey];
            if (existingLocation) {
                const currentLocation = await DataStore.query(
                    models.Location,
                    existingLocation.id
                );
                if (currentLocation?.listed === 1) {
                    await DataStore.save(
                        taskModel.copyOf(result, (updated) => {
                            // @ts-ignore
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
                    // or not because of DataStore crappiness
                    if (currentLocation) {
                        /*const cleared = await DataStore.save(
                            models.Location.copyOf(
                                currentLocation,
                                (updated) => {
                                    for (const field of locationClearFields) {
                                        updated[field as keyof LocationType] =
                                            null;
                                    }
                                }
                            )
                        );*/
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
                                const getLocation = await API.graphql<
                                    GraphQLQuery<GetLocationQuery>
                                >({
                                    query: queries.getLocation,
                                    variables: {
                                        id: currentLocation.id,
                                    },
                                });
                                const locationVersion =
                                    getLocation?.data?.getLocation?._version;
                                if (locationVersion) {
                                    const updatedUnlistedLocation =
                                        await API.graphql<
                                            GraphQLQuery<UpdateLocationMutation>
                                        >(
                                            graphqlOperation(
                                                mutations.updateLocation,
                                                {
                                                    input: {
                                                        id: currentLocation.id,
                                                        _version:
                                                            locationVersion,
                                                        ward: null,
                                                        line1: null,
                                                        line2: null,
                                                        line3: null,
                                                        town: null,
                                                        county: null,
                                                        state: null,
                                                        country: null,
                                                        postcode: null,
                                                        what3words: null,
                                                        contact: null,
                                                    },
                                                }
                                            )
                                        );
                                    await API.graphql<
                                        GraphQLQuery<DeleteLocationMutation>
                                    >(
                                        graphqlOperation(
                                            mutations.deleteLocation,
                                            {
                                                input: {
                                                    id: currentLocation.id,
                                                    _version:
                                                        updatedUnlistedLocation
                                                            .data
                                                            ?.updateLocation
                                                            ?._version,
                                                },
                                            }
                                        )
                                    );
                                }
                            }
                        }
                        //DataStore.delete(currentLocation);
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
                // @ts-ignore
                const existingTask = await DataStore.query(taskModel, taskId);
                if (!existingTask) throw new Error("Task doesn't exist");
                // link to new location
                await DataStore.save(
                    taskModel.copyOf(existingTask, (updated) => {
                        // @ts-ignore
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
                        taskModel,
                        // @ts-ignore
                        taskId
                    );
                    if (!existingTask) throw new Error("Task doesn't exist");
                    // link to new location
                    await DataStore.save(
                        taskModel.copyOf(existingTask, (updated) => {
                            // @ts-ignore
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
            <Skeleton
                data-testid="location-details-panel-skeleton"
                variant={"rectangular"}
                width={"100%"}
                height={130}
            />
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
                <Paper
                    sx={{
                        padding: "15px",
                        width: "100%",
                        maxWidth: 400,
                        borderRadius: "1em",
                        [theme.breakpoints.down("sm")]: {
                            maxWidth: "100%",
                        },
                    }}
                >
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
                        {contents}
                        <TaskScheduleDetails
                            onClear={handleClearSchedule}
                            onChange={handleEditSchedule}
                            schedule={schedule}
                            noWarning={noWarning}
                            hideDate={hideScheduleDate}
                        />
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
