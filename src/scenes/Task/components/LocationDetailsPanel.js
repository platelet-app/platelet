import Grid from "@mui/material/Grid";
import LocationDetailAndSelector from "./LocationDetailAndSelector";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Divider, Paper, Typography } from "@mui/material";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import { useDispatch } from "react-redux";
import {
    displayErrorNotification,
    displayWarningNotification,
} from "../../../redux/notifications/NotificationsActions";
import * as models from "../../../models/index";
import { DataStore } from "@aws-amplify/datastore";
import _ from "lodash";
import { protectedFields } from "../../../apiConsts";

function LocationDetailsPanel(props) {
    const classes = dialogCardStyles();
    const dispatch = useDispatch();
    const [state, setState] = useState(null);

    const errorMessage = "Sorry, an error occurred";

    async function getLocation() {
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
        } catch (err) {
            displayErrorNotification(errorMessage);
            console.error(err);
        }
    }

    useEffect(() => getLocation(), [props.locationId]);

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
            console.error("Tried to update a non-existent contact");
            return;
        }
        const existingContact = await DataStore.query(
            models.AddressAndContactDetails,
            state.contact.id
        );
        if (!existingContact) {
            displayErrorNotification(errorMessage);
            console.error(`Location could not be found${state.contact.id}`);
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
            console.error(`Trying to edit a bad location: ${key}`);
            return;
        }
        try {
            //separate any contact details with location details
            let locationResult;
            let contactResult;
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
                // if rest is empty, only contact data was sent
                if (!_.isEmpty(values) && existingLocation) {
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
                contactResult = await DataStore.save(
                    new models.AddressAndContactDetails({})
                );
                // create a new location and link it to the new contact model
                locationResult = await DataStore.save(
                    new models.Location({
                        ...values,
                        contact: contactResult,
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

            // update local state, but find data from prevState to fill contactResult or locationResult if they are undefined
            setState((prevState) => {
                return { ...prevState, ...locationResult };
            });
        } catch (error) {
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    return (
        <Paper className={classes.root}>
            <Grid
                container
                direction={"column"}
                justifyContent={"space-between"}
                spacing={1}
            >
                <Grid item>
                    <Grid
                        container
                        direction={"row"}
                        justifyContent={"space-between"}
                    >
                        <Grid item>
                            <Typography variant={"h6"}>
                                {props.locationKey === "pickUpLocation"
                                    ? "Collect from"
                                    : "Deliver to"}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Divider />
                </Grid>
                <Grid item>
                    <LocationDetailAndSelector
                        onSelectPreset={selectPreset}
                        onChange={changeLocationDetails}
                        onChangeContact={changeContactDetails}
                        onEditPreset={editPreset}
                        onClear={clearLocation}
                        location={state}
                        displayPresets={true}
                        showContact={state && state.contact && state.contact.id}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
}

LocationDetailsPanel.propTypes = {
    locationId: PropTypes.string.isRequired,
    locationKey: PropTypes.oneOf(["pickUpLocation", "dropOffLocation"]),
    taskId: PropTypes.string.isRequired,
};

export default LocationDetailsPanel;
