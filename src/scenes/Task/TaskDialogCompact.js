import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import StatusBar from "./components/StatusBar";
import Dialog from "@material-ui/core/Dialog";
import {useHistory} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {decodeUUID} from "../../utilities";

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
import Container from "@material-ui/core/Container";
import {Hidden} from "@material-ui/core";
import {createNotFoundSelector} from "../../redux/selectors";
import {getTaskPrefix} from "../../redux/activeTask/ActiveTaskActions"
import NotFound from "../../ErrorComponents/NotFound";
import Typography from "@material-ui/core/Typography";
import {determineTaskType} from "../../redux/tasks/task_redux_utilities";

const useStyles = makeStyles(theme => ({
    dialogContent: {
        overflow: ""
    },
    root: {
        paddingTop: 20,
        [theme.breakpoints.down("md")]: {
            padding: 5,
            paddingTop: 5
        },
    },
    item: {
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: 0,
            minWidth: 425
        }

    },
    container: {
        //width: "100%",
        //margin: 0
    },
    statusBar: {
        paddingBottom: 8
    },
    separator: {
        height: 25,
        width: 25
    },
}))

function TaskDialogCompact(props) {
    const theme = useTheme();
    const history = useHistory();
    const dispatch = useDispatch();
    const task = useSelector(state => state.task.task);
    const classes = useStyles();
    const [taskStatus, setTaskStatus] = useState("No status")
    const notFoundSelector = createNotFoundSelector([getTaskPrefix]);
    const notFound = useSelector(state => notFoundSelector(state));

    const isSm = useMediaQuery(theme.breakpoints.down("xs"));

    let taskUUID = null;

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
            handleClose={handleClose}
            status={taskStatus}
            taskUUID={taskUUID}
        />


    if (!task) {
        return <Dialog open={true}><FormSkeleton/></Dialog>
    } else if (notFound) {
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
                        padding: 0
                    },
                }}
                aria-labelledby="task-dialog">
                <NotFound>
                    <Typography>
                        Task with UUID {taskUUID} not found.
                    </Typography>
                </NotFound>
            </Dialog>
        )
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
                        padding: 0
                    },
                }}
                aria-labelledby="task-dialog">
                {statusBar}
                <Container className={classes.root} maxWidth={false}>
                    <Grid container className={classes.container} spacing={isSm ? 0 : 3} direction={"column"}
                          alignItems={"flex-start"} justify={"center"}>
                        <Grid container className={classes.container} spacing={isSm ? 0 : 3} item direction={"row"}
                              justify={isSm ? "center" : "flex-start"}>
                            <Grid className={classes.item} item>
                                <PickUpDetails
                                    taskUUID={taskUUID}
                                    location={task.pickup_location}
                                    time={task.time_picked_up}
                                />
                            </Grid>
                            <Hidden smUp>
                                <Grid item>
                                    <div className={classes.separator}/>
                                </Grid>
                            </Hidden>
                            <Grid className={classes.item} item>
                                <DropOffDetails
                                    disableTimeButton={!!!task.time_picked_up}
                                    taskUUID={taskUUID}
                                    location={task.dropoff_location}
                                    time={task.time_dropped_off}
                                />
                            </Grid>
                        </Grid>
                        <Hidden smUp>
                            <Grid item>
                                <div className={classes.separator}/>
                            </Grid>
                        </Hidden>
                        <Grid container className={classes.container} spacing={isSm ? 0 : 3} item direction={"row"}
                              justify={isSm ? "center" : "flex-start"}>
                            <Grid className={classes.item} item>
                                <TaskDetailsPanel/>
                            </Grid>
                            <Hidden smUp>
                                <Grid item>
                                    <div className={classes.separator}/>
                                </Grid>
                            </Hidden>
                            <Grid className={classes.item} item>
                                <DeliverableGridSelect taskUUID={taskUUID}/>
                            </Grid>
                        </Grid>
                        <Hidden smUp>
                            <Grid item>
                                <div className={classes.separator}/>
                            </Grid>
                        </Hidden>
                        <Grid item>
                            <CommentsSection parentUUID={taskUUID}/>
                        </Grid>
                    </Grid>
                </Container>
            </Dialog>
        )
    }
}

export default TaskDialogCompact;
