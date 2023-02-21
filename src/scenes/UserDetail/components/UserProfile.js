import React, { useRef, useState } from "react";
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
import RiderResponsibilitySelect from "./RiderResponsibilitySelect";
import UserContactInformationDialog from "./UserContactInformationDialog";
import UserAddressInformationDialog from "./UserAddressInformationDialog";
import UserDisplayNameDialog from "./UserDisplayNameDialog";
import PropTypes from "prop-types";
import usePossibleRiderResponsibilities from "../../../hooks/usePossibleRiderResponsibilities";

const userFields = {
    name: "Name",
    displayName: "Display Name",
};

export const userContactFields = {
    emailAddress: "Email Address",
    telephoneNumber: "Telephone",
    mobileNumber: "Mobile",
};

export const userAddressFields = {
    line1: "Line 1",
    line2: "Line 2",
    line3: "Line 3",
    town: "Town",
    county: "County",
    country: "Country",
    postcode: "Postcode",
};

const dialogStates = {
    contact: "contact",
    address: "address",
    displayName: "displayName",
};

function UserProfile(props) {
    const [editRoleMode, setEditRoleMode] = useState(false);
    const [editResponsibilitiesMode, setEditResponsibilitiesMode] =
        useState(false);
    const [isPostingRoles, setIsPostingRoles] = useState(false);
    const [isPostingRiderResponsibilities, setIsPostingRiderResponsibilities] =
        useState(false);
    const [dialogState, setDialogState] = useState(null);
    const updateValues = useRef(null);
    const dispatch = useDispatch();
    const whoami = useSelector(getWhoami);
    const tenantId = useSelector(tenantIdSelector);
    //const networkStatus = useSelector(networkStatusSelector);
    const possibleRiderResponsibilitiesHook = usePossibleRiderResponsibilities(
        props.user.id
    );
    const possibleRiderResponsibilities =
        possibleRiderResponsibilitiesHook.state;

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    let header = (
        <Typography variant="h5" noWrap align={"right"}>
            {props.user.displayName}
        </Typography>
    );

    let editNameToggle = <></>;
    let editContactToggle = <></>;
    let editAddressToggle = <></>;
    let editRoleToggle = <></>;
    let editPossibleResponsibilitiesToggle = <></>;

    if (whoami.roles) {
        if (
            whoami.roles.includes(userRoles.admin) ||
            whoami.id === props.user.id
        ) {
            editNameToggle = (
                <EditModeToggleButton
                    aria-label="Edit Display Name"
                    value={dialogState === dialogStates.displayName}
                    onChange={(v) => {
                        if (v) setDialogState(dialogStates.displayName);
                    }}
                />
            );

            editContactToggle = (
                <EditModeToggleButton
                    aria-label="Edit Contact Information"
                    value={dialogStates === dialogStates.contact}
                    onChange={(v) => {
                        if (v) setDialogState(dialogStates.contact);
                    }}
                />
            );

            editAddressToggle = (
                <EditModeToggleButton
                    aria-label="Edit Address Information"
                    value={dialogStates === dialogStates.address}
                    onChange={(v) => {
                        if (v) setDialogState(dialogStates.address);
                    }}
                />
            );

            editRoleToggle = (
                <EditModeToggleButton
                    value={editRoleMode}
                    aria-label="Edit Roles"
                    onChange={(v) => {
                        setEditRoleMode(v);
                    }}
                />
            );
            editPossibleResponsibilitiesToggle = (
                <EditModeToggleButton
                    value={editResponsibilitiesMode}
                    aria-label="Edit Rider Roles"
                    onChange={() =>
                        setEditResponsibilitiesMode((prevState) => !prevState)
                    }
                />
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
                values={{
                    contact: { ...props.user.contact },
                    name: props.user.name,
                }}
                onChange={onChangeUpdateValues}
            />
        );
    } else if (dialogState === dialogStates.address) {
        dialogContents = (
            <UserAddressInformationDialog
                values={props.user.contact}
                onChange={onChangeUpdateValues}
            />
        );
    } else if (dialogState === dialogStates.displayName) {
        dialogContents = (
            <UserDisplayNameDialog
                values={{ displayName: props.user.displayName }}
                onChange={onChangeUpdateValues}
            />
        );
    }

    async function onUpdateRoles(roles) {
        setIsPostingRoles(true);
        if (roles) {
            await API.graphql(
                graphqlOperation(mutations.updateUserRoles, {
                    userId: props.user.id,
                    roles,
                })
            );
        }
        setIsPostingRoles(false);
    }

    async function onSelectRole(role) {
        try {
            if (props.user.roles.includes(role)) {
                const result = props.user.roles.filter((r) => r !== role);
                await onUpdateRoles(result);
                props.quickUpdateRolesState(result);
            } else {
                const result = [...props.user.roles, role];
                await onUpdateRoles(result);
                props.quickUpdateRolesState(result);
            }
        } catch (e) {
            console.log(e);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
            setIsPostingRoles(false);
        }
    }

    async function verifyUpdate(value) {
        if (!value) return false;
        if (value.displayName) {
            const users = await DataStore.query(models.User);
            const displayNames = users.map((u) => ({
                displayName: u.displayName,
                id: u.id,
            }));
            const existing = displayNames.find(
                (u) => u.displayName === value.displayName
            );
            if (existing) {
                if (props.user.id !== existing.id) {
                    dispatch(
                        displayErrorNotification(
                            "Sorry, that display name is already taken"
                        )
                    );
                    console.log("display name taken");
                    return false;
                }
            }
        }
        return true;
    }

    async function onChangePossibleResponsibilities(value) {
        if (value && tenantId) {
            setIsPostingRiderResponsibilities(true);
            try {
                const riderResponsibility = await DataStore.query(
                    models.RiderResponsibility,
                    value.id
                );
                const currentRiderResponsibilities = await DataStore.query(
                    models.PossibleRiderResponsibilities
                );
                const existingUser = await DataStore.query(
                    models.User,
                    props.user.id
                );
                const existing = currentRiderResponsibilities.filter((resp) => {
                    return (
                        resp.user &&
                        resp.user.id &&
                        props.user.id === resp.user.id
                    );
                });
                const existingResps = existing.map(
                    (r) => r.riderResponsibility
                );
                if (existing.length === 0) {
                    await DataStore.save(
                        new models.PossibleRiderResponsibilities({
                            tenantId,
                            riderResponsibility,
                            user: existingUser,
                        })
                    );
                } else {
                    const isSet = existingResps.some(
                        (r) => r.id === riderResponsibility.id
                    );
                    if (isSet) {
                        const toDelete = existing.filter(
                            (r) =>
                                r.riderResponsibility.id ===
                                riderResponsibility.id
                        );
                        for (const r of toDelete) {
                            await DataStore.delete(r);
                        }
                        if (
                            existingUser.riderResponsibility ===
                            riderResponsibility.label
                        ) {
                            await DataStore.save(
                                models.User.copyOf(existingUser, (updated) => {
                                    updated.riderResponsibility = null;
                                })
                            );
                        }
                    } else {
                        await DataStore.save(
                            new models.PossibleRiderResponsibilities({
                                tenantId,
                                riderResponsibility,
                                user: existingUser,
                            })
                        );
                    }
                }
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

    const isRider =
        props.user.roles && props.user.roles.includes(userRoles.rider);

    async function onUpdate() {
        if (updateValues.current) {
            try {
                const existingUser = await DataStore.query(
                    models.User,
                    props.user.id
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
                dispatch(
                    displayErrorNotification("Sorry, something went wrong")
                );
            }
        }
    }

    const onCancelDialog = () => {
        setDialogState(null);
        updateValues.current = null;
    };

    const onConfirmation = () => {
        verifyUpdate(updateValues.current).then((verify) => {
            if (verify) {
                onUpdate();
            }
        });
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
            onCancel={onCancelDialog}
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
            {props.user.contact && (
                <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"top"}
                    spacing={3}
                >
                    <Typography fontWeight="bold">
                        Contact Information
                    </Typography>

                    {editContactToggle}
                </Stack>
            )}
            <Box sx={{ width: "100%" }}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography>{userFields.name}</Typography>
                    <Typography>{props.user.name}</Typography>
                </Stack>
                {Object.keys(props.user.contact ? userContactFields : []).map(
                    (key) => {
                        return (
                            <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                                key={key}
                            >
                                <Typography>
                                    {userContactFields[key]}
                                </Typography>
                                <Typography>
                                    {props.user.contact[key]}
                                </Typography>
                            </Stack>
                        );
                    }
                )}
            </Box>
            <Divider />
            {props.user.contact && (
                <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"top"}
                    spacing={3}
                >
                    <Typography fontWeight="bold">Address</Typography>

                    {editAddressToggle}
                </Stack>
            )}
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Box sx={{ width: "100%" }}>
                    {Object.keys(
                        props.user.contact ? userAddressFields : []
                    ).map((key) => (
                        <Typography key={key}>
                            {props.user.contact[key]}
                        </Typography>
                    ))}
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
                        {(possibleRiderResponsibilities &&
                            possibleRiderResponsibilities.length > 0) ||
                        editResponsibilitiesMode ? (
                            <RiderResponsibilitySelect
                                editMode={editResponsibilitiesMode}
                                onSelect={onChangePossibleResponsibilities}
                                value={possibleRiderResponsibilities}
                                disabled={isPostingRiderResponsibilities}
                            />
                        ) : (
                            <Typography>No rider roles.</Typography>
                        )}
                        {editPossibleResponsibilitiesToggle}
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
                    value={props.user.roles}
                    isPrimaryAdmin={props.user.isPrimaryAdmin === 1}
                />

                {editRoleToggle}
            </Stack>
        </Stack>
    );
}

UserProfile.propTypes = {
    user: PropTypes.object.isRequired,
    possibleRiderResponsibilities: PropTypes.array,
    quickUpdateRolesState: PropTypes.func,
};

UserProfile.defaultProps = {
    possibleRiderResponsibilities: [],
    quickUpdateRolesState: () => {},
};

export default UserProfile;
