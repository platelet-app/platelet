import React, { useEffect, useRef, useState } from "react";
import { updateVehicleRequest } from "../../../redux/vehicles/VehiclesActions";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import { createPostingSelector } from "../../../redux/LoadingSelectors";
import UsersSelect from "../../../components/UsersSelect";
import { PaddedPaper } from "../../../styles/common";
import EditIcon from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import SaveCancelButtons from "../../../components/SaveCancelButtons";
import { getWhoami } from "../../../redux/Selectors";

const fields = {
    name: "Name",
    manufacturer: "Manufacturer",
    model: "Model",
    dateOfManufacture: "Manufacture date",
    dateOfRegistration: "Registration date",
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
        <Grid
            container
            direction={"column"}
            justify={"flex-start"}
            alignItems={"flex-start"}
            spacing={4}
        >
            <Grid item>
                <PaddedPaper width={"600px"}>
                    <Grid
                        container
                        direction={"column"}
                        justify={"flex-start"}
                        spacing={3}
                    >
                        <Grid item>
                            <Grid
                                container
                                direction={"row"}
                                justify={"space-between"}
                                alignItems={"flex-end"}
                                spacing={3}
                            >
                                <Grid item>{header}</Grid>
                                <Grid item>{editToggle}</Grid>
                            </Grid>
                        </Grid>

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

                        <Grid
                            container
                            direction={"row"}
                            justify={"space-between"}
                            alignItems={"flex-end"}
                            spacing={3}
                        >
                            <Grid item>{userAssign}</Grid>
                        </Grid>
                        <Grid item>{saveButtons}</Grid>
                    </Grid>
                </PaddedPaper>
            </Grid>
        </Grid>
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
