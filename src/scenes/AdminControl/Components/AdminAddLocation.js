import { DataStore } from "@aws-amplify/datastore";
import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";
import { PaddedPaper } from "../../../styles/common";
import { encodeUUID } from "../../../utilities";
import * as models from "../../../models/index";
import Forbidden from "../../../ErrorComponents/Forbidden";
import { getWhoami } from "../../../redux/Selectors";
import { createLoadingSelector } from "../../../redux/LoadingSelectors";
import FormSkeleton from "../../../SharedLoadingSkeletons/FormSkeleton";

const initialLocationState = {
    name: null,
    contact: {
        name: null,
        telephoneNumber: null,
        emailAddress: null,
    },
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
    listed: 1,
};

const useStyles = makeStyles({
    root: {
        width: "100%",
        maxWidth: 460,
    },
    message: {
        height: 80,
    },
});

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

function AdminAddLocation() {
    const [state, setState] = useState(initialLocationState);
    const whoami = useSelector(getWhoami);
    const [isPosting, setIsPosting] = useState(false);
    const loadingSelector = createLoadingSelector(["GET_WHOAMI"]);
    const whoamiFetching = useSelector(loadingSelector);
    const [inputVerified, setInputVerified] = useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();

    function verifyInput() {
        setInputVerified(!!state.name);
    }
    useEffect(verifyInput, [state]);

    async function addNewVehicle() {
        try {
            setIsPosting(true);
            const { contact, ...rest } = state;
            const newContact = await DataStore.save(
                new models.AddressAndContactDetails(contact)
            );
            const newLocation = await DataStore.save(
                new models.Location({
                    locationContactId: newContact.id,
                    ...rest,
                })
            );
            setState(initialLocationState);
            setIsPosting(false);
            dispatch(
                displayInfoNotification(
                    "Location added",
                    undefined,
                    `/location/${encodeUUID(newLocation.id)}`
                )
            );
        } catch (error) {
            console.log("error adding location:", error);
            setIsPosting(false);
            dispatch(displayErrorNotification(error.message));
        }
    }

    if (whoamiFetching) {
        return <FormSkeleton />;
    } else if (!whoami.roles.includes("ADMIN")) {
        return <Forbidden />;
    } else {
        return (
            <PaddedPaper>
                <Grid
                    container
                    className={classes.root}
                    direction={"column"}
                    justify={"flex-start"}
                    alignItems={"top"}
                    spacing={3}
                >
                    <Grid item>
                        <Typography variant={"h5"}>
                            Add a new location
                        </Typography>
                    </Grid>
                    {Object.keys(fields).map((key) => {
                        return (
                            <Grid key={key} item>
                                <TextFieldUncontrolled
                                    value={state[key]}
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
                            </Grid>
                        );
                    })}
                    {Object.keys(contactFields).map((key) => {
                        return (
                            <Grid key={key} item>
                                <TextFieldUncontrolled
                                    value={state.contact[key]}
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
                            </Grid>
                        );
                    })}
                    <Grid item>
                        <Button
                            disabled={!inputVerified || isPosting}
                            onClick={addNewVehicle}
                        >
                            Add location
                        </Button>
                    </Grid>
                </Grid>
            </PaddedPaper>
        );
    }
}

export default AdminAddLocation;
