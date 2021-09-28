import React, { useEffect, useState } from "react";
import CommentsSection from "../Comments/CommentsSection";
import { decodeUUID } from "../../utilities";
import { PaddedPaper } from "../../styles/common";
import { useDispatch, useSelector } from "react-redux";
import { getLocationRequest } from "../../redux/locations/LocationsActions";
import {
    createLoadingSelector,
    createNotFoundSelector,
} from "../../redux/LoadingSelectors";
import NotFound from "../../ErrorComponents/NotFound";
import FormSkeleton from "../../SharedLoadingSkeletons/FormSkeleton";
import { DataStore } from "aws-amplify";
import * as models from "../../models/index";
import { dataStoreReadyStatusSelector, getWhoami } from "../../redux/Selectors";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import { Divider, Grid, makeStyles, Typography } from "@material-ui/core";
import { TextFieldUncontrolled } from "../../components/TextFields";
import { EditModeToggleButton } from "../../components/EditModeToggleButton";
import SaveCancelButtons from "../../components/SaveCancelButtons";
import _ from "lodash";

const initialLocationState = {
    name: null,
    contact: { name: null, telephoneNumber: null, emailAddress: null },
    ward: null,
    line1: null,
    line2: null,
    line3: null,
    town: null,
    county: null,
    country: null,
    state: null,
    postcode: null,
    what3words: null,
};

const fields = {
    name: "Name",
    ward: "Ward",
    line1: "Line 1",
    line2: "Line 2",
    line3: "Line 3",
    town: "Town",
    county: "County",
    country: "Country",
    state: "State",
    postcode: "Postcode",
    what3words: "What 3 Words",
};

const contactFields = {
    name: "Contact name",
    emailAddress: "Contact email",
    telephoneNumber: "Contact telephone",
};

const useStyles = makeStyles({
    root: {
        width: 600,
    },
});

export default function LocationDetail(props) {
    const locationUUID = decodeUUID(props.match.params.location_uuid_b62);
    const whoami = useSelector(getWhoami);
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [notFound, setNotFound] = useState(false);
    const [state, setState] = useState(initialLocationState);
    const [oldState, setOldState] = useState(initialLocationState);
    const [editMode, setEditMode] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

    async function newLocationProfile() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            try {
                const location = await DataStore.query(
                    models.Location,
                    locationUUID
                );
                setIsFetching(false);
                if (location) {
                    setState(location);
                    setOldState(location);
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                setIsFetching(false);
                dispatch(
                    displayErrorNotification(
                        `Failed to get location: ${error.message}`
                    )
                );
                console.log("Request failed", error);
            }
        }
    }
    useEffect(
        () => newLocationProfile(),
        [props.location.key, dataStoreReadyStatus]
    );

    function verifyUpdate() {
        // TODO: verify name is unique
        return true;
    }

    async function onUpdate(value) {
        debugger;
        const { contact, ...rest } = value;
        try {
            await DataStore.save(
                models.Location.copyOf(rest, (updated) => {
                    for (const [key, newValue] of Object.entries(rest)) {
                        if (key !== "id") updated[key] = newValue;
                    }
                })
            );
            await DataStore.save(
                models.AddressAndContactDetails.copyOf(contact, (updated) => {
                    for (const [key, newValue] of Object.entries(contact)) {
                        if (key !== "id") updated[key] = newValue;
                    }
                })
            );
            setIsPosting(false);
        } catch (error) {
            throw error;
            console.log("Update request failed", error);
            dispatch(displayErrorNotification(error.message));
            setIsPosting(false);
        }
    }

    const saveButtons = !editMode ? (
        <></>
    ) : (
        <SaveCancelButtons
            disabled={isPosting}
            onSave={async () => {
                if (verifyUpdate(state)) {
                    await onUpdate(
                        _.omit(
                            state,
                            "_deleted",
                            "_lastChangedAt",
                            "_version",
                            "createdAt",
                            "updatedAt"
                        )
                    );
                    setEditMode(false);
                    setOldState(state);
                }
            }}
            onCancel={() => {
                setEditMode(false);
                setState(oldState);
            }}
        />
    );

    let editToggle = <></>;
    if (whoami.roles) {
        if (whoami.roles.includes("ADMIN")) {
            editToggle = (
                <EditModeToggleButton
                    tooltipDefault={"Edit this location"}
                    value={editMode}
                    onChange={(v) => {
                        setEditMode(v);
                        if (!v) setState(oldState);
                    }}
                />
            );
        }
    }

    const header = (
        <Typography variant={"h4"}>Directory location: {state.name}</Typography>
    );

    const divider = editMode ? (
        <></>
    ) : (
        <div style={{ width: "80%" }}>
            <Grid item>
                <Divider />
            </Grid>
        </div>
    );

    if (isFetching) {
        return <FormSkeleton />;
    } else if (notFound) {
        return <NotFound>Location {locationUUID} could not be found.</NotFound>;
    } else {
        return (
            <React.Fragment>
                <PaddedPaper>
                    <Grid
                        container
                        direction={"row"}
                        justify={"space-between"}
                        alignItems={"top"}
                        spacing={3}
                    >
                        <Grid item>{header}</Grid>
                        <Grid item>{editToggle}</Grid>
                    </Grid>
                    <Grid
                        container
                        direction={"row"}
                        justify={"space-between"}
                        alignItems={"flex-start"}
                        spacing={1}
                    >
                        {Object.keys(fields).map((key) => {
                            return (
                                <Grid key={key} style={{ width: "50%" }} item>
                                    <TextFieldUncontrolled
                                        value={state[key]}
                                        InputProps={{
                                            readOnly: !editMode,
                                            disableUnderline: !editMode,
                                        }}
                                        fullWidth
                                        label={fields[key]}
                                        id={key}
                                        onChange={(e) => {
                                            setState({
                                                ...state,
                                                [key]: e.target.value,
                                            });
                                        }}
                                    />
                                    {divider}
                                </Grid>
                            );
                        })}
                        {Object.keys(contactFields).map((key) => {
                            return (
                                <Grid key={key} style={{ width: "50%" }} item>
                                    <TextFieldUncontrolled
                                        value={state.contact[key]}
                                        InputProps={{
                                            readOnly: !editMode,
                                            disableUnderline: !editMode,
                                        }}
                                        fullWidth
                                        label={contactFields[key]}
                                        id={key}
                                        onChange={(e) => {
                                            setState({
                                                ...state,
                                                contact: {
                                                    ...state.contact,
                                                    [key]: e.target.value,
                                                },
                                            });
                                        }}
                                    />
                                    {divider}
                                </Grid>
                            );
                        })}
                    </Grid>
                    {saveButtons}
                </PaddedPaper>
                <CommentsSection parentUUID={locationUUID} />
            </React.Fragment>
        );
    }
}
