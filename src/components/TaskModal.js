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
import update from 'immutability-helper';
import moment from 'moment/min/moment-with-locales';
import Moment from "react-moment";
import PrioritySelect from "./PrioritySelect";
import DeliverableGridSelect from "./DeliverableGridSelect";
import DeliverableInformation from "./DeliverableInformation";
import {updateTask, getAllTasks} from "../redux/Actions";
import {connect} from "react-redux"
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { TextFieldControlled } from "./TextFieldControlled";

const mapStateToProps = state => {
    return {
        tasks: state.tasks
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getTasksList: sessionId => dispatch(getAllTasks(sessionId)),
        updateTask: dataObj => dispatch(updateTask(dataObj)),
    }
};

const useStyles = makeStyles(({
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


function TaskDialog(props) {
    const classes = useStyles();
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [filteredLocationSuggestions, setFilteredLocationSuggestions] = useState([]);
    const [userSuggestions, setUserSuggestions] = useState([]);
    const [filteredUserSuggestions, setFilteredUserSuggestions] = useState([]);
    const [availablePriorities, setAvailablePriorities] = useState([]);
    const [availableDeliverables, setAvailableDeliverables] = useState([]);
    const [deliverables, setDeliverables] = useState([]);

    const [open, setOpen] = useState(false);
    const [pickupLabel, setPickupLabel] = useState("");
    const [dropoffLabel, setDropoffLabel] = useState("");
    const [payload, setPayload] = useState({});


    let history = useHistory();

    let editMode = props.view === "edit";

    const taskId = props.match.params.task_id;

    const taskResult = props.tasks.filter(task => task.uuid === props.match.params.task_id)
    let newTask = {};
    if (taskResult.length === 1) {
        newTask = taskResult[0];
    }
    const [task, setTask] = useState(newTask);

    function componentDidMount() {
        props.apiControl.priorities.getPriorities().then((data) => {
            if (data) {
                setAvailablePriorities(data)
            }
        });
        props.apiControl.deliverables.getAvailableDeliverables().then((data) => {
            setAvailableDeliverables(data)
        });
        props.apiControl.locations.getLocations().then((data) => {
            let filteredSuggestions = [];
            data.map((location) => {
                filteredSuggestions.push({"label": location.name})
            });
            setFilteredLocationSuggestions(filteredSuggestions);
            setLocationSuggestions(data)
        });
        props.apiControl.users.getUsers().then((data) => {
            let filteredUsers = [];
            data.map((user) => {
                if (user.roles.includes("rider")) {
                    filteredUsers.push({
                        "label": user.display_name,
                        "uuid": user.uuid
                    })
                }
                setFilteredUserSuggestions(filteredUsers);
                setUserSuggestions(data);
            });
        });
        if (task.pickup_address)
            if (task.pickup_address.ward)
                setPickupLabel(task.pickup_address.line1 + " - " + task.pickup_address.ward);
            else
                setPickupLabel(task.pickup_address.line1);

        if (task.dropoff_address)
            if (task.dropoff_address.ward)
                setDropoffLabel(task.dropoff_address.line1 + " - " + task.dropoff_address.ward);
            else
                setDropoffLabel(task.dropoff_address.line1);


        if (!props.tasks.length) {
            props.apiControl.tasks.getTask(taskId).then((data) => {
                props.getTasksList({session_id: data.session_id});
            });
        }
    }

    useEffect(componentDidMount, []);

    function onSelectContactNumber(event) {
        console.log(event.target.value);
        sendData({contact_number: event.target.value});
    }

    function onSelectName(event) {
        console.log(event.target.value)

        sendData({contact_name: event.target.value});

    }

    function onSelectPickup(pickupAddress) {
        if(pickupAddress) {
            sendData({pickup_address: pickupAddress});
            const updated = update(payload, {pickup_address: {$set: pickupAddress}})
            setPayload(updated);
            setPickupLabel("Pickup address - " + pickupAddress.line1);
        } else {
            setPickupLabel("Pickup address - ");
        }
    }

    function onSelectDropoff(dropoffAddress) {
        console.log("AAAAAAAAAAA")
        if(dropoffAddress) {
            sendData({dropoff_address: dropoffAddress});
            const updated = update(payload, {dropoff_address: {$set: dropoffAddress}});
            setPayload(updated);
            setDropoffLabel("Dropoff address - " + dropoffAddress.line1);

        } else {
            setDropoffLabel("Dropoff address - ")
        }

    }

    function sendData(payload, updateData) {
        const updateDataCombined = {...payload, ...updateData}
        props.updateTask({payload: payload, taskId: taskId, updateData: updateDataCombined ? updateDataCombined : {}});
    }

    function onSelectRider(selectedItem) {
        console.log(selectedItem)
        let result = userSuggestions.filter(rider => rider.display_name === selectedItem);
        if (result.length === 1) {
            let rider = {
                name: result[0]['name'],
                display_name: result[0]['display_name'],
                patch: result[0]['patch'],
                vehicle: result[0]['vehicle'],
                uuid: result[0]['uuid']
            };
            sendData({assigned_rider: rider.uuid}, {rider: rider});
            const updated = update(payload,
                {
                    rider:
                        {$set: rider},
                    assigned_rider:
                        {$set: rider.uuid}
                }
            );
            setPayload(updated);
        }
    }

    function onSelectPriority(selectedItemId) {
        let result = availablePriorities.filter(item => item.id === selectedItemId);
        sendData({priority_id: selectedItemId, priority: result[0].label});
        if (result.length === 1) {
            const updated = update(payload, {priority: {$set: result[0].label}});
            setPayload(updated)
        }
    }

    function onSelectPickedUp(status) {
        let pickup_time = status ? moment.utc().toISOString() : null;
        sendData({pickup_time: pickup_time});
        const updated = update(payload, {pickup_time: {$set: pickup_time}});
        setPayload(updated);
    }

    function onSelectDroppedOff(status) {
        let dropoff_time = status ? moment.utc().toISOString() : null;
        sendData({dropoff_time: dropoff_time});
        const updated = update(payload, {dropoff_time: {$set: dropoff_time}});
        setPayload(updated);
    }

    function onNewDeliverable(newDeliverable) {
        setDeliverables([newDeliverable, ...deliverables])
    }

    function onSelectDeliverable(uuid, type_id) {
        let result = deliverables.filter(deliverable => deliverable.uuid === uuid);
        if (result.length === 1) {
            const index = deliverables.indexOf(result[0]);
            const updated = update(deliverables, {[index]: {type_id: {$set: type_id}}});
            setDeliverables(updated)
        }
        props.apiControl.deliverables.updateDeliverable(uuid, {"type_id": type_id});
    }

    function onDeliverableNote(uuid, value) {
        props.apiControl.notes.updateNote(uuid, {"body": value});
    }

    function handleClickOpen() {
        setOpen(true);
    }

    let handleClose = e => {
        setOpen(false);
        setPayload({});
        e.stopPropagation();
        history.goBack();
    };

    let usersSelect = <></>;
    if (editMode) {
        usersSelect =
            <>
                <UsersSelect id="userSelect" suggestions={filteredUserSuggestions}
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
                                         availablePriorities={availablePriorities}
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
    let deliverableSelect = <DeliverableInformation apiControl={props.apiControl} taskId={taskId}/>;
    if (editMode) {
        deliverableSelect = <><DialogContentText>
            Deliverables:
        </DialogContentText>
            <DeliverableGridSelect apiControl={props.apiControl}
                                   taskId={taskId}
                                   deliverables={task.deliverables ? task.deliverables : []}
                                   availableDeliverables={availableDeliverables}
                                   onNew={onNewDeliverable}
                                   onSelect={onSelectDeliverable}
                                   onNoteChange={onDeliverableNote}/>
        </>;
    }

    if (props.modal) {
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
                                    <AddressDetailsCollapsible label={pickupLabel}
                                                               onSelect={onSelectPickup}
                                                               locations={locationSuggestions}
                                                               suggestions={filteredLocationSuggestions}
                                                               address={task.pickup_address}
                                                               disabled={!editMode}
                                    />
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box className={classes.box}>
                                    <DialogContentText>To:</DialogContentText>
                                    <AddressDetailsCollapsible label={dropoffLabel}
                                                               onSelect={onSelectDropoff}
                                                               locations={locationSuggestions}
                                                               suggestions={filteredLocationSuggestions}
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
                                    <DialogContentText>
                                        {pickupTimeNotice}
                                    </DialogContentText>
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box className={classes.box}>
                                    <ToggleTimeStamp label={"Delivered"} status={!!task.dropoff_time}
                                                     onSelect={onSelectDroppedOff}/>
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
                </Dialog>
            </>
        );
    } else {
        return (
            <div style={{background: "white", paddingLeft: 30, paddingTop: 100, paddingRight: 30, paddingBottom: 100}}>
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
                        <AddressDetailsCollapsible label={pickupLabel}
                                                   onSelect={onSelectPickup}
                                                   locations={locationSuggestions}
                                                   suggestions={filteredLocationSuggestions}
                                                   address={task.pickup_address}
                                                   disabled={!editMode}
                        />
                    </Grid>
                    <Grid item>
                        <AddressDetailsCollapsible label={dropoffLabel}
                                                   onSelect={onSelectDropoff}
                                                   locations={locationSuggestions}
                                                   suggestions={filteredLocationSuggestions}
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

const TaskModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskDialog);

export default TaskModal
