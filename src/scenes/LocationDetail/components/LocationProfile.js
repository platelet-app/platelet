import { Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EditModeToggleButton } from "../../../components/EditModeToggleButton";
import SaveCancelButtons from "../../../components/SaveCancelButtons";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import { getWhoami } from "../../../redux/Selectors";
import _ from "lodash";
import PropTypes from "prop-types";

const fields = {
    name: "Name",
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
        if (whoami.roles.includes("ADMIN")) {
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

    const header = (
        <Typography variant={"h4"}>Directory location: {state.name}</Typography>
    );

    const divider = editMode ? (
        <></>
    ) : (
        <div style={{ width: "80%" }}>
            <Grid item>
                <Divider />
            </Grid>
        </div>
    );

    return <>
        <Grid
            container
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"top"}
            spacing={3}
        >
            <Grid item>{header}</Grid>
            <Grid item>{editToggle}</Grid>
        </Grid>
        <Grid
            container
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"flex-start"}
            spacing={1}
        >
            {Object.keys(fields).map((key) => {
                return (
                    <Grid key={key} style={{ width: "50%" }} item>
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
                    </Grid>
                );
            })}
            {Object.keys(state.contact ? contactFields : []).map((key) => {
                return (
                    <Grid key={key} style={{ width: "50%" }} item>
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
                    </Grid>
                );
            })}
        </Grid>
        {saveButtons}
    </>;
}

LocationProfile.propTypes = {
    onUpdate: PropTypes.func,
    location: PropTypes.object,
};

LocationProfile.defaultProps = {
    onUpdate: () => {},
};

export default LocationProfile;
