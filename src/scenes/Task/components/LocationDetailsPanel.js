import LocationDetailAndSelector from "./LocationDetailAndSelector";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Divider, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import { useDispatch, useSelector } from "react-redux";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import * as models from "../../../models/index";
import { DataStore } from "aws-amplify";
import _ from "lodash";
import { protectedFields } from "../../../apiConsts";
import { dataStoreReadyStatusSelector } from "../../../redux/Selectors";
import GetError from "../../../ErrorComponents/GetError";

function LocationDetailsPanel(props) {
    const classes = dialogCardStyles();
    const dispatch = useDispatch();
    const [state, setState] = useState(null);
    const [errorState, setErrorState] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);

    const errorMessage = "Sorry, an error occurred";

    async function getLocation() {
        setIsFetching(true);
        if (!dataStoreReadyStatus) {
            return;
        }
        try {
            if (!props.locationId) {
                setState(null);
            } else {
                const location = await DataStore.query(
                    models.Location,
                    props.locationId
                );
                setState(location);
            }
            setIsFetching(false);
        } catch (err) {
            console.log(err);
            setErrorState(true);
        }
    }

    useEffect(() => getLocation(), [props.locationId, dataStoreReadyStatus]);

    async function editPreset(additionalValues) {
        try {
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
                    name: `Copy of ${name}`,
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
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function clearLocation() {
        try {
            const result = await DataStore.query(models.Task, props.taskId);
            if (!result) throw new Error("Task doesn't exist");
            const currentLocation = await DataStore.query(
                models.Location,
                result[props.locationKey].id
            );
            if (currentLocation.listed === 1) {
                // this is to trigger the observer on the dashboard and clear the card
                const dummyLocation = await DataStore.save(
                    new models.Location({})
                );
                await DataStore.save(
                    models.Task.copyOf(result, (updated) => {
                        updated[props.locationKey] = dummyLocation;
                    })
                );
                await DataStore.save(
                    models.Task.copyOf(result, (updated) => {
                        updated[props.locationKey] = null;
                    })
                );
                await DataStore.delete(dummyLocation);
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
                await DataStore.delete(currentLocation);
            }
            setState(null);
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function changeContactDetails(values) {
        debugger;
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
                    <Typography variant={"h6"}>
                        {props.locationKey === "pickUpLocation"
                            ? "Collect from"
                            : "Deliver to"}
                    </Typography>
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
                            displayPresets={true}
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
