import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import { createPostingSelector } from "../../../redux/LoadingSelectors";
import UsersSelect from "../../../components/UsersSelect";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import SaveCancelButtons from "../../../components/SaveCancelButtons";
import { getWhoami } from "../../../redux/Selectors";
import { Stack, TextField, Typography } from "@mui/material";

const fields = {
    name: "Name",
    manufacturer: "Manufacturer",
    model: "Model",
};

function VehicleProfile(props) {
    const postingSelector = createPostingSelector(["UPDATE_VEHICLE"]);
    const isPosting = useSelector((state) => postingSelector(state));
    const [editMode, setEditMode] = useState(false);
    const [state, setState] = useState({ ...props.vehicle });
    const [oldState, setOldState] = useState({ ...props.vehicle });
    const whoami = useSelector(getWhoami);

    function resetAfterPost() {
        if (!isPosting && editMode) {
            setEditMode(false);
        }
    }
    useEffect(resetAfterPost, [isPosting]);

    function copyVehicleToState() {
        setState({ ...props.vehicle });
        setOldState({ ...props.vehicle });
    }
    useEffect(copyVehicleToState, [props.vehicle]);

    function onAssignUser(selectedUser) {
        if (selectedUser)
            setState({
                ...state,
                assigned_user_uuid: selectedUser.uuid,
                assigned_user: selectedUser,
            });
        //dispatch(updateVehicle({vehicleUUID: state.uuid, payload: {assigned_user: selectedUser}}));
    }

    const userAssign = editMode ? (
        <UsersSelect
            roles={["rider"]}
            label={"Assign this vehicle to a user."}
            onSelect={onAssignUser}
        />
    ) : (
        <></>
    );
    let editToggle = <></>;
    if (whoami.roles && whoami.roles.includes("ADMIN")) {
        editToggle = editMode ? (
            <IconButton
                color="inherit"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => {
                    setEditMode(!editMode);
                    setState(oldState);
                }}
                size="large"
            >
                <EditIcon />
            </IconButton>
        ) : (
            <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => {
                    setEditMode(!editMode);
                }}
                size="large"
            >
                <EditIcon />
            </IconButton>
        );
    }

    let header = (
        <h2>{props.vehicle.name ? props.vehicle.name : "No name"}.</h2>
    );

    const saveButtons = !editMode ? (
        <></>
    ) : (
        <SaveCancelButtons
            disabled={isPosting}
            onSave={() => {
                props.onUpdate(state);
                setOldState(state);
                setEditMode(false);
            }}
            onCancel={() => {
                setEditMode(false);
                setState(oldState);
            }}
        />
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
        <Stack spacing={3} direction={"column"}>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                spacing={3}
            >
                {header}
                {editToggle}
            </Stack>
            <Divider />

            <Stack>
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
                                <Typography>{fields[key]}</Typography>
                                <Typography>{state[key]}</Typography>
                            </Stack>
                        );
                    }
                })}
            </Stack>

            {saveButtons}
        </Stack>
    );
}

VehicleProfile.propTypes = {
    onUpdate: PropTypes.func,
    location: PropTypes.object,
};

VehicleProfile.defaultProps = {
    onUpdate: () => {},
};

export default VehicleProfile;
