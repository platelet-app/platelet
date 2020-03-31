import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from "@material-ui/core/Grid";
import {useHistory} from "react-router-dom";
import AddressDetailsCollapsible from "./AddressDetail";
import UsersSelect from "./UsersSelect";
import ToggleTimeStamp from "./ToggleTimeStamp";
import moment from 'moment/min/moment-with-locales';
import Moment from "react-moment";
import PrioritySelect from "./PrioritySelect";
import DeliverableGridSelect from "./DeliverableGridSelect";
import DeliverableInformation from "./DeliverableInformation";
import {
    updateTask,
    getAllTasks,
    updateTaskPickupTime,
    updateTaskPriority,
    updateTaskAssignedRider,
    updateTaskContactName,
    updateTaskContactNumber,
    updateTaskDropoffAddress,
    updateTaskDropoffTime,
    updateTaskPickupAddress, updateTaskCancelledTime
} from "../redux/Actions";
import {connect, useDispatch, useSelector} from "react-redux"
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {TextFieldControlled} from "./TextFieldControlled";
import {decodeUUID} from "../utilities";
import {createLoadingSelector} from "../redux/selectors";
import FormSkeleton from "../loadingComponents/FormSkeleton";
import {DateAndTimePicker} from "./DateTimePickers";

export default function TaskModal(props) {
    const dispatch = useDispatch();
    // Leave this here in case app.js dispatchers haven't finished before the modal is opened
    const loadingSelector = createLoadingSelector([
        "GET_TASK",
        "GET_AVAILABLE_LOCATIONS",
        "GET_AVAILABLE_PRIORITIES",
        "GET_USERS",
        "GET_AVAILABLE_LOCATIONS"]);
    const isFetching = useSelector(state => loadingSelector(state));
    let useStyles;
    // TODO: Do this properly (withStyles)
    if (!props.fullscreen) {
        useStyles = makeStyles(({
            box: {
                border: 0,
                boxShadow: '0 3px 5px 2px rgba(100, 100, 100, .3)',
                borderColor: "cornflowerblue",
                borderRadius: 0,
                height: "100%",
                minWidth: "400px",
                background: "rgba(235, 235, 235, 0.7)",
                padding: "20px"
            },
        }));
    } else {
        useStyles = makeStyles(({
            box: {
                border: 0,
                boxShadow: '0 3px 5px 2px rgba(100, 100, 100, .3)',
                borderColor: "cornflowerblue",
                borderRadius: 0,
                height: "100%",
                minWidth: "400px",
                maxWidth: "400px",
                background: "rgba(235, 235, 235, 0.7)",
                padding: "20px"
            },
        }));
    }
    const classes = useStyles();

    const tasks = useSelector(state => state.tasks);

    let history = useHistory();

    let editMode = props.view === "edit";

    const taskUUID = decodeUUID(props.match.params.task_uuid_b62);

    const taskResult = tasks.filter(task => task.uuid === taskUUID);
    let newTask = {};
    if (taskResult.length === 1) {
        newTask = taskResult[0];
    }
    const task = props.task || newTask;

    function componentDidMount() {
        if (!tasks.length) {
            props.apiControl.tasks.getTask(taskUUID).then((data) => {
                dispatch(getAllTasks(data.session_uuid));
            });
        }
    }

    useEffect(componentDidMount, []);

    function onSelectContactNumber(event) {
        const payload = { contact_number: event.target.value };
        dispatch(updateTaskContactNumber({taskUUID, payload}));
    }

    function onSelectName(event) {
        const payload = { contact_name: event.target.value };
        dispatch(updateTaskContactName({taskUUID, payload}));
    }

    function onSelectPickup(pickupAddress) {
        if (pickupAddress) {
            const payload = {pickup_address: pickupAddress};
            dispatch(updateTaskPickupAddress({taskUUID, payload}));
        }
    }

    function onSelectDropoff(dropoffAddress) {
        if (dropoffAddress) {
            const payload = {dropoff_address: dropoffAddress};
            dispatch(updateTaskDropoffAddress({taskUUID, payload}));
        }
    }

    function onSelectRider(rider) {
        if (rider) {
            const payload = {patch_id: rider.patch_id, assigned_rider: rider.uuid, rider};
            dispatch(updateTaskAssignedRider({taskUUID, payload}))
        }
    }

    function onSelectPriority(priority_id, priority) {
        const payload = {priority_id, priority};
        dispatch(updateTaskPriority({ taskUUID, payload }));
    }

    function onSelectPickedUp(status) {
        const payload = {pickup_time: status ? moment.utc().toISOString() : null};
        dispatch(updateTaskPickupTime({ taskUUID, payload }));
    }

    function onSelectDroppedOff(status) {
        const payload = {dropoff_time: status ? moment.utc().toISOString() : null};
        dispatch(updateTaskDropoffTime({ taskUUID, payload }));
    }

    let handleClose = e => {
        e.stopPropagation();
        history.goBack();
    };

    let usersSelect = <></>;
    if (editMode) {
        usersSelect =
            <>
                <UsersSelect id="userSelect"
                             vehicleAssignedUsersFirst={true}
                             onSelect={onSelectRider}/>
                <DialogContentText>
                    {task.rider ? "Currently assigned to " + task.rider.display_name + "." : ""}
                </DialogContentText>
            </>;
    }
    let prioritySelect = <></>;
    if (!editMode) {
        prioritySelect = task.priority ? <>
            <DialogContentText>Priority {task.priority}</DialogContentText></> : ""

    } else {
        prioritySelect = <PrioritySelect priority={task.priority_id}
                                         onSelect={onSelectPriority}/>;
    }
    let pickupTimeNotice = <></>;
    if (task.pickup_time) {
        pickupTimeNotice = <>Picked up at <Moment format={"llll"}>{task.pickup_time}</Moment></>
    }
    let dropoffTimeNotice = <></>;
    if (task.dropoff_time) {
        dropoffTimeNotice = <>Dropped off at <Moment format={"llll"}>{task.dropoff_time}</Moment></>
    }
    let cancelledStatus = <></>
    if (task.cancelled_time) {
        cancelledStatus =
            <Box className={classes.box}>
                <DialogContentText>
                    Cancelled at <Moment format={"llll"}>{task.cancelled_time}</Moment>
                </DialogContentText>
                <ToggleTimeStamp label={"UNDO"} status={!!task.cancelled_time}
                                 onSelect={() => {
                                     const payload = {cancelled_time: null};
                                     dispatch(updateTaskCancelledTime({ taskUUID, payload }));
                                 }
                }/>
            </Box>
    }
    let rejectedStatus = <></>
    if (task.rejected_time) {
        rejectedStatus =
            <Box className={classes.box}>
                <DialogContentText>
                    Rejected at <Moment format={"llll"}>{task.rejected_time}</Moment>
                </DialogContentText>
                <ToggleTimeStamp label={"UNDO"} status={!!task.rejected_time}
                                 onSelect={() => {
                                     const payload = {rejected_time: null};
                                     dispatch(updateTaskCancelledTime({ taskUUID, payload }));
                                 }
                                 }/>
            </Box>
    }
    let deliverableSelect = <DeliverableInformation apiControl={props.apiControl} taskUUID={taskUUID}/>;
    if (editMode) {
        deliverableSelect = <><DialogContentText>
            Deliverables:
        </DialogContentText>
            <DeliverableGridSelect apiControl={props.apiControl}
                                   taskUUID={taskUUID}
                                   deliverables={task.deliverables ? task.deliverables : []}/>
        </>;
    }

    if (props.modal) {
        const modalContents = isFetching ?
            <div style={{width: "600px"}}>
                <DialogTitle id="form-dialog-title">
                    <Grid container
                          spacing={2}
                          direction={"column"}
                          justify={"flex-start"}
                          alignItems={"flex-start"}>
                        <Grid item>
                            {task.pickup_address ? "FROM: " + task.pickup_address.line1 + "." : ""}
                        </Grid>
                        <Grid item>
                            {task.dropoff_address ? "TO: " + task.dropoff_address.line1 + "." : ""}
                        </Grid>
                        <Grid item>
                            {task.rider ? "Assigned to: " + task.rider.display_name + "." : ""}
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <FormSkeleton/>
                </DialogContent>
            </div> :

            <>
                <DialogTitle id="form-dialog-title">
                    <Grid container
                          spacing={2}
                          direction={"column"}
                          justify={"flex-start"}
                          alignItems={"flex-start"}>
                        <Grid item>
                            {task.pickup_address ? "FROM: " + task.pickup_address.line1 + "." : ""}
                        </Grid>
                        <Grid item>
                            {task.dropoff_address ? "TO: " + task.dropoff_address.line1 + "." : ""}
                        </Grid>
                        <Grid item>
                            {task.rider ? "Assigned to: " + task.rider.display_name + "." : ""}
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <Grid container
                          spacing={3}
                          direction={"column"}
                          justify={"flex-start"}
                          alignItems={"flex-start"}>
                        <Grid item>
                            {rejectedStatus}
                        </Grid>
                        <Grid item>
                            {cancelledStatus}
                        </Grid>
                        <Grid item>
                            <Box className={classes.box}>
                                <TextFieldControlled
                                    value={task.contact_name}
                                    label={"Contact Name"}
                                    id={"contact-name"}
                                    onSelect={onSelectName}/>
                                <TextFieldControlled
                                    label={"Contact Number"}
                                    id={"contact-number"}
                                    value={task.contact_number}
                                    onSelect={onSelectContactNumber}/>
                            </Box>
                        </Grid>

                        <Grid item>
                            <Box className={classes.box}>
                                <DialogContentText>From:</DialogContentText>
                                <AddressDetailsCollapsible label={"Pickup Address"}
                                                           onSelect={onSelectPickup}
                                                           address={task.pickup_address}
                                                           disabled={!editMode}
                                />
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box className={classes.box}>
                                <DialogContentText>To:</DialogContentText>
                                <AddressDetailsCollapsible label={"Dropoff Address"}
                                                           onSelect={onSelectDropoff}
                                                           address={task.dropoff_address}
                                                           disabled={!editMode}/>
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box className={classes.box}>
                                <DialogContentText>Assigned rider:</DialogContentText>
                                {usersSelect}
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box className={classes.box}>
                                {prioritySelect}
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box className={classes.box}>
                                {deliverableSelect}
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box className={classes.box}>
                                <ToggleTimeStamp label={"Picked Up"} status={!!task.pickup_time}
                                                 onSelect={onSelectPickedUp}/>
                                <DateAndTimePicker visible={!!task.pickup_time} value={task.pickup_time} label={"Pickup Time"} onChange={(pickup_time) => {
                                    const payload = {pickup_time};
                                    dispatch(updateTaskPickupTime({taskUUID, payload}))
                                }
                                }/>
                                <DialogContentText>
                                    {pickupTimeNotice}
                                </DialogContentText>
                            </Box>
                        </Grid>
                        <Grid item>
                            <Box className={classes.box}>
                                <ToggleTimeStamp label={"Dropped Off"} status={!!task.dropoff_time}
                                                 onSelect={onSelectDroppedOff}/>
                                <DateAndTimePicker visible={!!task.dropoff_time} value={task.dropoff_time} label={"Dropoff Time"} onChange={(dropoff_time) => {
                                    const payload = {dropoff_time};
                                    dispatch(updateTaskDropoffTime({taskUUID, payload}))
                                }
                                }/>
                                <DialogContentText>
                                    {dropoffTimeNotice}
                                </DialogContentText>
                            </Box>
                        </Grid>
                        <Grid item>
                            <TextField
                                margin="dense"
                                id="note"
                                label="Add a note!"
                                type="text"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </>;

        return (
            <>
                <Dialog fullScreen={props.fullscreen} open={true} onClose={handleClose}
                        aria-labelledby="form-dialog-title">
                    <DialogActions>
                        <Button onClick={handleClose}
                                color="primary">
                            Close
                        </Button>
                    </DialogActions>
                    {modalContents}
                </Dialog>
            </>
        );
    } else {
        if (isFetching) {
            return (
                <FormSkeleton/>
            )
        }
        else {
            return (
                <div style={{
                    background: "white",
                    paddingLeft: 30,
                    paddingTop: 100,
                    paddingRight: 30,
                    paddingBottom: 100
                }}>
                    <Grid container
                          spacing={2}
                          direction={"column"}
                          justify={"flex-start"}
                          alignItems={"flex-start"}>
                        <Grid item>
                            {task.pickup_address ? "FROM: " + task.pickup_address.line1 + "." : ""}
                        </Grid>
                        <Grid item>
                            {task.dropoff_address ? "TO: " + task.dropoff_address.line1 + "." : ""}
                        </Grid>
                        <Grid item>
                            {task.rider ? "Assigned to: " + task.rider.display_name + "." : ""}
                        </Grid>
                    </Grid>
                    <Grid container
                          spacing={3}
                          direction={"column"}
                          justify={"flex-start"}
                          alignItems={"flex-start"}>
                        <Grid item>
                            <AddressDetailsCollapsible label={"Pickup Address"}
                                                       onSelect={onSelectPickup}
                                                       address={task.pickup_address}
                                                       disabled={!editMode}
                            />
                        </Grid>
                        <Grid item>
                            <AddressDetailsCollapsible label={"Dropoff Address"}
                                                       onSelect={onSelectDropoff}
                                                       address={task.dropoff_address}
                                                       disabled={!editMode}/>
                        </Grid>
                        <Grid item>
                            {usersSelect}
                        </Grid>
                        <Grid item>
                            {prioritySelect}
                        </Grid>
                        <Grid item>
                            {deliverableSelect}
                        </Grid>
                        <Grid item>
                            <ToggleTimeStamp label={"Picked Up"} status={!!task.pickup_time}
                                             onSelect={onSelectPickedUp}/>
                            {pickupTimeNotice}
                        </Grid>
                        <Grid item>
                            <ToggleTimeStamp label={"Delivered"} status={!!task.dropoff_time}
                                             onSelect={onSelectDroppedOff}/>
                            {dropoffTimeNotice}
                        </Grid>
                        <Grid item>
                            <TextField
                                margin="dense"
                                id="note"
                                label="Add a note!"
                                type="text"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </div>
            );
        }
    }
}

