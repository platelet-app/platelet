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
import { Box, Stack, Typography, Chip, Grid, useMediaQuery } from "@mui/material";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import UserRolesAndSelector from "./UserRolesAndSelector";
import PrioritySelect from "../../Task/components/PrioritySelect";
import { useTheme } from "@mui/styles";
import {
    TextFieldUncontrolled,
    TextFieldControlled,
} from "../../../components/TextFields";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

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
    const [oldState, setOldState] = useState({ ...props.user });
    const dispatch = useDispatch();
    const whoami = useSelector(getWhoami);
    const toChange = useRef({});
    
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
                            ? "Edit your profile"
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
                            ? "Edit your profile"
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
                            ? "Edit your profile"
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
                <EditModeToggleButton
                    tooltipDefault={
                        props.user.id === whoami.id
                            ? "Edit your role"
                            : "Edit this user"
                    }
                    value={editRoleMode}
                    onChange={(v) => {
                        setEditRoleMode(v);
                        if (!v) setState(oldState);
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

    const onConfirmation = ()=>{
      if(verifyUpdate(state)){
        props.onUpdate(toChange.current);
        toChange.current = {};
        setEditNameMode(false);
        setEditContactMode(false);
        setEditAddressMode(false);
        setEditRoleMode(false);
        setOldState(state);
      }
    }

    const onCancel = () => {
        setEditNameMode(false);
        setEditContactMode(false);
        setEditAddressMode(false);
        setEditRoleMode(false);
        setState(oldState);
    };

    const saveButtons = !editRoleMode ? (
        editRoleToggle
    ) : (
        <SaveCancelButtons
            disabled={props.isPosting}
            onSave={onConfirmation}
            onCancel={onCancel}
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

        
    //  const responsibility =
    //      props.user &&
    //      props.user.roles &&
    //      props.user.roles.includes(userRoles.rider) ? (
    //          editMode ? (
    //              <RiderResponsibilitySelect
    //                  onSelect={onChangePossibleResponsibilities}
    //                  value={state.possibleRiderResponsibilities}
    //              />
    //          ) : (
    //              <>
    //                  {state.possibleRiderResponsibilities && (
    //                      <Grid container direction={"row"} spacing={1}>
    //                          {state.possibleRiderResponsibilities.map((r) => (
    //                              <Grid item key={r.id}>
    //                                  <Chip label={r.label} />
    //                              </Grid>
    //                          ))}
    //                      </Grid>
    //                  )}
    //              </>
    //          )
    //      ) : (
    //          <></>
    //      );

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
            <Box sx={{ width: "100%" }}>
                {Object.keys(fields).map((key) => {
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
                    // }
                })}
            </Box>
            <Divider />
            {state.contact && (
                <Stack
                    direction={"row-reverse"}
                    justifyContent={"space-between"}
                    alignItems={"top"}
                    spacing={3}
                >
                    {editContactToggle}
                </Stack>
            )}
            <Box sx={{ width: "100%" }}>
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
                    direction={"row-reverse"}
                    justifyContent={"space-between"}
                    alignItems={"top"}
                    spacing={3}
                >
                    {editAddressToggle}
                </Stack>
            )}
            <Stack direction={"row"} justifyContent={"space-between"}>
                {state.contact ? <Typography>Address</Typography> : <></>}
                <Box>
                    {Object.keys(state.contact ? addressFields : []).map(
                        (key) => (
                            <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                                key={key}
                            >
                                <Typography>{contactFields[key]}</Typography>
                                <Typography align={"right"}>
                                    {state.contact[key]}
                                </Typography>
                            </Stack>
                        )
                    )}
                </Box>
            </Stack>
            <ConfirmationDialog
                fullScreen={isSm}
                dialogTitle="Edit Name"
                open={editNameMode}
                onConfirmation={onConfirmation}
                onCancel={onCancel}
            >
                <Stack
                    sx={{ width: "100%", minWidth: isSm ? 0 : 400 }}
                    spacing={1}
                >
                    {Object.entries(fields).map(([key, label]) => {
                        return (
                            <TextField
                                key={key}
                                fullWidth
                                aria-label={label}
                                label={fields[key]}
                                margin="normal"
                                value={state[key]}
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
                    })}
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
                    {Object.keys(state.contact ? contactFields : []).map(
                        (key) => {
                            return (
                                <TextFieldControlled
                                    key={key}
                                    variant={"standard"}
                                    tel={key === "telephoneNumber"}
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
                        }
                    )}
                </Stack>
            </ConfirmationDialog>
            <Divider />
            <Stack direction="row" spacing={1}>
                <UserRolesAndSelector
                    selectMode={editRoleMode}
                    onSelect={onSelectRole}
                    value={state.roles}
                />
                {saveButtons}
            </Stack>
        </Stack>
    );
}
