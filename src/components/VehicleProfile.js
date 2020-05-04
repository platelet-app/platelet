import React, {useEffect, useRef, useState} from 'react';
import {
    updateVehicle,
} from "../redux/vehicles/VehiclesActions";
import {useDispatch, useSelector} from "react-redux";
import {TextFieldUncontrolled} from "./TextFieldControlled";
import {createPostingSelector} from "../redux/selectors";
import UsersSelect from "./UsersSelect";
import {PaddedPaper} from "../css/common";
import EditIcon from '@material-ui/icons/Edit';
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import SaveCancelButtons from "./SaveCancelButtons";


export default function VehicleProfile(props) {
    const dispatch = useDispatch();
    const postingSelector = createPostingSelector(["UPDATE_VEHICLE"]);
    const isPosting = useSelector(state => postingSelector(state));
    const [editMode, setEditMode] = useState(false);
    const [assignedUserDisplayName, setAssignedUserDisplayName] = useState(undefined);
    const [state, setState] = useState({...props.vehicle})
    const [oldState, setOldState] = useState({...props.vehicle})
    const assignedUser = useSelector(state => state.vehicle.assigned_user);
    const vehicleName = useSelector(state => state.vehicle.name);
    const whoami = useSelector(state => state.whoami);

    function resetAfterPost() {
        if (!isPosting && editMode) {
            setEditMode(false)
        }
    }

    useEffect(resetAfterPost, [isPosting])

    function onAssignUser(selectedUser) {
        if (selectedUser)
            setState({...state, assigned_user_uuid: selectedUser.uuid, assigned_user: selectedUser})
            //dispatch(updateVehicle({vehicleUUID: state.uuid, payload: {assigned_user: selectedUser}}));
    }

    const userAssign = editMode ?
        <UsersSelect label={"Assign this vehicle to a user."} onSelect={onAssignUser}/> : <></>;
    let editToggle = <></>;
    if (whoami && whoami.roles.includes("admin")) {
        editToggle = editMode ?
            <IconButton
                color="inherit"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => {
                    setEditMode(!editMode);
                    setState(oldState);
                }}>
                <EditIcon/>
            </IconButton> :
            <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => {
                    setEditMode(!editMode);
                }}>
                <EditIcon/>
            </IconButton>;
    }

    let header = assignedUserDisplayName ?
        <h2>{props.vehicle.name ? props.vehicle.name : "No name"} assigned to {assignedUserDisplayName}.</h2> :
        <h2>{props.vehicle.name ? props.vehicle.name : "No name"} assigned to nobody.</h2>;

    useEffect(() => {
        if (assignedUser)
            setAssignedUserDisplayName(assignedUser.uuid === whoami.uuid ? "you" : assignedUser.display_name)
        else
            setAssignedUserDisplayName("")
    }, [assignedUser, vehicleName]);

    const saveButtons = !editMode ? <></> :
        <SaveCancelButtons
            disabled={isPosting}
            onSave={() => {
                console.log(state)
                dispatch(updateVehicle({vehicleUUID: state.uuid, payload: state}));
                setOldState(state);
            }}
            onCancel={() => {
                setEditMode(false);
                setState(oldState);
            }}
        />


    const divider = editMode ? <></> : <div style={{width: "460px"}}><Grid item><Divider/></Grid></div>;
    const assignToMeButton = editMode ?
        <Button disabled={state.assigned_user_uuid === whoami.uuid} onClick={() => {

            onAssignUser(whoami)
        }}>
            Assign to Me
        </Button> : <></>;

    return (
        <Grid container direction={"column"} justify={"flex-start"} alignItems={"flex-start"} spacing={4}>
            <Grid item>
                <PaddedPaper width={"600px"}>
                    <Grid container direction={"column"} justify={"flex-start"} spacing={3}>
                        <Grid item>
                            <Grid container direction={"row"} justify={"space-between"} alignItems={"flex-end"}
                                  spacing={3}>
                                <Grid item>
                                    {header}
                                </Grid>
                                <Grid item>
                                    {editToggle}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid item>
                                <Grid container direction={"column"} justify={"flex-start"}
                                      alignItems={"flex-start"}
                                      spacing={1}>
                                    <Grid item>
                                        <TextFieldUncontrolled
                                            value={state.name}
                                            label={"Name"}
                                            id={"vehicle-name"}
                                            readOnly={!editMode}
                                            onChange={(e) => {
                                                setState({...state, name: e.target.value})
                                            }}/>
                                    </Grid>
                                    {divider}
                                    <Grid item>
                                        <TextFieldUncontrolled
                                            value={state.manufacturer}
                                            label={"Manufacturer"}
                                            id={"vehicle-manufacturer"}
                                            readOnly={!editMode}
                                            onChange={(e) => {
                                                setState({...state, manufacturer: e.target.value})
                                            }}/>
                                    </Grid>
                                    {divider}
                                    <Grid item>
                                        <TextFieldUncontrolled
                                            value={state.model}
                                            label={"Model"}
                                            id={"vehicle-model"}
                                            readOnly={!editMode}
                                            onChange={(e) => {
                                                setState({...state, model: e.target.value})
                                            }}/>
                                    </Grid>
                                    {divider}
                                    <Grid item>
                                        <TextFieldUncontrolled
                                            value={state.registration_number}
                                            label={"Registration"}
                                            id={"vehicle-registration"}
                                            readOnly={!editMode}
                                            maxLength={10}
                                            forceUppercase={true}
                                            onChange={(e) => {
                                                setState({...state, registration_number: e.target.value})
                                            }}/>
                                    </Grid>
                                    {divider}
                                </Grid>
                            </Grid>
                            <Grid container direction={"row"} justify={"space-between"} alignItems={"flex-end"}
                                  spacing={3}>
                                <Grid item>
                                    {userAssign}
                                </Grid>
                                <Grid item>
                                    {assignToMeButton}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            {saveButtons}
                        </Grid>
                    </Grid>
                </PaddedPaper>
            </Grid>
        </Grid>
    )
}
