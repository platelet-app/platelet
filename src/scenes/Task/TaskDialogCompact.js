import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import StatusBar from "./components/StatusBar";
import Dialog from "@material-ui/core/Dialog";
import {useHistory} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {decodeUUID, determineTaskType} from "../../utilities";
import FormSkeleton from "../../SharedLoadingSkeletons/FormSkeleton";
import {getTaskRequest} from "../../redux/activeTask/ActiveTaskActions"
import makeStyles from "@material-ui/core/styles/makeStyles";
import TaskDetailsPanel from "./components/TaskDetailsPanel";
import CommentsSection from "../Comments/CommentsSection";
import {useTheme} from "@material-ui/core/styles";
import DeliverableGridSelect from "../Deliverables/DeliverableGridSelect";
import PickUpDetails from "./components/PickUpDetails";
import DropOffDetails from "./components/DropOffDetails";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles(theme => ({
    dialogContent: {
        overflow: ""
    },
    root: {
        padding: 20,
        [theme.breakpoints.down("md")]: {
            padding: 5,
            paddingTop: 5
        },
    },
    item: {
        minHeight: "425px"
    },
    statusBar: {
        paddingBottom: 8
    },
    separator: {
        height: 25,
        width: 25,
        [theme.breakpoints.down("sm")]: {
            width: 500
        },
        [theme.breakpoints.down("xs")]: {
            width: 300
        },


    },
}))


function TaskDialogCompact(props) {
    const theme = useTheme();
    const history = useHistory();
    const dispatch = useDispatch();
    const task = useSelector(state => state.task.task);
    const classes = useStyles();
    const [taskStatus, setTaskStatus] = useState("No status")

    const isSm = useMediaQuery(theme.breakpoints.down("xs"));

    let taskUUID = null;

    if (props.match) {
        taskUUID = decodeUUID(props.match.params.task_uuid_b62) // everything before the query string
    }

    if (props.match) {
        taskUUID = decodeUUID(props.match.params.task_uuid_b62)
    } else {
        taskUUID = task.uuid;
    }

    function componentDidMount() {
        dispatch(getTaskRequest(taskUUID))
    }

    useEffect(componentDidMount, [props.location.key]);

    function setStatus() {
        const result = Object.keys(determineTaskType({task}))
        if (result) {
            if (result.includes("tasksNew")) {
                setTaskStatus("New")
            } else if (result.includes("tasksActive")) {
                setTaskStatus("Active")
            } else if (result.includes("tasksPickedUp")) {
                setTaskStatus("Picked up")
            } else if (result.includes("tasksDelivered")) {
                setTaskStatus("Delivered")
            }
        }
    }

    useEffect(setStatus, [task])

    let handleClose = e => {
        e.stopPropagation();
        if (props.location.state)
            history.goBack();
        else
            history.push("/dashboard");

    };
    const statusBar = !task ? <></> :
        <StatusBar
            relayNext={task.relay_next ? task.relay_next.uuid : null}
            relayPrevious={task.relay_previous ? task.relay_previous.uuid : null}
            handleClose={handleClose}
            assignedRiders={task.assigned_riders}
            assignedCoordinators={task.assigned_coordinators}
            assignedCoordinatorsDisplayString={task.assigned_coordinators_display_string}
            assignedRidersDisplayString={task.assigned_riders_display_string}
            taskUUID={taskUUID}
            status={taskStatus}
        />

    if (!task) {
        return <Dialog open={true}><FormSkeleton/></Dialog>
    } else {
        return (
            <Dialog
                disableEscapeKeyDown
                fullScreen={isSm}
                maxWidth={"md"}
                fullWidth={true}
                open={true}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        boxShadow: 'none',
                        background: theme.palette.background.default,
                    },
                }}
                aria-labelledby="task-dialog">
                {statusBar}
                <div className={classes.root}>
                    <Grid container direction={"column"} alignItems={"flex-start"} justify={"center"}>
                        <Grid container item direction={"row"} justify={isSm ? "center": "flex-start"}>
                            <Grid item>
                                <PickUpDetails
                                    taskUUID={taskUUID}
                                    location={task.pickup_location}
                                    time={task.time_picked_up}
                                />
                            </Grid>
                            <Grid item>
                                <div className={classes.separator}/>
                            </Grid>
                            <Grid item>
                                <DropOffDetails
                                    disableTimeButton={!!!task.time_picked_up}
                                    taskUUID={taskUUID}
                                    location={task.dropoff_location}
                                    time={task.time_dropped_off}
                                />
                            </Grid>
                        </Grid>
                        <Grid item>
                            <div className={classes.separator}/>
                        </Grid>
                        <Grid container item direction={"row"} justify={isSm ? "center": "flex-start"}>
                            <Grid item>
                                <TaskDetailsPanel/>
                            </Grid>
                            <Grid item>
                                <div className={classes.separator}/>
                            </Grid>
                            <Grid item>
                                <DeliverableGridSelect taskUUID={taskUUID}/>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <CommentsSection parentUUID={taskUUID}/>
                        </Grid>
                    </Grid>
                </div>
            </Dialog>

        )
    }

}

export default TaskDialogCompact;
