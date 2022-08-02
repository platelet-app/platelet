import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Divider from "@mui/material/Divider";
import EditModeToggleButton from "../../../components/EditModeToggleButton";
import { getWhoami } from "../../../redux/Selectors";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { userRoles } from "../../../apiConsts";
import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import UserRolesAndSelector from "./UserRolesAndSelector";
import { useTheme } from "@mui/styles";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { API, graphqlOperation } from "aws-amplify";
import { tenantIdSelector } from "../../../redux/Selectors";
import { protectedFields } from "../../../apiConsts";
import * as mutations from "../../../graphql/mutations";
import { networkStatusSelector } from "../../../redux/Selectors";
import RiderResponsibilitySelect from "./RiderResponsibilitySelect";
import UserContactInformationDialog from "./UserContactInformationDialog";
import UserAddressInformationDialog from "./UserAddressInformationDialog";
import UserDisplayNameDialog from "./UserDisplayNameDialog";

const fields = {
    name: "Name",
    displayName: "Display Name",
};

const contactFields = {
    emailAddress: "Email Address",
    telephoneNumber: "Telephone",
    mobileNumber: "Mobile",
};

const dialogStates = {
    contact: "contact",
    address: "address",
    displayName: "displayName",
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
    const [editRoleMode, setEditRoleMode] = useState(false);
    const [editResponsibilitiesMode, setEditResponsibilitiesMode] =
        useState(false);
    const [state, setState] = useState({ ...props.user });
    const [isPostingRoles, setIsPostingRoles] = useState(false);
    const [isPostingRiderResponsibilities, setIsPostingRiderResponsibilities] =
        useState(false);
    const [dialogState, setDialogState] = useState(null);
    const updateValues = useRef(null);
    const dispatch = useDispatch();
    const whoami = useSelector(getWhoami);
    const tenantId = useSelector(tenantIdSelector);
    const networkStatus = useSelector(networkStatusSelector);

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        console.log(state.possibleRiderResponsibilities);
    }, [state.possibleRiderResponsibilities]);

    function updateStateFromProps() {
        if (props.user) {
            setState(props.user);
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

    let header = (
        <Typography variant="h5" noWrap align={"right"}>
            {state.displayName}
        </Typography>
    );

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
                    value={dialogState === dialogStates.displayName}
                    onChange={(v) => {
                        if (v) setDialogState(dialogStates.displayName);
                    }}
                />
            );

            editContactToggle = (
                <EditModeToggleButton
                    value={dialogStates === dialogStates.contact}
                    onChange={(v) => {
                        if (v) setDialogState(dialogStates.contact);
                    }}
                />
            );

            editAddressToggle = (
                <EditModeToggleButton
                    value={dialogStates === dialogStates.address}
                    onChange={(v) => {
                        if (v) setDialogState(dialogStates.address);
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
                        value={editRoleMode}
                        onChange={(v) => {
                            if (v) {
                                setEditRoleMode(v);
                            } else {
                                onRoleConfirmation();
                            }
                        }}
                    />
                </Stack>
            );
        }
    }

    const onChangeUpdateValues = (v) => {
        updateValues.current = v;
    };

    let dialogContents = null;
    if (dialogState === dialogStates.contact) {
        dialogContents = (
            <UserContactInformationDialog
                values={{ ...state.contact, name: state.name }}
                onChange={onChangeUpdateValues}
            />
        );
    } else if (dialogState === dialogStates.address) {
        dialogContents = (
            <UserAddressInformationDialog
                values={state.contact}
                onChange={onChangeUpdateValues}
            />
        );
    } else if (dialogState === dialogStates.displayName) {
        dialogContents = (
            <UserDisplayNameDialog
                values={{ displayName: state.displayName }}
                onChange={onChangeUpdateValues}
            />
        );
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

    async function onChangePossibleResponsibilities(value) {
        if (value && tenantId) {
            console.log("onChangePossibleResponsibilities", value);
            setIsPostingRiderResponsibilities(true);
            let possibleRiderResponsibilities = [];
            if (
                state.possibleRiderResponsibilities
                    .map((r) => r.label)
                    .includes(value.label)
            ) {
                possibleRiderResponsibilities =
                    state.possibleRiderResponsibilities.filter(
                        (r) => r.label !== value.label
                    );
            } else {
                possibleRiderResponsibilities = [
                    ...state.possibleRiderResponsibilities,
                    value,
                ];
            }

            try {
                const existingUser = await DataStore.query(
                    models.User,
                    state.id
                );
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
                setIsPostingRiderResponsibilities(false);
            } catch (e) {
                console.log(e);
                dispatch(
                    displayErrorNotification("Sorry, something went wrong")
                );
                setIsPostingRiderResponsibilities(false);
            }
        }
    }

    const isRider = state.roles && state.roles.includes(userRoles.rider);

    async function onUpdate() {
        if (updateValues.current) {
            try {
                const existingUser = await DataStore.query(
                    models.User,
                    state.id
                );
                const { roles, contact, ...rest } = updateValues.current;

                await DataStore.save(
                    models.User.copyOf(existingUser, (updated) => {
                        for (const [key, newValue] of Object.entries(rest)) {
                            if (!protectedFields.includes(key))
                                updated[key] = newValue;
                        }
                        if (existingUser.contact && contact) {
                            for (const [key, newValue] of Object.entries(
                                contact
                            )) {
                                if (!protectedFields.includes(key))
                                    updated.contact[key] = newValue;
                            }
                        }
                    })
                );
                setDialogState(null);
                updateValues.current = null;
            } catch (error) {
                console.log("Update request failed", error);
                dispatch(displayErrorNotification("Sorry, an error occurred"));
            }
        }
    }

    const onConfirmation = () => {
        if (verifyUpdate(state)) {
            onUpdate();
            setEditRoleMode(false);
        }
    };

    const onRoleConfirmation = () => {
        if (verifyUpdate(state)) {
            onUpdate(state);
            setEditRoleMode(false);
        }
    };

    let dialogTitle = null;
    if (dialogState === dialogStates.contact) {
        dialogTitle = "Edit Contact Information";
    } else if (dialogState === dialogStates.address) {
        dialogTitle = "Edit Address Information";
    } else if (dialogState === dialogStates.displayName) {
        dialogTitle = "Edit Display Name";
    }

    const dialog = (
        <ConfirmationDialog
            fullScreen={isSm}
            dialogTitle={dialogTitle}
            open={dialogState !== null}
            onCancel={() => setDialogState(null)}
            onConfirmation={onConfirmation}
        >
            {dialogContents}
        </ConfirmationDialog>
    );

    return (
        <Stack direction={"column"} spacing={3}>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                spacing={3}
            >
                {header}
                {editNameToggle}
            </Stack>
            <Divider />
            {state.contact && (
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
                    <Typography>{state.name}</Typography>
                </Stack>
                {Object.keys(state.contact ? contactFields : []).map((key) => {
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
                })}
            </Box>
            <Divider />
            {state.contact && (
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
                    {Object.keys(state.contact ? addressFields : []).map(
                        (key) => (
                            <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                                key={key}
                            >
                                <Typography>{addressFields[key]}</Typography>
                                <Typography align={"right"}>
                                    {state.contact[key]}
                                </Typography>
                            </Stack>
                        )
                    )}
                </Box>
            </Stack>
            {dialog}
            {isRider && (
                <>
                    <Divider />
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <RiderResponsibilitySelect
                            editMode={editResponsibilitiesMode}
                            onSelect={onChangePossibleResponsibilities}
                            value={state.possibleRiderResponsibilities}
                            disabled={isPostingRiderResponsibilities}
                        />
                        <EditModeToggleButton
                            value={editResponsibilitiesMode}
                            onChange={() =>
                                setEditResponsibilitiesMode(
                                    (prevState) => !prevState
                                )
                            }
                        />
                    </Stack>
                </>
            )}
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
