import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import SaveCancelButtons from "../../../components/SaveCancelButtons";
import { EditModeToggleButton } from "../../../components/EditModeToggleButton";
import { getWhoami } from "../../../redux/Selectors";
import _ from "lodash";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import RiderResponsibilitySelect from "./RiderResponsibilitySelect";
import { userRoles } from "../../../apiConsts";
import { Box, Stack, Typography } from "@mui/material";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";

const fields = {
    name: "Name",
    displayName: "Display Name",
};

const contactFields = {
    emailAddress: "Email Address",
    telephoneNumber: "Telephone",
    mobileNumber: "Mobile",
};
const addressFields = {
    line1: "Line 1",
    line2: "Line 2",
    line3: "Line 3",
    town: "Town",
    county: "County",
    country: "Country",
    postcode: "Postcode",
};

export default function UserProfile(props) {
    const [editMode, setEditMode] = useState(false);
    const [state, setState] = useState({ ...props.user });
    const oldState = useRef({ ...props.user });
    const dispatch = useDispatch();
    const whoami = useSelector(getWhoami);
    const toChange = useRef({});

    function updateStateFromProps() {
        if (props.user) {
            const newState = {
                ...props.user,
                userRiderResponsibilityId: props.user.riderResponsibility
                    ? props.user.riderResponsibility.id
                    : null,
            };
            setState(newState);
            oldState.current = newState;
        }
    }
    useEffect(updateStateFromProps, [props.user]);

    let header =
        props.user.id === whoami.id ? (
            <h2>My Profile.</h2>
        ) : (
            <h2>Profile for {state.displayName}</h2>
        );

    let editToggle = <></>;
    if (whoami.roles) {
        if (
            whoami.roles.includes(userRoles.admin) ||
            whoami.id === props.user.id
        ) {
            editToggle = (
                <EditModeToggleButton
                    tooltipDefault={
                        props.user.id === whoami.id
                            ? "Edit your profile"
                            : "Edit this user"
                    }
                    value={editMode}
                    onChange={(v) => {
                        setEditMode(v);
                        if (!v) setState(oldState.current);
                    }}
                />
            );
        }
    }

    function verifyUpdate(value) {
        const existing = props.displayNames.find(
            (u) => u.displayName === value.displayName
        );
        if (existing) {
            if (state.id !== existing.id) {
                dispatch(
                    displayErrorNotification("Display name is already in use.")
                );
                return false;
            }
        }
        return true;
    }

    const saveButtons = !editMode ? (
        <></>
    ) : (
        <SaveCancelButtons
            disabled={props.isPosting}
            onSave={() => {
                if (verifyUpdate(state)) {
                    props.onUpdate(toChange.current);
                    toChange.current = {};
                    setEditMode(false);
                    oldState.current = state;
                }
            }}
            onCancel={() => {
                setEditMode(false);
                setState(oldState.current);
            }}
        />
    );

    const responsibility =
        props.user &&
        props.user.roles &&
        props.user.roles.includes(userRoles.rider) ? (
            editMode ? (
                <RiderResponsibilitySelect
                    onSelect={async (value) => {
                        const riderResponsibility = await DataStore.query(
                            models.RiderResponsibility,
                            value
                        );
                        toChange.current = {
                            ...toChange.current,
                            riderResponsibility,
                            userRiderResponsibilityId: value,
                        };
                        setState((prevState) => ({
                            ...prevState,
                            userRiderResponsibilityId: value,
                            riderResponsibility,
                        }));
                    }}
                    value={state.userRiderResponsibilityId}
                />
            ) : (
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography>Responsibility</Typography>
                    <Typography>
                        {state.riderResponsibility
                            ? state.riderResponsibility.label
                            : "No responsibility"}
                    </Typography>
                </Stack>
            )
        ) : (
            <></>
        );

    return (
        <Stack direction={"column"} spacing={3}>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"top"}
                spacing={3}
            >
                {header}
                {editToggle}
            </Stack>
            <Divider />
            <Box sx={{ width: "100%" }}>
                {Object.keys(fields).map((key) => {
                    if (editMode) {
                        return (
                            <TextField
                                value={state[key]}
                                variant={"standard"}
                                fullWidth
                                label={fields[key]}
                                id={key}
                                onChange={(e) => {
                                    toChange.current = {
                                        ...toChange.current,
                                        [key]: e.target.value,
                                    };
                                    setState({
                                        ...state,
                                        [key]: e.target.value,
                                    });
                                }}
                            />
                        );
                    } else {
                        return (
                            <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                                key={key}
                            >
                                <Typography>{fields[key]}</Typography>
                                <Typography>{state[key]}</Typography>
                            </Stack>
                        );
                    }
                })}
            </Box>
            <Divider />
            <Box sx={{ width: "100%" }}>
                {Object.keys(state.contact ? contactFields : []).map((key) => {
                    if (editMode) {
                        return (
                            <TextField
                                key={key}
                                variant={"standard"}
                                value={state.contact[key]}
                                fullWidth
                                label={contactFields[key]}
                                id={key}
                                onChange={(e) => {
                                    toChange.current = {
                                        ...toChange.current,
                                        contact: {
                                            ...toChange.current.contact,
                                            [key]: e.target.value,
                                        },
                                    };
                                    setState({
                                        ...state,
                                        contact: {
                                            ...state.contact,
                                            [key]: e.target.value,
                                        },
                                    });
                                }}
                            />
                        );
                    } else {
                        return (
                            <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                                key={key}
                            >
                                <Typography>{contactFields[key]}</Typography>
                                <Typography>{state.contact[key]}</Typography>
                            </Stack>
                        );
                    }
                })}
            </Box>
            <Divider />
            <Stack direction={"row"} justifyContent={"space-between"}>
                {!editMode ? <Typography>Address</Typography> : <></>}
                <Box>
                    {Object.keys(state.contact ? addressFields : [])
                        .filter((k) => !!state.contact[k])
                        .map((key) => {
                            if (editMode) {
                                return (
                                    <TextField
                                        key={key}
                                        variant={"standard"}
                                        value={state.contact[key]}
                                        fullWidth
                                        label={addressFields[key]}
                                        id={key}
                                        onChange={(e) => {
                                            if (!toChange.current.contact) {
                                                toChange.current = {
                                                    ...toChange.current,
                                                    contact: {},
                                                };
                                            }
                                            toChange.current = {
                                                ...toChange.current,
                                                contact: {
                                                    ...toChange.current.contact,
                                                    [key]: e.target.value,
                                                },
                                            };
                                            setState({
                                                ...state,
                                                contact: {
                                                    ...state.contact,
                                                    [key]: e.target.value,
                                                },
                                            });
                                        }}
                                    />
                                );
                            } else {
                                return (
                                    <Typography align={"right"}>
                                        {state.contact[key]}
                                    </Typography>
                                );
                            }
                        })}
                </Box>
            </Stack>
            <Divider />
            {responsibility}
            {saveButtons}
        </Stack>
    );
}
