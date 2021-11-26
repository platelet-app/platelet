import LocationDetailAndSelector from "./LocationDetailAndSelector";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Divider, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import { useDispatch, useSelector } from "react-redux";
import {
    displayErrorNotification,
    displayWarningNotification,
} from "../../../redux/notifications/NotificationsActions";
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

    async function editPreset(currentState) {
        try {
            const result = await DataStore.query(models.Task, props.taskId);
            if (!result) throw new Error("Task doesn't exist");
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
            const newContact = await DataStore.save(
                new models.AddressAndContactDetails({ ...contact })
            );
            const newLocation = await DataStore.save(
                new models.Location({
                    ...rest,
                    listed: 0,
                    contact: newContact,
                    name: `Copy of ${name}`,
                })
            );
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated[props.locationKey] = newLocation;
                })
            );
            setState(newLocation);
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
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated[props.locationKey] = null;
                })
            );
            setState(null);
        } catch (error) {
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function changeContactDetails(values) {
        if (!state.contact || !state.contact.id) {
            displayErrorNotification(errorMessage);
            console.log("Tried to update a non-existent contact");
            return;
        }
        const existingContact = await DataStore.query(
            models.AddressAndContactDetails,
            state.contact.id
        );
        if (!existingContact) {
            displayErrorNotification(errorMessage);
            console.log(`Location could not be found${state.contact.id}`);
            return;
        }
        const contactResult = await DataStore.save(
            models.AddressAndContactDetails.copyOf(
                existingContact,
                (updated) => {
                    for (const [key, v] of Object.entries(values)) {
                        if (!protectedFields.includes(key)) updated[key] = v;
                    }
                }
            )
        );
        setState((prevState) => ({
            ...prevState,
            contact: contactResult,
        }));
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
                const existingLocation = await DataStore.query(
                    models.Location,
                    locationId
                );
                if (!existingLocation)
                    throw new Error("Location doesn't exist");
                if (!!existingLocation.listed) {
                    // can't edit a location if it's from the directory
                    dispatch(
                        displayWarningNotification(
                            "You can't edit listed locations in this way."
                        )
                    );
                    return;
                }
                // don't do anything if values is empty
                if (!_.isEmpty(values)) {
                    // update the location and get the updated version back to locationResult
                    locationResult = await DataStore.save(
                        models.Location.copyOf(existingLocation, (updated) => {
                            for (const [key, v] of Object.entries(values)) {
                                if (!protectedFields.includes(key))
                                    updated[key] = v;
                            }
                        })
                    );
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

                // create a contact model
                const contactResult = await DataStore.save(
                    new models.AddressAndContactDetails({})
                );
                // create a new location and link it to the new contact model
                locationResult = await DataStore.save(
                    new models.Location({
                        ...values,
                        contact: contactResult,
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
            setState((prevState) => {
                return { ...prevState, ...locationResult };
            });
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
                            onChange={changeLocationDetails}
                            onChangeContact={changeContactDetails}
                            onEditPreset={editPreset}
                            onClear={clearLocation}
                            location={state}
                            displayPresets={true}
                            showContact={
                                !!(state && state.contact && state.contact.id)
                            }
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
