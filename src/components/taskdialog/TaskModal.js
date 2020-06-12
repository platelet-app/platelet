import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from "@material-ui/core/Grid";
import {useHistory, useLocation} from "react-router-dom";
import AddressDetailsCollapsible from "../AddressDetail";
import ToggleTimeStamp from "../ToggleTimeStamp";
import moment from 'moment/min/moment-with-locales';
import Moment from "react-moment";
import PrioritySelect from "./PrioritySelect";
import DeliverableGridSelect from "../DeliverableGridSelect";
import DeliverableInformation from "../DeliverableInformation";
import {
    getAllTasks,
    updateTaskPickupTime,
    updateTaskPriority,
    updateTaskContactName,
    updateTaskContactNumber,
    updateTaskDropoffAddress,
    updateTaskDropoffTime,
    updateTaskPickupAddress, updateTaskCancelledTime, setCurrentTask, clearCurrentTask, getTask
} from "../../redux/tasks/TasksActions";
import {useDispatch, useSelector} from "react-redux"
import Box from "@material-ui/core/Box";
import {PaddedPaper} from "../../css/common";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {decodeUUID, encodeUUID, findExistingTask} from "../../utilities";
import {createLoadingSelector, createPostingSelector} from "../../redux/selectors";
import FormSkeleton from "../../loadingComponents/FormSkeleton";
import TaskModalTimePicker from "./TaskModalTimePicker";
import TaskModalNameAndContactNumber from "./TaskModalNameAndContactNumber";
import CommentsSection from "../../containers/CommentsSection";
import TaskAssignees from "./TaskAssignees";
import Typography from "@material-ui/core/Typography";
import {setNewTaskAddedView} from "../../redux/Actions";

export default function TaskModal(props) {
    const dispatch = useDispatch();
    // Leave this here in case app.js dispatchers haven't finished before the modal is opened
    const loadingSelector = createLoadingSelector([
        "GET_TASK",
        "GET_TASKS",
        "GET_AVAILABLE_LOCATIONS",
        "GET_AVAILABLE_PRIORITIES",
        "GET_USERS",
        "GET_AVAILABLE_LOCATIONS",
        "GET_SESSION",
        "GET_WHOAMI"]);
    const isPostingPickupSelector = createPostingSelector([
        "UPDATE_TASK_PICKUP_TIME"
    ]);
    const isPostingDropoffSelector = createPostingSelector([
        "UPDATE_TASK_DROPOFF_TIME"
    ]);
    const isFetching = useSelector(state => loadingSelector(state));
    const isPostingDropoffTime = useSelector(state => isPostingDropoffSelector(state));
    const isPostingPickupTime = useSelector(state => isPostingPickupSelector(state));
    const mobileView = useSelector(state => state.mobileView);
    const task = useSelector(state => state.currentTask.task);
    const sessionUUID = useSelector(state => state.currentTask.task.session_uuid);
    const session = useSelector(state => state.session.session);
    const whoami = useSelector(state => state.whoami.user);
    const whoamiUUID = useSelector(state => state.whoami.user.uuid);
    const whoamiRoles = useSelector(state => state.whoami.user.roles);
    const currentLocation = useLocation();

    const tasks = useSelector(state => state.tasks.tasks);

    let history = useHistory();


    let taskUUID = null;
    if (props.match) {
        taskUUID = decodeUUID(props.match.params.task_uuid_b62)
    } else {
        taskUUID = task.uuid;
    }
    const [editMode, setEditMode] = useState(false);

    function componentDidMount() {
        if (!tasks) {
            dispatch(getTask(taskUUID));
        }
    }

    useEffect(componentDidMount, []);

    function getSessionData() {
        return
        if (sessionUUID && !tasks.length)
            dispatch(getAllTasks(sessionUUID));
    }

    useEffect(getSessionData, [sessionUUID])

    function editModeSetter() {
        setEditMode(session.user_uuid === whoami.uuid || whoami.roles.includes("admin"));
    }

    useEffect(editModeSetter, [whoamiUUID, whoamiRoles])

    function currentTask() {
        const {task} = findExistingTask(tasks, taskUUID)
        if (task) {
            dispatch(setCurrentTask(task))
        }
    }
    useEffect(currentTask, [tasks])

    function updateEditMode() {
        setEditMode(session.user_uuid === whoamiUUID || whoamiRoles.includes("admin"));
    }

    useEffect(updateEditMode, [whoami, session])

    function onSelectContactNumber(event) {
        const payload = {contact_number: event.target.value};
        dispatch(updateTaskContactNumber({taskUUID, payload}));
    }

    function onSelectName(event) {
        const payload = {contact_name: event.target.value};
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


    function onSelectPriority(priority_id, priority) {
        const payload = {priority_id, priority};
        dispatch(updateTaskPriority({taskUUID, payload}));
    }

    function onSelectPickedUp(status) {
        const payload = {time_picked_up: status ? new Date().toISOString() : null};
        dispatch(updateTaskPickupTime({taskUUID, payload}));
    }

    function onSelectDroppedOff(status) {
        const payload = {time_dropped_off: status ? new Date().toISOString() : null};
        dispatch(updateTaskDropoffTime({taskUUID, payload}));
    }

    let handleClose = e => {
        e.stopPropagation();
        //TODO: might be a better way of doing this
        if (currentLocation.pathname.includes("session"))
            history.push("/session/" + encodeUUID(sessionUUID));
        else if (currentLocation.pathname.includes("mytasks"))
            history.push("/mytasks");
        else
            history.push("/");

        dispatch(clearCurrentTask());
    };

    const usersSelect = editMode ?
        <Grid container direction={"column"}>
            <Grid item>

                <Typography variant={"h5"}>Assignees:</Typography>
            </Grid>
            <Grid item>
                <TaskAssignees taskUUID={taskUUID}/>
            </Grid>
        </Grid> : <></>

    let prioritySelect;
    if (!editMode) {
        prioritySelect = task.priority ? <>
            <DialogContentText>{task.priority}</DialogContentText></> : ""

    } else {
        prioritySelect = <PrioritySelect priority={task.priority_id}
                                         onSelect={onSelectPriority}/>;
    }
    let pickupTimeNotice = <></>;
    if (task.time_picked_up) {
        pickupTimeNotice = <>Picked up at <Moment local format={"llll"}>{task.time_picked_up}</Moment></>
    }
    let dropoffTimeNotice = <></>;
    if (task.time_dropped_off) {
        dropoffTimeNotice = <>Dropped off at <Moment local format={"llll"}>{task.time_dropped_off}</Moment></>
    }
    let cancelledStatus = <></>
    if (task.time_cancelled) {
        cancelledStatus =
            <PaddedPaper width={"400px"}>
                <DialogContentText>
                    Cancelled at <Moment local format={"llll"}>{task.time_cancelled}</Moment>
                </DialogContentText>
                <ToggleTimeStamp label={"UNDO"} status={!!task.time_cancelled}
                                 onSelect={() => {
                                     const payload = {time_cancelled: null};
                                     dispatch(updateTaskCancelledTime({taskUUID, payload}));
                                 }
                                 }/>
            </PaddedPaper>
    }
    let rejectedStatus = <></>
    if (task.time_rejected) {
        rejectedStatus =
            <PaddedPaper width={"400px"}>
                <DialogContentText>
                    Rejected at <Moment local format={"llll"}>{task.time_rejected}</Moment>
                </DialogContentText>
                <ToggleTimeStamp label={"UNDO"} status={!!task.time_rejected}
                                 onSelect={() => {
                                     const payload = {time_rejected: null};
                                     dispatch(updateTaskCancelledTime({taskUUID, payload}));
                                 }
                                 }/>
            </PaddedPaper>
    }
    let deliverableSelect = <DeliverableInformation apiControl={props.apiControl} taskUUID={taskUUID}/>;
    if (editMode) {
        deliverableSelect = <>
            <Typography variant={"h5"}>Deliverables:</Typography>
            <DeliverableGridSelect apiControl={props.apiControl}
                                   taskUUID={taskUUID}
                                   deliverables={task.deliverables ? task.deliverables : []}/>
        </>;
    }

    const layerSpacing = 4;

    const layerOne =
        <Grid container direction={"row"} spacing={layerSpacing}>
            <Grid item>
                {rejectedStatus}
            </Grid>
            <Grid item>
                {cancelledStatus}
            </Grid>
        </Grid>

    const layerTwo =
        <Grid container direction={"row"} spacing={layerSpacing}>
            <Grid item>
                <PaddedPaper width={"400px"}>
                    <Typography variant={"h5"}>Contact:</Typography>
                    <TaskModalNameAndContactNumber
                        contactName={task.contact_name}
                        contactNumber={task.contact_number}
                        onSelectName={onSelectName}
                        onSelectContactNumber={onSelectContactNumber}
                    />
                </PaddedPaper>
            </Grid>
            <Grid item>
                <PaddedPaper width={"400px"}>

                    <Typography variant={"h5"}>Priority:</Typography>
                    {prioritySelect}
                </PaddedPaper>
            </Grid>
        </Grid>

    const layerThree =
        <Grid container direction={"row"} spacing={layerSpacing}>
            <Grid item>
                <PaddedPaper width={"400px"}>

                    <Typography variant={"h5"}>From:</Typography>
                    <AddressDetailsCollapsible label={""}
                                               onSelect={onSelectPickup}
                                               address={task.pickup_address}
                                               disabled={!editMode}
                    />
                </PaddedPaper>
            </Grid>
            <Grid item>
                <PaddedPaper width={"400px"}>

                    <Typography variant={"h5"}>To:</Typography>
                    <AddressDetailsCollapsible label={""}
                                               onSelect={onSelectDropoff}
                                               address={task.dropoff_address}
                                               disabled={!editMode}/>
                </PaddedPaper>
            </Grid>

        </Grid>

    const layerFour =
        <Grid container direction={"row"} spacing={layerSpacing}>
            <Grid item>
                <PaddedPaper width={"400px"}>
                    {usersSelect}
                </PaddedPaper>
            </Grid>
            <Grid item>
                <PaddedPaper width={"400px"}>
                    {deliverableSelect}
                </PaddedPaper>
            </Grid>
        </Grid>

    const layerFive =
        <Grid container direction={"row"} spacing={layerSpacing}>
            <Grid item>
                <PaddedPaper width={"400px"}>
                    <TaskModalTimePicker disabled={isPostingPickupTime} label={"Mark Picked Up"}
                                         time={task.time_picked_up}
                                         onToggle={onSelectPickedUp} onChange={(time_picked_up) => {
                        const payload = {time_picked_up};
                        dispatch(updateTaskPickupTime({taskUUID, payload}))
                    }}/>
                </PaddedPaper>
            </Grid>
            <Grid item>
                <PaddedPaper width={"400px"}>
                    <TaskModalTimePicker disabled={isPostingDropoffTime || !!!task.time_picked_up}
                                         label={"Mark Dropped Off"}
                                         time={task.time_dropped_off} onToggle={onSelectDroppedOff}
                                         onChange={(time_dropped_off) => {
                                             const payload = {time_dropped_off};
                                             dispatch(updateTaskDropoffTime({taskUUID, payload}))
                                         }}/>
                </PaddedPaper>
            </Grid>
        </Grid>

    if (props.modal) {
        const modalContents = isFetching ?
            <div style={{width: "600px"}}>
                <DialogContent>
                    <FormSkeleton/>
                </DialogContent>
            </div> :

            <>
                <DialogContent>
                    <Grid container
                          spacing={3}
                          direction={"column"}
                          justify={"flex-start"}
                          alignItems={"flex-start"}>
                        <Grid item>
                            {layerOne}
                        </Grid>
                        <Grid item>
                            {layerTwo}
                        </Grid>

                        <Grid item>
                            {layerThree}
                        </Grid>
                        <Grid item>
                            {layerFour}
                        </Grid>
                        <Grid item>
                            {layerFive}
                        </Grid>
                        <Grid item>
                            <PaddedPaper width={"400px"}>
                                <CommentsSection parentUUID={taskUUID}/>
                            </PaddedPaper>
                        </Grid>
                    </Grid>
                </DialogContent>
            </>;

        return (
            <>
                <Dialog
                    fullScreen={mobileView}
                    maxWidth={"md"}
                    fullWidth={true}
                    open={true}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            backgroundColor: "rgb(240, 240, 240)",
                            boxShadow: 'none',
                        },
                    }}
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
        } else {
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
                            <ToggleTimeStamp label={"Picked Up"} status={!!task.time_picked_up}
                                             onSelect={onSelectPickedUp}/>
                            {pickupTimeNotice}
                        </Grid>
                        <Grid item>
                            <ToggleTimeStamp label={"Delivered"} status={!!task.time_dropped_off}
                                             onSelect={onSelectDroppedOff}/>
                            {dropoffTimeNotice}
                        </Grid>
                        <Grid item>
                            <CommentsSection parentUUID={taskUUID}/>
                        </Grid>
                    </Grid>
                </div>
            );
        }
    }
}

