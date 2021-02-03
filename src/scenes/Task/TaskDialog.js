import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from "@material-ui/core/Grid";
import {Link, useHistory} from "react-router-dom";
import AddressDetailsCollapsible from "../../components/AddressDetail";
import ToggleTimeStamp from "./components/ToggleTimeStamp";
import Moment from "react-moment";
import PrioritySelect from "./components/PrioritySelect";
import DeliverableGridSelect from "../Deliverables/DeliverableGridSelect";
import DeliverableInformation from "../Deliverables/DeliverableInformation";
import {
    updateTaskPickupTimeRequest,
    updateTaskPriorityRequest,
    updateTaskDropoffAddressRequest,
    updateTaskDropoffTimeRequest,
    updateTaskPickupAddressRequest,
    updateTaskCancelledTimeRequest,
    getTaskRequest,
    updateTaskPickupAddressFromSavedRequest,
    updateTaskDropoffAddressFromSavedRequest, updateTaskRequesterContactRequest, updateTaskRejectedTimeRequest
} from "../../redux/tasks/TasksActions";
import {useDispatch, useSelector} from "react-redux"
import {PaddedPaper} from "../../styles/common";
import {decodeUUID, encodeUUID} from "../../utilities";
import {createLoadingSelector, createNotFoundSelector, createPostingSelector} from "../../redux/selectors";
import FormSkeleton from "../../SharedLoadingSkeletons/FormSkeleton";
import TaskModalTimePicker from "./components/TaskModalTimePicker";
import TaskModalNameAndContactNumber from "./components/TaskModalNameAndContactNumber";
import CommentsSection from "../Comments/CommentsSection";
import TaskAssignees from "./components/TaskAssignees";
import Typography from "@material-ui/core/Typography";
import NotFound from "../../ErrorComponents/NotFound";
import {Skeleton} from "@material-ui/lab";
import ActionsRecord from "../ActionsRecord/ActionsRecord";
import {getActionsRecordRequest} from "../../redux/actionsRecord/ActionsRecordActions";
import StatusBar from "./components/StatusBar"
import {
    setTaskDropoffDestinationRequest,
    setTaskPickupDestinationRequest
} from "../../redux/taskDestinations/TaskDestinationsActions";

export default function TaskDialog(props) {
    const dispatch = useDispatch();
    // Leave these here in case app.js dispatchers haven't finished before the modal is opened
    const loadingSelector = createLoadingSelector([
        "GET_TASK",
        "GET_WHOAMI"]);
    const loadingSelectorLocations = createLoadingSelector(["GET_AVAILABLE_LOCATIONS",]);
    const loadingSelectorPriorities = createLoadingSelector(["GET_AVAILABLE_PRIORITIES",]);
    const loadingSelectorUsers = createLoadingSelector(["GET_USERS",]);
    const isFetching = useSelector(state => loadingSelector(state));
    const isFetchingLocations = useSelector(state => loadingSelectorLocations(state));
    const isFetchingPriorities = useSelector(state => loadingSelectorPriorities(state));
    const isFetchingUsers = useSelector(state => loadingSelectorUsers(state));

    const savedLocations = useSelector(state => state.availableLocations.locations);

    const isPostingPickupSelector = createPostingSelector([
        "UPDATE_TASK_PICKUP_TIME"
    ]);
    const isPostingDropoffSelector = createPostingSelector([
        "UPDATE_TASK_DROPOFF_TIME"
    ]);
    const isPostingDropoffTime = useSelector(state => isPostingDropoffSelector(state));
    const isPostingPickupTime = useSelector(state => isPostingPickupSelector(state));
    const mobileView = useSelector(state => state.mobileView);
    const task = useSelector(state => state.task.task);
    const notFoundSelector = createNotFoundSelector(["GET_TASK"]);
    const notFound = useSelector(state => notFoundSelector(state));
    const whoami = useSelector(state => state.whoami.user);
    const whoamiUUID = useSelector(state => state.whoami.user.uuid);
    const whoamiRoles = useSelector(state => state.whoami.user.roles);
    const actionsRecord = useSelector(state => state.actionsRecord.actionsRecord);

    const [pickUpSaved, setPickUpSaved] = useState("")
    const [dropOffSaved, setDropOffSaved] = useState("")

    let history = useHistory();
    let taskUUID = null;

    if (props.match) {
        taskUUID = decodeUUID(props.match.params.task_uuid_b62)
    } else {
        taskUUID = task.uuid;
    }
    const [editMode, setEditMode] = useState(true);

    function componentDidMount() {
        dispatch(getTaskRequest(taskUUID))
        dispatch(getActionsRecordRequest(taskUUID))
    }

    useEffect(componentDidMount, [props.location.key]);

    // TODO: add in collaborators once done on backend
    function editModeSetter() {
        if (task && task.author)
            setEditMode(task.author.uuid === whoami.uuid || whoami.roles.includes("admin"));
    }

    useEffect(editModeSetter, [whoamiUUID, whoamiRoles, task])

    function updateEditMode() {
        if (task && task.author)
            setEditMode(task.author.uuid === whoamiUUID || whoamiRoles.includes("admin"));
    }

    useEffect(updateEditMode, [whoami, task])


    function onSelectRequesterContact(value) {
        const payload = {requester_contact: value};
        dispatch(updateTaskRequesterContactRequest(taskUUID, payload));

    }

    function onSelectPickup(pickupAddress) {
        if (pickupAddress) {
            const payload = {pickup_address: pickupAddress};
            dispatch(updateTaskPickupAddressRequest(taskUUID, payload));
        }
    }

    function onSelectPickupFromSaved(locationUUID) {
        if (locationUUID && savedLocations) {
            const result = savedLocations[locationUUID];
            if (result)
                setPickUpSaved(result.name)
        }
        if (locationUUID) {
            dispatch(setTaskPickupDestinationRequest(taskUUID, locationUUID))
            //dispatch(updateTaskPickupAddressFromSavedRequest(taskUUID, payload));
        }
    }

    function onSelectDropoff(dropoffAddress) {
        if (dropoffAddress) {
            const payload = {dropoff_address: dropoffAddress};
            dispatch(updateTaskDropoffAddressRequest(taskUUID, payload));
        }
    }

    function onSelectDropoffFromSaved(locationUUID) {
        if (locationUUID && savedLocations) {
            const result = savedLocations[locationUUID];
            if (result)
                setDropOffSaved(result.name)
        }
        if (locationUUID) {
            dispatch(setTaskDropoffDestinationRequest(taskUUID, locationUUID))
            //dispatch(updateTaskDropoffAddressFromSavedRequest(taskUUID, payload));
        }
    }


    function onSelectPriority(priority_id, priority) {
        const payload = {priority_id, priority};
        dispatch(updateTaskPriorityRequest(taskUUID, payload));
    }

    function onSelectPickedUp(dateTime) {
        const payload = {time_picked_up: dateTime};
        dispatch(updateTaskPickupTimeRequest(taskUUID, payload));
    }

    function onSelectDroppedOff(dateTime) {
        const payload = {time_dropped_off: dateTime};
        dispatch(updateTaskDropoffTimeRequest(taskUUID, payload));
    }

    let handleClose = e => {
        e.stopPropagation();
        if (props.location.state)
            history.goBack();
        else
            history.push("/");

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
                                     dispatch(updateTaskCancelledTimeRequest(taskUUID, payload));
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
                                     dispatch(updateTaskRejectedTimeRequest(taskUUID, payload));
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
                    <Typography variant={"h5"}>Requester Contact:</Typography>
                    <TaskModalNameAndContactNumber
                        contactName={task.requester_contact ? task.requester_contact.name : ""}
                        contactNumber={task.requester_contact ? task.requester_contact.telephone_number : ""}
                        onSelect={onSelectRequesterContact}
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
                    <Typography>{pickUpSaved}</Typography>
                    <AddressDetailsCollapsible label={"Pickup Locations"}
                                               onSelect={onSelectPickup}
                                               onSelectPreset={onSelectPickupFromSaved}
                                               address={task.pickup_address}
                                               disabled={!editMode}
                    />
                </PaddedPaper>
            </Grid>
            <Grid item>
                <PaddedPaper width={"400px"}>

                    <Typography variant={"h5"}>To:</Typography>
                    <Typography>{dropOffSaved}</Typography>
                    <AddressDetailsCollapsible label={"Delivery Locations"}
                                               onSelect={onSelectDropoff}
                                               onSelectPreset={onSelectDropoffFromSaved}
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
                                         onChange={onSelectPickedUp}/>
                </PaddedPaper>
            </Grid>
            <Grid item>
                <PaddedPaper width={"400px"}>
                    <TaskModalTimePicker disabled={isPostingDropoffTime || !!!task.time_picked_up}
                                         label={"Mark Dropped Off"}
                                         time={task.time_dropped_off}
                                         onChange={onSelectDroppedOff}
                    />
                </PaddedPaper>
            </Grid>
        </Grid>

    const nextTaskPrevTaskButtons =
        <div style={{width: "500px"}}>
            <Grid container direction={"row"} justify={"space-between"} alignItems={"flex-start"}>
                <Grid item>
                    {task.relay_previous_uuid ?
                        <Button onClick={() => {
                        }} component={Link} to={`/task/${encodeUUID(task.relay_previous_uuid)}`}>
                            Previous Task in Relay
                        </Button> : <></>
                    }
                </Grid>
                <Grid item>
                    {task.relay_next ?
                    <Button onClick={() => {
                    }} component={Link} to={`/task/${encodeUUID(task.relay_next.uuid)}`}>
                        Next Task in Relay
                    </Button> : <></>}
                </Grid>

            </Grid>
        </div>

    let modalContents;
    if (notFound) {
        modalContents = <NotFound>Task {taskUUID} could not be found.</NotFound>
    } else if (isFetching) {
        modalContents = <div style={{width: "600px"}}>
            <DialogContent>
                <FormSkeleton/>
            </DialogContent>
        </div>
    } else {
        modalContents =
            <>
                <DialogContent>
                    <Grid container
                          spacing={3}
                          direction={"column"}
                          justify={"flex-start"}
                          alignItems={"flex-start"}>
                        <Grid item>
                        </Grid>
                        <Grid item>
                            <Typography>{task.reference}</Typography>
                        </Grid>
                        <Grid item>
                            {isFetchingPriorities ? <Skeleton variant="text" width={500} height={250}/> : layerOne}
                        </Grid>
                        <Grid item>
                            {isFetchingLocations ? <Skeleton variant="text" width={500} height={250}/> : layerTwo}
                        </Grid>
                        <Grid item>
                            {isFetchingUsers ? <Skeleton variant="text" width={500} height={250}/> : layerThree}
                        </Grid>
                        <Grid item>
                            {layerFour}
                        </Grid>
                        <Grid item>
                            {layerFive}
                        </Grid>
                        <Grid item>
                            {nextTaskPrevTaskButtons}
                        </Grid>
                        <Grid item>
                            <PaddedPaper width={"830px"}>
                                <CommentsSection parentUUID={taskUUID}/>
                            </PaddedPaper>
                        </Grid>
                        <Grid item>
                            <PaddedPaper width={"830px"}>
                                <ActionsRecord actions={actionsRecord}/>
                            </PaddedPaper>
                        </Grid>
                    </Grid>
                </DialogContent>
            </>;
    }

    return (
        <>
            <Dialog
                fullScreen={mobileView}
                maxWidth={"lg"}
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
                <StatusBar
                    relayNext={task.relay_next ? task.relay_next.uuid : null}
                    relayPrevious={task.relay_previous ? task.relay_previous.uuid : null}
                    handleClose={handleClose}
                    assignedRiders={task.assigned_riders}
                    assignedCoordinators={task.assigned_coordinators}
                    assignedCoordinatorsDisplayString={task.assigned_coordinators_display_string}
                    assignedRidersDisplayString={task.assigned_riders_display_string}
                    taskUUID={taskUUID}
                />
                {modalContents}
            </Dialog>
        </>
    );

}

