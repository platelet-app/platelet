import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
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
import { connect } from "react-redux"

const mapStateToProps = state => {
    return {
        tasks: state.tasks
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getTasksList: sessionId => dispatch(getAllTasks(sessionId)),
        updateTask: task => dispatch(updateTask(task)),
    }
};

function TaskDialog(props) {
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
    const [pickupTime, setPickupTime] = useState("");
    const [dropoffTime, setDropoffTime] = useState("");
    const [pickupAddress, setPickupAddress] = useState("");
    const [dropoffAddress, setDropoffAddress] = useState("");
    const [assignedRider, setAssignedRider] = useState("");
    const [priority, setPriority] = useState("");
    const [priorityLabel, setPriorityLabel] = useState("");
    const [payload, setPayload] = useState({});




    let history = useHistory();

    let editMode = props.view === "edit";


    const taskId = props.match.params.task_id;

    const taskResult = props.tasks.filter(task => task.uuid === props.match.params.task_id)
    let task = {};
    if (taskResult.length === 1) {
        task = taskResult[0];
    }
    console.log(task.priority_id ? task.priority_id : "no")
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

    useEffect(componentDidMount, [])

    function onSelectPickup(selectedItem) {
        let result = locationSuggestions.filter(location => location.name === selectedItem);
        if (result.length === 1) {
            let pickup_address = {
                ward: result[0]['address']['ward'],
                line1: result[0]['address']['line1'],
                line2: result[0]['address']['line2'],
                town: result[0]['address']['town'],
                county: result[0]['address']['county'],
                country: result[0]['address']['country'],
                postcode: result[0]['address']['postcode'],

            };
            sendData({pickup_address: pickup_address});
            const updated = update(payload, {pickup_address: {$set: pickup_address}})
            setPayload(updated);
            setPickupLabel("Pickup address - " + pickup_address.line1);
            setPickupAddress(pickup_address);
        } else {
            setPickupLabel("Pickup address - ");
        }
    }

    function onSelectDropoff(selectedItem) {
        let result = locationSuggestions.filter(location => location.name === selectedItem);

        if (result.length === 1) {
            let dropoff_address = {
                ward: result[0]['address']['ward'],
                line1: result[0]['address']['line1'],
                line2: result[0]['address']['line2'],
                town: result[0]['address']['town'],
                county: result[0]['address']['county'],
                country: result[0]['address']['country'],
                postcode: result[0]['address']['postcode']
            };
            sendData({dropoff_address: dropoff_address});
            const updated = update(payload, {dropoff_address: {$set: dropoff_address}});
            setPayload(updated);
            setDropoffAddress(dropoff_address);
            setDropoffLabel("Dropoff address - " + dropoff_address.line1);

        } else {
            setDropoffLabel("Dropoff address - ")
        }

    }

    function sendData(payload) {
        props.apiControl.tasks.updateTask(taskId, payload)
    }

    function onSelectRider(selectedItem) {
        let result = userSuggestions.filter(rider => rider.display_name === selectedItem);
        if (result.length === 1) {
            let rider = {
                name: result[0]['name'],
                display_name: result[0]['display_name'],
                patch: result[0]['patch'],
                vehicle: result[0]['vehicle'],
                uuid: result[0]['uuid']
            };
            console.log(rider)
            sendData({assigned_rider: rider.uuid});
            const updated = update(payload,
                {
                    rider:
                        {$set: rider},
                    assigned_rider:
                        {$set: rider.uuid}
                }
            );
            setPayload(updated);
            setAssignedRider(rider);
        }
    }

    function onSelectPriority(selectedItemId) {
        let result = availablePriorities.filter(item => item.id === selectedItemId);
        sendData({priority_id: selectedItemId});
        if (result.length === 1) {
            setPriorityLabel(result[0].label);
            const updated = update(payload, {priority: {$set: result[0].label}});
            console.log(updated);
            setPayload(updated)
        }
        setPriority(selectedItemId)
    }

    function onSelectPickedUp(status) {
        let pickup_time = status ? moment.utc().toISOString() : null;
        setPickupTime(pickup_time);
        sendData({pickup_time: pickup_time});
        const updated = update(payload, {pickup_time: {$set: pickup_time}});
        setPayload(updated);
        setPickupTime(pickup_time);
    }

    function onSelectDroppedOff(status) {
        let dropoff_time = status ? moment.utc().toISOString() : null;
        sendData({dropoff_time: dropoff_time});
        const updated = update(payload, {dropoff_time: {$set: dropoff_time}});
        setPayload(updated);
        setDropoffTime(dropoff_time);
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
        //props.updateCallback(taskId, payload);
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
            Add a deliverable
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
                                <DialogContentText>
                                    {pickupTimeNotice}
                                </DialogContentText>
                            </Grid>
                            <Grid item>
                                <ToggleTimeStamp label={"Delivered"} status={!!task.dropoff_time}
                                                 onSelect={onSelectDroppedOff}/>
                                <DialogContentText>
                                    {dropoffTimeNotice}
                                </DialogContentText>
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
    }
    else {
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
