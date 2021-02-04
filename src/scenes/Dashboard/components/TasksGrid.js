import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import TaskItem from "./TaskItem";
import {
    createLoadingSelector,
    createNotFoundSelector,
    createPostingSelector,
    createSimpleLoadingSelector
} from "../../../redux/selectors";
import {useDispatch, useSelector} from "react-redux";
import {TasksKanbanColumn} from "../styles/TaskColumns";
import Button from "@material-ui/core/Button";
import {Waypoint} from "react-waypoint";
import {
    addTaskRelayRequest, addTaskRequest,
    updateTaskDropoffAddressRequest
} from "../../../redux/tasks/TasksActions";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {filterTasks} from "../utilities/functions";
import {CircularProgress, Typography} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import TasksGridSkeleton from "./TasksGridSkeleton";
import PropTypes from 'prop-types'
import {initialTasksState} from "../../../redux/tasks/TasksReducers";
import {showHide} from "../../../styles/common";
import {
    appendTasksCancelledRequest,
    appendTasksDeliveredRequest,
    appendTasksRejectedRequest
} from "../../../redux/tasks/TasksWaypointActions";


const getColumnTitle = key => {
    switch (key) {
        case "tasksNew":
            return "New".toUpperCase();
        case "tasksActive":
            return "Active".toUpperCase();
        case "tasksPickedUp":
            return "Picked Up".toUpperCase();
        case "tasksDelivered":
            return "Delivered".toUpperCase();
        case "tasksRejected":
            return "Rejected".toUpperCase();
        case "tasksCancelled":
            return "Cancelled".toUpperCase();
        case "tasksRejectedCancelled":
            return "Rejected/Cancelled".toUpperCase();
        default:
            return ""
    }
};

const useStyles = makeStyles(theme => ({
    addRelay: {
        visibility: "hidden",
        "&:hover $hoverDiv": {
            visibility: "visible"
        }
    },
    hoverDiv: {
        width: "100%",
        height: "35px",
        "& .hidden-button": {
            display: "none"
        },
        "&:hover .hidden-button": {
            display: "inline"
        }
    },
    header: {
        fontWeight: "bold",
        padding: "6px"
    },
    divider: {
        width: "300px"
    }
}));


const TaskGroup = props => {
    const classes = props.classes;
    const {show, hide} = showHide();
    const taskArr = Object.entries(props.group).map(([key, value]) => value)
    taskArr.sort((a, b) => a.order_in_relay - b.order_in_relay)
    return taskArr.length === 0 ? <></> : taskArr.map((task, i, arr) => {
        const {
            assigned_riders_display_string,
            time_picked_up,
            time_dropped_off,
            time_rejected,
            time_cancelled,
            time_of_call,
            priority,
            patch,
            uuid,
            assigned_riders,
            parent_id,
            relay_next,
            assigned_coordinators,
            assigned_coordinators_display_string
        } = task;
        const dropoff_address = task.dropoff_location ? task.dropoff_location.address : null;
        const pickup_address = task.pickup_location ? task.pickup_location.address : null;

        return (
            <div className={(props.showTasks === null || props.showTasks.includes(uuid)) ? show : hide}
                 key={uuid}>
                <Grid container alignItems={"center"} justify={"center"}>
                    <Grid item>
                        <TaskItem
                            pickupAddress={pickup_address}
                            assignedRiders={assigned_riders}
                            assignedCoordinators={assigned_coordinators}
                            assignedCoordinatorsDisplayString={assigned_coordinators_display_string}
                            assignedRidersDisplayString={assigned_riders_display_string}
                            dropoffAddress={dropoff_address}
                            timePickedUp={time_picked_up}
                            timeDroppedOff={time_dropped_off}
                            timeRejected={time_rejected}
                            timeCancelled={time_cancelled}
                            timeOfCall={time_of_call}
                            priority={priority}
                            patch={patch}
                            relayNext={relay_next}
                            taskUUID={uuid}
                            parentID={parent_id}
                            view={props.modalView}
                            deleteDisabled={props.deleteDisabled}/>
                        <Grid container alignItems={"center"} justify={"center"} className={classes.hoverDiv}>
                            <Grid
                                className={(!!relay_next && props.showTasks === null && !props.hideRelayIcons) ? show : hide}
                                item>
                                <Tooltip title="Relay">
                                    <ArrowDownwardIcon style={{height: "35px"}}/>
                                </Tooltip>
                            </Grid>
                            <Grid item
                                  className={(!!!relay_next && props.showTasks === null && !props.hideRelayIcons) ? show : hide}
                            >
                                <Divider className={hide}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    })
}

const loaderStyles = makeStyles((theme) => ({
    linear: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    circular: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
}));

const GridColumn = (props) => {
    const classes = useStyles();
    const loaderClass = loaderStyles();
    const {show, hide} = showHide();
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.tasks.tasks[props.taskKey]);
    const whoami = useSelector(state => state.whoami.user);
    let selectorsString = "";
    if (props.taskKey === "tasksDelivered")
        selectorsString = "APPEND_TASKS_DELIVERED"
    else if (props.taskKey === "tasksCancelled")
        selectorsString = "APPEND_TASKS_CANCELLED"
    else if (props.taskKey === "tasksRejected")
        selectorsString = "APPEND_TASKS_REJECTED"
    const notFoundSelector = createNotFoundSelector([selectorsString]);
    const endlessLoadEnd = useSelector(state => notFoundSelector(state));
    const isFetchingSelector = createSimpleLoadingSelector([selectorsString]);
    const endlessLoadIsFetching = useSelector(state => isFetchingSelector(state));
    const roleView = useSelector(state => state.roleView);
    const dispatchAppendFunctions = {
        tasksCancelled: (endlessLoadEnd || endlessLoadIsFetching) ? () => ({type: "IGNORE"}) : appendTasksCancelledRequest,
        tasksDelivered: (endlessLoadEnd || endlessLoadIsFetching) ? () => ({type: "IGNORE"}) : appendTasksDeliveredRequest,
        tasksRejected: (endlessLoadEnd || endlessLoadIsFetching) ? () => ({type: "IGNORE"}) : appendTasksRejectedRequest
    };
    let appendFunction = () => {
    };
    appendFunction = dispatchAppendFunctions[props.taskKey];
    const header =
        (props.taskKey === "tasksNew" && !props.hideAddButton) && props.showTasks === null ?
            <Button variant="contained" color="primary"
                    disabled={props.disableAddButton}
                    onClick={props.onAddTaskClick}
                    className={(props.taskKey === "tasksNew" && !props.hideAddButton) && props.showTasks === null ? show : hide}
            >
                Create New
            </Button> :
            <Typography className={classes.header}>{props.title}</Typography>


    const tasksList = Object.entries(tasks).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).reverse();
    const lastParent = tasksList.length === 0 ? 0 : tasksList[tasksList.length - 1][0]

    return (
        <TasksKanbanColumn>
            <Grid container direction={"column"} spacing={2} alignItems={"center"} justify={"flex-start"}>
                <Grid item>
                    {header}

                </Grid>
                <Grid item>
                    <Divider className={classes.divider}/>
                </Grid>
                <Grid item>
                    <Grid container
                          spacing={0}
                          direction={"column"}
                          justify={"flex-start"}
                          alignItems={"center"}
                          key={props.title + "column"}
                    >

                        {tasksList.map(([key, jobs]) => {
                            return (
                                <Grid item key={key}>
                                    <TaskGroup {...props} group={jobs}/>
                                </Grid>
                            )
                        })
                        }
                        {(["tasksDelivered", "tasksRejected", "tasksCancelled"].includes(props.taskKey)) ?
                            <React.Fragment>
                                <Waypoint
                                    onEnter={() => {
                                        if (props.showTasks)
                                            return;
                                        if (lastParent) {
                                            dispatch(appendFunction(
                                                whoami.uuid,
                                                1,
                                                roleView,
                                                props.taskKey,
                                                lastParent
                                            ))
                                        }
                                    }
                                    }
                                />
                                {endlessLoadIsFetching ?
                                    <div className={loaderClass.root}>
                                        <CircularProgress color="secondary"/>
                                    </div> : <></>}
                            </React.Fragment>

                            : <></>}

                    </Grid>
                </Grid>
            </Grid>
        </TasksKanbanColumn>
    )
}

GridColumn.propTypes = {
    title: PropTypes.string,
    classes: PropTypes.object,
    onAddTaskClick: PropTypes.func,
    onAddRelayClick: PropTypes.func,
    disableAddButton: PropTypes.bool,
    taskKey: PropTypes.string,
    showTasks: PropTypes.arrayOf(PropTypes.string),
}


function TasksGrid(props) {
    const classes = useStyles();
    const postingSelector = createPostingSelector(["ADD_TASK"]);
    const isPosting = useSelector(state => postingSelector(state));
    const loadingSelector = createLoadingSelector(['GET_TASKS']);
    const isFetching = useSelector(state => loadingSelector(state));
    const [filteredTasksUUIDs, setFilteredTasksUUIDs] = useState(null);
    const tasks = useSelector(state => state.tasks.tasks);
    const dispatch = useDispatch();
    const dashboardFilter = useSelector(state => state.dashboardFilter);
    const {show, hide} = showHide();


    const emptyTask = {
        requester_contact: {
            name: "",
            telephone_number: ""
        },
        assigned_riders: [],
        assigned_coordinators: [],
        time_picked_up: null,
        time_dropped_off: null,
        time_rejected: null,
        time_cancelled: null
    };

    const addEmptyTask = React.useCallback(() => {
        dispatch(addTaskRequest({
            ...emptyTask,
            time_of_call: new Date().toISOString(),
            time_created: new Date().toISOString()
        }))
    }, [])

    const addRelay = React.useCallback((data) => {
        dispatch(addTaskRelayRequest(data));
        dispatch(updateTaskDropoffAddressRequest(
            data.relay_previous_uuid,
            {dropoff_address: null}
        ));

    }, [])


    function doSearch() {
        const result = filterTasks(tasks, dashboardFilter)
        setFilteredTasksUUIDs(result);
    }

    useEffect(doSearch, [dashboardFilter])


    if (isFetching) {
        return <TasksGridSkeleton count={3}/>
    } else {
        return (
            <Grid container
                  spacing={2}
                  direction={"row"}
                  justify={"flex-start"}
                  alignItems={"stretch"}
            >
                {Object.keys(tasks).map(taskKey => {
                    const title = getColumnTitle(taskKey);
                    return (
                        <React.Fragment key={taskKey}>
                            <Grid item
                                  className={props.excludeColumnList && props.excludeColumnList.includes(taskKey) ? hide : show}>
                                <GridColumn title={title}
                                            classes={classes}
                                            onAddTaskClick={addEmptyTask}
                                            onAddRelayClick={addRelay}
                                            disableAddButton={isPosting}
                                            taskKey={taskKey}
                                            showTasks={filteredTasksUUIDs}
                                            key={title}/>

                            </Grid>
                        </React.Fragment>
                    )
                })}
            </Grid>
        )
    }
}

TasksGrid.defaultProps = {
    tasks: {initialTasksState}
}
TasksGrid.propTypes = {
    tasks: PropTypes.object,
    fullScreenModal: PropTypes.bool,
    modalView: PropTypes.string,
    hideRelayIcons: PropTypes.bool,
    hideAddButton: PropTypes.bool,
    excludeColumnList: PropTypes.arrayOf(PropTypes.string)
}

export default TasksGrid;
