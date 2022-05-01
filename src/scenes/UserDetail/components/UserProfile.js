import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import SaveCancelButtons from "../../../components/SaveCancelButtons";
import EditModeToggleButton from "../../../components/EditModeToggleButton";
import { getWhoami } from "../../../redux/Selectors";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import RiderResponsibilitySelect from "./RiderResponsibilitySelect";
import { userRoles } from "../../../apiConsts";
import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import UserRolesAndSelector from "./UserRolesAndSelector";

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
            setState(props.user);
            oldState.current = props.user;
        }
    }
    useEffect(updateStateFromProps, [props.user]);

    function updateRiderResponsibilitiesFromProps() {
        if (props.possibleRiderResponsibilities) {
            setState({
                ...state,
                possibleRiderResponsibilities:
                    props.possibleRiderResponsibilities,
            });
        }
    }

    useEffect(updateRiderResponsibilitiesFromProps, [
        props.possibleRiderResponsibilities,
    ]);

    let header = <h2>{state.displayName}</h2>;

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

    function onSelectRole(role) {
        if (state.roles.includes(role)) {
            const result = state.roles.filter((r) => r !== role);
            toChange.current.roles = result;
            setState({
                ...state,
                roles: result,
            });
        } else {
            const result = [...state.roles, role];
            toChange.current.roles = result;
            setState({
                ...state,
                roles: result,
            });
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

    function onChangePossibleResponsibilities(value) {
        if (!toChange.current.possibleRiderResponsibilities) {
            toChange.current.possibleRiderResponsibilities =
                state.possibleRiderResponsibilities;
        }
        if (
            state.possibleRiderResponsibilities
                .map((r) => r.id)
                .includes(value.id)
        ) {
            toChange.current = {
                ...toChange.current,
                possibleRiderResponsibilities:
                    toChange.current.possibleRiderResponsibilities.filter(
                        (r) => r.id !== value.id
                    ),
            };
            setState((prevState) => ({
                ...prevState,
                possibleRiderResponsibilities:
                    prevState.possibleRiderResponsibilities.filter(
                        (r) => r.id !== value.id
                    ),
            }));
        } else {
            toChange.current = {
                ...toChange.current,
                possibleRiderResponsibilities: [
                    ...toChange.current.possibleRiderResponsibilities,
                    value,
                ],
            };
            setState((prevState) => ({
                ...prevState,
                possibleRiderResponsibilities: [
                    ...state.possibleRiderResponsibilities,
                    value,
                ],
            }));
        }
    }

    const responsibility =
        props.user &&
        props.user.roles &&
        props.user.roles.includes(userRoles.rider) ? (
            editMode ? (
                <RiderResponsibilitySelect
                    onSelect={onChangePossibleResponsibilities}
                    value={state.possibleRiderResponsibilities}
                />
            ) : (
                <>
                    {state.possibleRiderResponsibilities && (
                        <Grid container direction={"row"} spacing={1}>
                            {state.possibleRiderResponsibilities.map((r) => (
                                <Grid item key={r.id}>
                                    <Chip label={r.label} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
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
                {!editMode && state.contact ? (
                    <Typography>Address</Typography>
                ) : (
                    <></>
                )}
                <Box>
                    {Object.keys(state.contact ? addressFields : []).map(
                        (key) => {
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
                        }
                    )}
                </Box>
            </Stack>
            <Divider />
            {responsibility}
            <Divider />
            <UserRolesAndSelector
                selectMode={editMode}
                onSelect={onSelectRole}
                value={state.roles}
            />
            {saveButtons}
        </Stack>
    );
}
