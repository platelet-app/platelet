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
import LabelItemPair from "../../../components/LabelItemPair";
import ClickableTextField from "../../../components/ClickableTextField";

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
    const [editMode, setEditMode] = useState(false);
    const whoami = useSelector(getWhoami);

    useEffect(() => {
      console.log(props)
        setState({ ...props.location });
        setOldState({ ...props.location });
    }, [props.location]);

    function verifyUpdate() {
        // TODO: verify name is unique
        return true;
    }

    async function handleUpdate(obj){
      obj.id = state.id;
      await props.onUpdate(obj);
      setEditMode(false);
      setOldState(state);
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
    
    return (
        <Stack direction={"column"} spacing={3}>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"top"}
                spacing={3}
            >
                    <ClickableTextField
                        label="Name"
                        disabled={!editMode}
                        onFinished={(v) => {
                            setState((prevState) => ({
                                ...prevState,
                                "name": v,
                            }));
                            handleUpdate({ ["name"]: v });
                        }}
                        value={state["name"]}
                    />
                {editToggle}
            </Stack>
            <Divider />
            <Box sx={{ width: "100%" }}>
                {Object.entries(fields).map(([key, label]) => {
                    return (
                        <LabelItemPair key={key} label={label}>
                            <ClickableTextField
                                label={label}
                                disabled={!editMode}
                                onFinished={(v) => {
                                    setState((prevState) => ({
                                        ...prevState,
                                        [key]: v,
                                    }));
                                    handleUpdate({ [key]: v });
                                }}
                                value={state[key]}
                            />
                        </LabelItemPair>
                    );
                })}
            </Box>
            <Divider />
            <Box sx={{ width: "100%" }}>
                {Object.entries(contactFields).map(([key, label]) => {
                    return (
                        <LabelItemPair key={key} label={label}>
                            <ClickableTextField
                                label={label}
                                disabled={!editMode}
                                onFinished={(v) => {
                                    setState((prevState) => ({
                                        ...prevState,
                                        contact: {
                                            ...prevState.contact,
                                            [key]: v,
                                        },
                                    }));
                                    handleUpdate({ contact: { [key]: v } });
                                }}
                                value={state.contact[key]}
                            />
                        </LabelItemPair>
                    );
                })}
            </Box>
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
