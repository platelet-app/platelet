import React, {useEffect, useRef, useState} from 'react';
import {
    getVehicle,
    updateVehicle,
    updateVehicleManufacturer,
    updateVehicleModel,
    updateVehicleName, updateVehicleRegistration
} from "../redux/vehicles/Actions";
import {decodeUUID} from "../utilities";
import {useDispatch, useSelector} from "react-redux";
import {TextFieldControlled} from "../components/TextFieldControlled";
import {createErrorMessageSelector, createLoadingSelector} from "../redux/selectors";
import FormSkeleton from "../loadingComponents/FormSkeleton";
import UsersSelect from "../components/UsersSelect";
import {PaddedPaper} from "../css/common";
import EditIcon from '@material-ui/icons/Edit';
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import {setMenuIndex} from "../redux/Actions";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";


function VehicleDetail(props) {
    const dispatch = useDispatch();
    const loadingSelector = createLoadingSelector(["GET_VEHICLE"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const errorSelector = createErrorMessageSelector(["GET_VEHICLE"]);
    const erroring = useSelector(state => errorSelector(state));
    const [editMode, setEditMode] = useState(false);
    const [assignedUserDisplayName, setAssignedUserDisplayName] = useState(undefined);
    const vehicle = useSelector(state => state.vehicle);
    const assignedUser = useSelector(state => state.vehicle.assigned_user);
    const vehicleName = useSelector(state => state.vehicle.name);
    const whoami = useSelector(state => state.whoami);

    console.log(erroring)
    function componentDidMount() {
        dispatch(getVehicle(decodeUUID(props.match.params.vehicle_uuid_b62)));
    }

    useEffect(componentDidMount, [props.location.key]);
    useEffect(() => {
        dispatch(setMenuIndex(4))
    }, []);

    function onAssignUser(selectedUser) {
        if (selectedUser)
            dispatch(updateVehicle({vehicleUUID: vehicle.uuid, payload: {assigned_user: selectedUser}}));
    }

    const userAssign = editMode ?
        <UsersSelect label={"Assign this vehicle to a user."} onSelect={onAssignUser}/> : <></>;
    let editToggle = <></>;
    if (whoami.roles.includes("admin")) {
        editToggle = editMode ?
            <IconButton
                color="inherit"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => {
                    setEditMode(!editMode);
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
        <h2>{vehicle.name ? vehicle.name : "No name"} assigned to {assignedUserDisplayName}.</h2> :
        <h2>{vehicle.name ? vehicle.name : "No name"} assigned to nobody.</h2>;

    useEffect(() => {
        if (assignedUser)
            setAssignedUserDisplayName(assignedUser.uuid === whoami.uuid ? "you" : assignedUser.display_name)
        else
            setAssignedUserDisplayName("")
    }, [assignedUser, vehicleName]);


    const divider =  editMode ? <></> : <div style={{width: "600px"}}><Grid item><Divider/></Grid></div>;
    const assignToMeButton = editMode ? <Button disabled={assignedUser.uuid === whoami.uuid} onClick={() => onAssignUser(whoami)}>Assign to Me</Button> : <></>;

    if (isFetching) {
        return (
            <FormSkeleton/>
        )
    } else {
        return (
            <PaddedPaper>
                <Grid container direction={"column"} justify={"flex-start"} spacing={3}>
                    <Grid item>
                        <Grid container direction={"row"} justify={"space-between"} alignItems={"flex-end"} spacing={3}>
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
                            <Grid container direction={"column"} justify={"flex-start"} alignItems={"flex-start"}
                                  spacing={1}>
                                <Grid item>
                                    <TextFieldControlled
                                        value={vehicle.name}
                                        label={"Name"}
                                        id={"vehicle-name"}
                                        readOnly={!editMode}
                                        onChange={(e) => {
                                            const payload = {name: e.target.value};
                                            const vehicleUUID = vehicle.uuid;
                                            dispatch(updateVehicleName({vehicleUUID, payload}))
                                        }}/>
                                </Grid>
                                {divider}
                                <Grid item>
                                    <TextFieldControlled
                                        value={vehicle.manufacturer}
                                        label={"Manufacturer"}
                                        id={"vehicle-manufacturer"}
                                        readOnly={!editMode}
                                        onChange={(e) => {
                                            const payload = {manufacturer: e.target.value};
                                            const vehicleUUID = vehicle.uuid;
                                            dispatch(updateVehicleManufacturer({vehicleUUID, payload}))
                                        }}/>
                                </Grid>
                                {divider}
                                <Grid item>
                                    <TextFieldControlled
                                        value={vehicle.model}
                                        label={"Model"}
                                        id={"vehicle-model"}
                                        readOnly={!editMode}
                                        onChange={(e) => {
                                            const payload = {model: e.target.value};
                                            const vehicleUUID = vehicle.uuid;
                                            dispatch(updateVehicleModel({vehicleUUID, payload}))
                                        }}/>
                                </Grid>
                                {divider}
                                <Grid item>
                                    <TextFieldControlled
                                        value={vehicle.registration_number}
                                        label={"Registration"}
                                        id={"vehicle-registration"}
                                        readOnly={!editMode}
                                        maxLength={10}
                                        forceUppercase={true}
                                        onChange={(e) => {
                                            const payload = {registration_number: e.target.value};
                                            const vehicleUUID = vehicle.uuid;
                                            dispatch(updateVehicleRegistration({vehicleUUID, payload}))
                                        }}/>
                                </Grid>
                                {divider}
                            </Grid>
                        </Grid>
                        <Grid container direction={"row"} justify={"space-between"} alignItems={"flex-end"} spacing={3}>
                            <Grid item>
                                {userAssign}
                            </Grid>
                            <Grid item>
                                {assignToMeButton}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </PaddedPaper>
        )
    }


}


export default VehicleDetail
