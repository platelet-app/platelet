import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import EditModeToggleButton from "../../../components/EditModeToggleButton";
import { getWhoami } from "../../../redux/Selectors";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { userRoles } from "../../../apiConsts";
import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import UserRolesAndSelector from "./UserRolesAndSelector";
import { useTheme } from "@mui/styles";
import {
    TextFieldControlled,
    TextFieldUncontrolled,
} from "../../../components/TextFields";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { API, graphqlOperation } from "aws-amplify";
import { tenantIdSelector } from "../../../redux/Selectors";
import { protectedFields } from "../../../apiConsts";
import * as mutations from "../../../graphql/mutations";
import { networkStatusSelector } from "../../../redux/Selectors";

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
    const [editNameMode, setEditNameMode] = useState(false);
    const [editContactMode, setEditContactMode] = useState(false);
    const [editAddressMode, setEditAddressMode] = useState(false);
    const [editRoleMode, setEditRoleMode] = useState(false);
    const [state, setState] = useState({ ...props.user });
    const [isPostingRoles, setIsPostingRoles] = useState(false);
    const [oldState, setOldState] = useState({ ...props.user });
    const dispatch = useDispatch();
    const whoami = useSelector(getWhoami);
    const tenantId = useSelector(tenantIdSelector);
    const networkStatus = useSelector(networkStatusSelector);

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    function updateStateFromProps() {
        if (props.user) {
            setState(props.user);
            setOldState(props.user);
        }
    }

    useEffect(updateStateFromProps, [props.user]);

    function updateRiderResponsibilitiesFromProps() {
        if (props.possibleRiderResponsibilities) {
            setState((prevState) => ({
                ...prevState,
                possibleRiderResponsibilities:
                    props.possibleRiderResponsibilities,
            }));
        }
    }

    useEffect(updateRiderResponsibilitiesFromProps, [
        props.possibleRiderResponsibilities,
    ]);

    let header = <h2>{oldState.displayName}</h2>;

    let editNameToggle = <></>;
    let editContactToggle = <></>;
    let editAddressToggle = <></>;
    let editRoleToggle = <></>;

    if (whoami.roles) {
        if (
            whoami.roles.includes(userRoles.admin) ||
            whoami.id === props.user.id
        ) {
            editNameToggle = (
                <EditModeToggleButton
                    tooltipDefault={
                        props.user.id === whoami.id
                            ? "Edit your display name"
                            : "Edit this user"
                    }
                    value={editNameMode}
                    onChange={(v) => {
                        setEditNameMode(v);
                        if (!v) setState(oldState.current);
                    }}
                />
            );

            editContactToggle = (
                <EditModeToggleButton
                    tooltipDefault={
                        props.user.id === whoami.id
                            ? "Edit your contact information"
                            : "Edit this user"
                    }
                    value={editContactMode}
                    onChange={(v) => {
                        setEditContactMode(v);
                        if (!v) setState(oldState);
                    }}
                />
            );

            editAddressToggle = (
                <EditModeToggleButton
                    tooltipDefault={
                        props.user.id === whoami.id
                            ? "Edit your address"
                            : "Edit this user"
                    }
                    value={editAddressMode}
                    onChange={(v) => {
                        setEditAddressMode(v);
                        if (!v) setState(oldState);
                    }}
                />
            );

            editRoleToggle = (
                <Stack
                    direction={"row"}
                    alignItems={"top"}
                    justifyContent={"space-between"}
                    spacing={1}
                >
                    <EditModeToggleButton
                        tooltipDefault={
                            !networkStatus
                                ? props.user.id === whoami.id
                                    ? "Edit your role (Warning: Offline status, changes may not register.)"
                                    : "Edit this user (Warning: Offline status, changes may not register.)"
                                : props.user.id === whoami.id
                                ? "Edit your role"
                                : "Edit this user"
                        }
                        value={editRoleMode}
                        onChange={(v) => {
                            if (v) {
                                setEditRoleMode(v);
                                setState(oldState);
                            } else {
                                onRoleConfirmation();
                            }
                        }}
                    />
                </Stack>
            );
        }
    }

    async function onUpdateRoles(roles) {
        setIsPostingRoles(true);
        if (roles) {
            await API.graphql(
                graphqlOperation(mutations.updateUserRoles, {
                    userId: state.id,
                    roles,
                })
            );
        }
        setIsPostingRoles(false);
    }

    async function onSelectRole(role) {
        try {
            if (state.roles.includes(role)) {
                const result = state.roles.filter((r) => r !== role);
                await onUpdateRoles(result);
                setState((prevState) => ({
                    ...prevState,
                    roles: result,
                }));
            } else {
                const result = [...state.roles, role];
                await onUpdateRoles(result);
                setState((prevState) => ({
                    ...prevState,
                    roles: result,
                }));
            }
        } catch (e) {
            console.log(e);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
            setIsPostingRoles(false);
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

    async function onUpdate() {
        try {
            const existingUser = await DataStore.query(models.User, state.id);
            const { roles, possibleRiderResponsibilities, contact, ...rest } =
                state;

            await DataStore.save(
                models.User.copyOf(existingUser, (updated) => {
                    for (const [key, newValue] of Object.entries(rest)) {
                        if (!protectedFields.includes(key))
                            updated[key] = newValue;
                    }
                    if (existingUser.contact && contact) {
                        for (const [key, newValue] of Object.entries(contact)) {
                            if (!protectedFields.includes(key))
                                updated.contact[key] = newValue;
                        }
                    }
                })
            );
            if (possibleRiderResponsibilities && tenantId) {
                DataStore.query(models.PossibleRiderResponsibilities).then(
                    (result) => {
                        const existing = result.filter(
                            (r) => r.user && r.user.id === existingUser.id
                        );
                        for (const i of existing) {
                            DataStore.delete(i);
                        }
                    }
                );
                await Promise.all(
                    possibleRiderResponsibilities.map((riderResponsibility) => {
                        return DataStore.save(
                            new models.PossibleRiderResponsibilities({
                                tenantId,
                                riderResponsibility,
                                user: existingUser,
                            })
                        );
                    })
                );
            }
        } catch (error) {
            console.log("Update request failed", error);
            dispatch(displayErrorNotification("Sorry, an error occurred"));
        }
    }

    const onConfirmation = () => {
        if (verifyUpdate(state)) {
            onUpdate(state);
            setEditNameMode(false);
            setEditContactMode(false);
            setEditAddressMode(false);
            setEditRoleMode(false);
            setOldState(state);
        }
    };

    const onRoleConfirmation = () => {
        if (verifyUpdate(state)) {
            onUpdate(state);
            setEditRoleMode(false);
            setOldState(state);
        }
    };

    const onCancel = () => {
        setEditNameMode(false);
        setEditContactMode(false);
        setEditAddressMode(false);
        setEditRoleMode(false);
        setState(oldState);
    };

    return (
        <Stack direction={"column"} spacing={3}>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"top"}
                spacing={3}
            >
                {header}
                {editNameToggle}
            </Stack>
            <Divider />
            {oldState.contact && (
                <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"top"}
                    spacing={3}
                >
                    <Typography>Contact Information</Typography>

                    {editContactToggle}
                </Stack>
            )}
            <Box sx={{ width: "100%" }}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography>{fields.name}</Typography>
                    <Typography>{oldState.name}</Typography>
                </Stack>
                {Object.keys(oldState.contact ? contactFields : []).map(
                    (key) => {
                        return (
                            <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                                key={key}
                            >
                                <Typography>{contactFields[key]}</Typography>
                                <Typography>{oldState.contact[key]}</Typography>
                            </Stack>
                        );
                    }
                )}
            </Box>
            <Divider />
            {oldState.contact && (
                <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"top"}
                    spacing={3}
                >
                    <Typography>Address</Typography>

                    {editAddressToggle}
                </Stack>
            )}
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Box sx={{ width: "100%" }}>
                    {Object.keys(oldState.contact ? addressFields : []).map(
                        (key) => (
                            <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                                key={key}
                            >
                                <Typography>{addressFields[key]}</Typography>
                                <Typography align={"right"}>
                                    {oldState.contact[key]}
                                </Typography>
                            </Stack>
                        )
                    )}
                </Box>
            </Stack>
            <ConfirmationDialog
                fullScreen={isSm}
                dialogTitle="Edit Display Name"
                open={editNameMode}
                onConfirmation={onConfirmation}
                onCancel={onCancel}
            >
                <Stack
                    sx={{ width: "100%", minWidth: isSm ? 0 : 400 }}
                    spacing={1}
                >
                    <TextField
                        key="displayname"
                        fullWidth
                        aria-label="displayName"
                        label={fields.displayName}
                        margin="normal"
                        value={state.displayName}
                        onChange={(e) => {
                            setState((prevState) => ({
                                ...prevState,
                                displayName: e.target.value,
                            }));
                        }}
                    />
                </Stack>
            </ConfirmationDialog>
            <ConfirmationDialog
                fullScreen={isSm}
                dialogTitle="Edit Contact Information"
                open={editContactMode}
                onCancel={onCancel}
                onConfirmation={onConfirmation}
            >
                <Stack
                    sx={{ width: "100%", minWidth: isSm ? 0 : 400 }}
                    spacing={1}
                >
                    <TextFieldControlled
                        key="name"
                        variant={"standard"}
                        fullWidth
                        aria-label="name"
                        label={fields.name}
                        margin="normal"
                        value={state.name}
                        onChange={(e) => {
                            setState((prevState) => ({
                                ...prevState,
                                name: e.target.value,
                            }));
                        }}
                    />
                    {Object.keys(state.contact ? contactFields : []).map(
                        (key) => {
                            return (
                                <TextFieldUncontrolled
                                    key={key}
                                    variant={"standard"}
                                    tel={
                                        key === "telephoneNumber" ||
                                        key === "mobileNumber"
                                    }
                                    value={state.contact[key]}
                                    fullWidth
                                    label={contactFields[key]}
                                    id={key}
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
                        }
                    )}
                </Stack>
            </ConfirmationDialog>
            <ConfirmationDialog
                fullScreen={isSm}
                dialogTitle="Edit Address Information"
                open={editAddressMode}
                onCancel={onCancel}
                onConfirmation={onConfirmation}
            >
                <Stack
                    sx={{ width: "100%", minWidth: isSm ? 0 : 400 }}
                    spacing={1}
                >
                    {Object.keys(state.contact ? addressFields : []).map(
                        (key) => {
                            return (
                                <TextField
                                    key={key}
                                    variant={"standard"}
                                    value={state.contact[key]}
                                    fullWidth
                                    label={addressFields[key]}
                                    id={key}
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
                        }
                    )}
                </Stack>
            </ConfirmationDialog>
            <Divider />
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"top"}
                spacing={1}
            >
                <UserRolesAndSelector
                    disabled={isPostingRoles}
                    selectMode={editRoleMode}
                    onSelect={onSelectRole}
                    value={state.roles}
                />

                {editRoleToggle}
            </Stack>
        </Stack>
    );
}
