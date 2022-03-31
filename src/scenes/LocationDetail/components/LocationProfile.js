import { Box, Divider, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EditModeToggleButton from "../../../components/EditModeToggleButton";
import SaveCancelButtons from "../../../components/SaveCancelButtons";
import { getWhoami } from "../../../redux/Selectors";
import _ from "lodash";
import PropTypes from "prop-types";
import { userRoles } from "../../../apiConsts";
import { TextFieldUncontrolled } from "../../../components/TextFields";

const fields = {
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

function LocationProfile(props) {
    const [state, setState] = useState({ ...props.location });
    const [oldState, setOldState] = useState({ ...props.location });
    const [editMode, setEditMode] = useState(false);
    const whoami = useSelector(getWhoami);

    useEffect(() => {
        setState({ ...props.location });
        setOldState({ ...props.location });
    }, [props.location]);

    function verifyUpdate() {
        // TODO: verify name is unique
        return true;
    }
    const saveButtons = !editMode ? (
        <></>
    ) : (
        <SaveCancelButtons
            disabled={props.isPosting}
            onSave={async () => {
                if (verifyUpdate(state)) {
                    await props.onUpdate(
                        _.omit(
                            state,
                            "_deleted",
                            "_lastChangedAt",
                            "_version",
                            "createdAt",
                            "updatedAt"
                        )
                    );
                    setEditMode(false);
                    setOldState(state);
                }
            }}
            onCancel={() => {
                setEditMode(false);
                setState(oldState);
            }}
        />
    );

    let editToggle = <></>;
    if (whoami.roles) {
        if (whoami.roles.includes(userRoles.admin)) {
            editToggle = (
                <EditModeToggleButton
                    tooltipDefault={"Edit this location"}
                    value={editMode}
                    onChange={(v) => {
                        setEditMode(v);
                        if (!v) setState(oldState);
                    }}
                />
            );
        }
    }

    const header = editMode ? (
        <TextField
            value={state.name}
            variant={"standard"}
            fullWidth
            id={"edit-name"}
            onChange={(e) => {
                setState({
                    ...state,
                    name: e.target.value,
                });
            }}
        />
    ) : (
        <Typography variant={"h5"}>{state.name}</Typography>
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
                                key={key}
                                value={state[key]}
                                variant={"standard"}
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
                        );
                    } else {
                        return (
                            <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                                key={key}
                            >
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
                        if (key === "telephoneNumber") {
                            return (
                                <TextFieldUncontrolled
                                    key={key}
                                    value={state.contact[key]}
                                    variant={"standard"}
                                    fullWidth
                                    tel
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
                            );
                        } else {
                            return (
                                <TextField
                                    key={key}
                                    value={state.contact[key]}
                                    variant={"standard"}
                                    fullWidth
                                    tel={key === "telephoneNumber"}
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
                            );
                        }
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
            {saveButtons}
        </Stack>
    );
}

LocationProfile.propTypes = {
    onUpdate: PropTypes.func,
    location: PropTypes.object,
};

LocationProfile.defaultProps = {
    onUpdate: () => {},
};

export default LocationProfile;
