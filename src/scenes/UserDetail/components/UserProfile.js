import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import Divider from "@mui/material/Divider";
import SaveCancelButtons from "../../../components/SaveCancelButtons";
import { TextFieldUncontrolled } from "../../../components/TextFields";
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
    username: "Username",
    name: "Name",
    displayName: "Display Name",
};

const contactFields = {
    emailAddress: "Email Address",
    telephoneNumber: "Telephone",
    mobileNumber: "Mobile",
};

export default function UserProfile(props) {
    const [editMode, setEditMode] = useState(false);
    const [state, setState] = useState({ ...props.user });
    const oldState = useRef({ ...props.user });
    const dispatch = useDispatch();
    const whoami = useSelector(getWhoami);

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
                    props.onUpdate(state);
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
                        setState((prevState) => ({
                            ...prevState,
                            userRiderResponsibilityId: value,
                            riderResponsibility,
                        }));
                    }}
                    value={state.userRiderResponsibilityId}
                />
            ) : (
                <Typography>
                    {state.riderResponsibility
                        ? state.riderResponsibility.label
                        : "No responsibility"}
                </Typography>
            )
        ) : (
            <></>
        );

    const divider = editMode ? (
        <></>
    ) : (
        <div style={{ width: "460px" }}>
            <Grid item>
                <Divider />
            </Grid>
        </div>
    );
    return (
        <Stack direction="column">
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"top"}
                spacing={3}
            >
                {header}
                {editToggle}
            </Stack>
            <Stack
                direction={"column"}
                justifyContent={"space-between"}
                alignItems={"flex-start"}
                spacing={1}
            >
                {Object.keys(fields).map((key) => {
                    return (
                        <Box key={key} sx={{ width: "50%" }}>
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
                        </Box>
                    );
                })}
                {Object.keys(state.contact ? contactFields : []).map((key) => {
                    return (
                        <Box key={key} sx={{ width: "50%" }}>
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
                        </Box>
                    );
                })}
                {responsibility}
                {saveButtons}
            </Stack>
        </Stack>
    );
}
