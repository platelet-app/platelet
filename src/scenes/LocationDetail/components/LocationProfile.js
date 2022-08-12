import {
    Box,
    Divider,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EditModeToggleButton from "../../../components/EditModeToggleButton";
import { getWhoami } from "../../../redux/Selectors";
import PropTypes from "prop-types";
import { userRoles } from "../../../apiConsts";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import LabelItemPair from "../../../components/LabelItemPair";
import { useTheme } from "@mui/styles";

import ConfirmationDialog from "../../../components/ConfirmationDialog";

export const locationFields = {
    ward: "Ward",
    line1: "Line 1",
    line2: "Line 2",
    line3: "Line 3",
    town: "Town",
    county: "County",
    country: "Country",
    state: "State",
    postcode: "Postcode",
    // what3words: "What 3 Words",
};

const contactFields = {
    name: "Name",
    emailAddress: "Email",
    telephoneNumber: "Telephone",
};

function LocationProfile(props) {
    const [state, setState] = useState({ ...props.location });
    const [oldState, setOldState] = useState({ ...props.location });
    const [editNameMode, setEditNameMode] = useState(false);
    const [editAddressMode, setEditAddressMode] = useState(false);
    const [editContactMode, setEditContactMode] = useState(false);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    const whoami = useSelector(getWhoami);

    useEffect(() => {
        setState({ ...props.location });
        setOldState({ ...props.location });
    }, [props.location]);

    function verifyUpdate() {
        // TODO: verify name is unique
        return true;
    }

    const onCancel = () => {
        setEditAddressMode(false);
        setEditContactMode(false);
        setEditNameMode(false);
        setState(oldState);
    };

    const onConfirmation = () => {
        props.onUpdate(state);
        setState(state);
        setOldState(state);
        setEditNameMode(false);
        setEditAddressMode(false);
        setEditContactMode(false);
    };

    let editNameToggle = <></>;
    if (whoami.roles) {
        if (whoami.roles.includes(userRoles.admin)) {
            editNameToggle = (
                <EditModeToggleButton
                    aria-label="Edit Location Name"
                    value={editNameMode}
                    onChange={(v) => {
                        setEditNameMode(v);
                        if (!v) setState(oldState);
                    }}
                />
            );
        }
    }

    let editAddressToggle = <></>;
    if (whoami.roles) {
        if (whoami.roles.includes(userRoles.admin)) {
            editAddressToggle = (
                <EditModeToggleButton
                    value={editAddressMode}
                    onChange={(v) => {
                        setEditAddressMode(v);
                        if (!v) setState(oldState);
                    }}
                />
            );
        }
    }

    let editContactToggle = <></>;
    if (whoami.roles) {
        if (whoami.roles.includes(userRoles.admin)) {
            editContactToggle = (
                <EditModeToggleButton
                    tooltipDefault={"Edit this contact"}
                    value={editContactMode}
                    onChange={(v) => {
                        setEditContactMode(v);
                        if (!v) setState(oldState);
                    }}
                />
            );
        }
    }

    const header = (
        <Typography variant="h5" noWrap align={"right"}>
            {oldState["name"]}
        </Typography>
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
            <Box sx={{ width: "100%" }}>
                <Stack
                    direction={"row-reverse"}
                    justifyContent={"space-between"}
                    alignItems={"top"}
                    spacing={3}
                >
                    {editAddressToggle}
                </Stack>
                {Object.entries(locationFields).map(([key, label]) => {
                    return (
                        <LabelItemPair key={key} label={label}>
                            <Typography noWrap align={"right"}>
                                {oldState[key]}
                            </Typography>
                        </LabelItemPair>
                    );
                })}
            </Box>
            {oldState.contact && (
                <>
                    <Divider />
                    <Stack
                        direction={"row-reverse"}
                        justifyContent={"space-between"}
                        alignItems={"top"}
                        spacing={1}
                    >
                        {editContactToggle}
                    </Stack>
                    <Box sx={{ width: "100%" }}>
                        {Object.entries(contactFields).map(([key, label]) => {
                            return (
                                <LabelItemPair key={key} label={label}>
                                    <Typography noWrap align={"right"}>
                                        {oldState.contact[key]}
                                    </Typography>
                                </LabelItemPair>
                            );
                        })}
                    </Box>
                </>
            )}
            <ConfirmationDialog
                fullScreen={isSm}
                dialogTitle="Edit Location Name"
                open={editNameMode}
                onCancel={onCancel}
                onConfirmation={onConfirmation}
            >
                <Stack
                    sx={{ width: "100%", minWidth: isSm ? 0 : 400 }}
                    spacing={1}
                >
                    {
                        <TextField
                            key={"Name"}
                            fullWidth
                            inputProps={{
                                "aria-label": "Name",
                            }}
                            label={"Name"}
                            margin="normal"
                            value={state["name"]}
                            onChange={(e) => {
                                const { value } = e.target;
                                setState((prevState) => ({
                                    ...prevState,
                                    name: value,
                                }));
                            }}
                        />
                    }
                </Stack>
            </ConfirmationDialog>
            <ConfirmationDialog
                fullScreen={isSm}
                dialogTitle="Edit Location Information"
                open={editAddressMode}
                onCancel={onCancel}
                onConfirmation={onConfirmation}
            >
                <Stack
                    sx={{ width: "100%", minWidth: isSm ? 0 : 400 }}
                    spacing={1}
                >
                    {Object.entries(locationFields).map(([key, label]) => {
                        return (
                            <TextField
                                key={key}
                                fullWidth
                                aria-label={label}
                                label={label}
                                margin="normal"
                                value={state[key]}
                                onChange={(e) => {
                                    setState((prevState) => ({
                                        ...prevState,
                                        [key]: e.target.value,
                                    }));
                                }}
                            />
                        );
                    })}
                </Stack>
            </ConfirmationDialog>
            {state.contact && (
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
                        {Object.entries(contactFields).map(([key, label]) => {
                            return (
                                <TextFieldUncontrolled
                                    tel={key === "telephoneNumber"}
                                    key={key}
                                    fullWidth
                                    aria-label={label}
                                    label={label}
                                    margin="normal"
                                    value={state.contact[key]}
                                    onChange={(e) => {
                                        const { value } = e.target;
                                        setState((prevState) => ({
                                            ...prevState,
                                            contact: {
                                                ...prevState.contact,
                                                [key]: value,
                                            },
                                        }));
                                    }}
                                />
                            );
                        })}
                    </Stack>
                </ConfirmationDialog>
            )}
        </Stack>
    );
}

LocationProfile.propTypes = {
    onUpdate: PropTypes.func,
    location: PropTypes.object.isRequired,
};

LocationProfile.defaultProps = {
    onUpdate: () => {},
};

export default LocationProfile;
