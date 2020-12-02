import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import TaskItem from "./TaskItem";
import {createLoadingSelector, createPostingSelector} from "../../../redux/selectors";
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
import {Typography} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import TasksGridSkeleton from "./TasksGridSkeleton";
import PropTypes from 'prop-types'
import {initialTasksState} from "../../../redux/tasks/TasksReducers";
import {showHide} from "../../../styles/common";


const getColumnTitle = key => {
    switch (key) {
        case "tasksNew":
            return "New";
        case "tasksActive":
            return "Active";
        case "tasksPickedUp":
            return "Picked Up";
        case "tasksDelivered":
            return "Delivered";
        case "tasksRejected":
            return "Rejected";
        case "tasksCancelled":
            return "Cancelled";
        case "tasksRejectedCancelled":
            return "Rejected/Cancelled";
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
    return !props.group ? <></> : props.group.map((task, i, arr) => {
        const {
            pickup_address,
            dropoff_address,
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


const GridColumn = (props) => {
    const classes = useStyles();
    const {show, hide} = showHide();
    const tasks = useSelector(state => state.tasks.tasks[props.taskKey]);
    const header =
        (props.taskKey === "tasksNew" && !props.hideAddButton) && props.showTasks === null ?
            <Button variant="contained" color="primary"
                    disabled={props.disableAddButton}
                    onClick={props.onAddTaskClick}
                    className={(props.taskKey === "tasksNew" && !props.hideAddButton) && props.showTasks === null ? show : hide}
            >Create New</Button> :
            <Typography className={classes.header}>{props.title}</Typography>

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

                        {tasks.map(taskList => {
                            return (
                                <TaskGroup {...props} group={taskList} key={taskList[0].parent_id}/>
                            )
                        })}

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
        dispatch(updateTaskDropoffAddressRequest({
            taskUUID: data.relay_previous_uuid,
            payload: {dropoff_address: null}
        }));

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
                            <Grid item className={props.excludeColumnList && props.excludeColumnList.includes(taskKey) ? hide : show}>
                                <GridColumn title={title}
                                            classes={classes}
                                            onAddTaskClick={addEmptyTask}
                                            onAddRelayClick={addRelay}
                                            disableAddButton={isPosting}
                                            taskKey={taskKey}
                                            showTasks={filteredTasksUUIDs}
                                            key={title}/>
                                <Waypoint
                                    onEnter={() => {
                                        console.log("YAY ENTER")
                                    }
                                    }
                                    onLeave={() => console.log("YAY LEAVE")}
                                />
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
