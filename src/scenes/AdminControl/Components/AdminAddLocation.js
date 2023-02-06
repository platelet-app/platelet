import { DataStore } from "aws-amplify";
import {
    Button,
    Divider,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { makeStyles } from 'tss-react/mui';
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
import { getWhoami, tenantIdSelector } from "../../../redux/Selectors";
import { createLoadingSelector } from "../../../redux/LoadingSelectors";
import OnlineLocationSearch from "../../../components/OnlineLocationSearch";

const initialLocationState = {
    name: "",
    contact: {
        name: "",
        telephoneNumber: "",
        emailAddress: "",
    },
    ward: "",
    line1: "",
    line2: "",
    line3: "",
    town: "",
    county: "",
    country: "",
    state: "",
    postcode: "",
    what3words: "",
    listed: 1,
    googleMapsPlaceId: null,
};

const useStyles = makeStyles()({
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
    postcode: "Postcode",
    what3words: "What 3 Words",
};

const contactFields = {
    name: "Contact name",
    emailAddress: "Contact email",
};

function AdminAddLocation() {
    const [state, setState] = useState(initialLocationState);
    const [locationSearchReset, setLocationSearchReset] = useState(false);
    const whoami = useSelector(getWhoami);
    const tenantId = useSelector(tenantIdSelector);
    const [isPosting, setIsPosting] = useState(false);
    const loadingSelector = createLoadingSelector(["GET_WHOAMI"]);
    const whoamiFetching = useSelector(loadingSelector);
    const [inputVerified, setInputVerified] = useState(false);
    const dispatch = useDispatch();
    const { classes } = useStyles();

    function verifyInput() {
        setInputVerified(!!state.name);
    }
    useEffect(verifyInput, [state]);

    const onSelectFromSearch = (location) => {
        setState({
            ...initialLocationState,
            ...location,
        });
    };

    const verifyUniqueName = async (name) => {
        const locations = await DataStore.query(models.Location, (l) =>
            l.listed("eq", 1).name("eq", name)
        );
        if (!locations || locations.length === 0) return true;
        return false;
    };

    async function addNewLocation() {
        try {
            setIsPosting(true);
            if (await verifyUniqueName(state.name)) {
                const createdBy = await DataStore.query(models.User, whoami.id);
                if (!createdBy) throw new Error("Author not found");
                const newLocation = await DataStore.save(
                    new models.Location({
                        ...state,
                        tenantId,
                        disabled: 0,
                        createdBy,
                    })
                );
                setState(initialLocationState);
                setLocationSearchReset((prevState) => !prevState);
                setIsPosting(false);
                dispatch(
                    displayInfoNotification(
                        "Location added",
                        undefined,
                        `/location/${encodeUUID(newLocation.id)}`
                    )
                );
            } else {
                dispatch(
                    displayErrorNotification("Location name must be unique")
                );
                setIsPosting(false);
            }
        } catch (error) {
            console.log("error adding location:", error);
            setIsPosting(false);
            dispatch(displayErrorNotification("Sorry, something went wrong."));
        }
    }

    if (whoamiFetching) {
        return (
            <PaddedPaper>
                <Skeleton
                    sx={{ height: 1200, width: "100%" }}
                    variant="rectangle"
                />
            </PaddedPaper>
        );
    } else if (!whoami.roles.includes("ADMIN")) {
        return <Forbidden />;
    } else {
        return (
            <PaddedPaper>
                <Stack
                    className={classes.root}
                    direction={"column"}
                    justifyContent={"flex-start"}
                    alignItems={"top"}
                    spacing={3}
                >
                    <Typography variant={"h5"}>Add a new location</Typography>
                    <OnlineLocationSearch
                        key={locationSearchReset}
                        onSelect={onSelectFromSearch}
                    />
                    <Divider />

                    {Object.entries(fields).map(([key, value]) => {
                        return (
                            <TextField
                                key={key}
                                value={state[key]}
                                aria-label={value}
                                fullWidth
                                label={value}
                                id={key}
                                onChange={(e) => {
                                    setState((prevState) => ({
                                        ...prevState,
                                        [key]: e.target.value,
                                    }));
                                }}
                            />
                        );
                    })}
                    {Object.entries(contactFields).map(([key, value]) => {
                        return (
                            <TextField
                                key={`contact-${key}`}
                                fullWidth
                                value={state.contact[key]}
                                aria-label={`contact-${value}`}
                                label={value}
                                id={`contact-${key}`}
                                onChange={(e) => {
                                    setState((prevState) => ({
                                        ...prevState,
                                        contact: {
                                            ...state.contact,
                                            [key]: e.target.value,
                                        },
                                    }));
                                }}
                            />
                        );
                    })}
                    <TextFieldUncontrolled
                        key={"telephoneNumber"}
                        fullWidth
                        value={state.contact.telephoneNumber}
                        label="Telephone number"
                        aria-label="contact telephone number"
                        id={"contact-telephoneNumber"}
                        tel
                        onChange={(e) => {
                            setState((prevState) => ({
                                ...prevState,
                                contact: {
                                    ...state.contact,
                                    telephoneNumber: e.target.value,
                                },
                            }));
                        }}
                    />

                    <Button
                        disabled={!inputVerified || isPosting}
                        onClick={addNewLocation}
                    >
                        Add location
                    </Button>
                </Stack>
            </PaddedPaper>
        );
    }
}

export default AdminAddLocation;
