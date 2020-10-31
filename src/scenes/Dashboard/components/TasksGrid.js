import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {AddCircleButton} from "../../../components/Buttons";
import TaskItem from "./TaskItem";
import {createPostingSelector} from "../../../redux/selectors";
import {useDispatch, useSelector} from "react-redux";
import {TasksKanbanColumn} from "../styles/TaskColumns";
import {TextFieldControlled} from "../../../components/TextFields";
import {Waypoint} from "react-waypoint";
import {
    addTaskRelayRequest, addTaskRequest,
    updateTaskDropoffAddressRequest
} from "../../../redux/tasks/TasksActions";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";

const initialTasksState = {tasksNew: [], tasksActive: [], tasksPickedUp: [], tasksDelivered: []}


function filterTasks(tasks, search) {
    let result = initialTasksState;
    if (!search) {
        return tasks;
    } else {
        for (const [key, value] of Object.entries(tasks)) {
            result[key] = value.filter(task => {
                const searchTerm = search.toLowerCase();
                if (task.assigned_riders_display_string ? task.assigned_riders_display_string.toLowerCase().includes(searchTerm) : false) {
                    return task
                } else if (task.patch ? task.patch.toLowerCase().includes(searchTerm) : false) {
                    return task;
                } else if (task.priority ? task.priority.toLowerCase().includes(searchTerm) : false) {
                    return task;
                } else if (task.dropoff_address ? task.dropoff_address.line1.toLowerCase().includes(searchTerm) : false) {
                    return task;
                } else if (task.pickup_address ? task.pickup_address.line1.toLowerCase().includes(searchTerm) : false) {
                    return task;
                } else if (task.pickup_address && task.pickup_address.ward ? task.pickup_address.ward.toLowerCase().includes(searchTerm) : false) {
                    return task;
                } else if (task.dropoff_address && task.dropoff_address.ward ? task.dropoff_address.ward.toLowerCase().includes(searchTerm) : false) {
                    return task;
                }
            })
        }
        return result;
    }
}

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
        height: "45px",
        "& .hidden-button": {
            display: "none"
        },
        "&:hover .hidden-button": {
            display: "inline"
        }
    }
}));

const emptyTask = {
    time_created: new Date().toISOString(),
    assigned_riders: [],
    assigned_coordinators: [],
    time_picked_up: null,
    time_dropped_off: null,
    time_rejected: null,
    time_cancelled: null
};


const TaskGroup = props => {
    const classes = props.classes;
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
            requester_contact,
            priority_id,
            parent_id
        } = task;
        const relayStatus = (arr.length - 1 !== i)

        return (
            <React.Fragment key={uuid}>
                <TaskItem
                    pickupAddress={pickup_address}
                    assignedRidersDisplayString={assigned_riders_display_string}
                    dropoffAddress={dropoff_address}
                    timePickedUp={time_picked_up}
                    timeDroppedOff={time_dropped_off}
                    timeRejected={time_rejected}
                    timeCancelled={time_cancelled}
                    timeOfCall={time_of_call}
                    priority={priority}
                    patch={patch}
                    assignedRiders={assigned_riders}
                    taskUUID={uuid}
                    view={props.modalView}
                    deleteDisabled={props.deleteDisabled}/>
                <Grid container alignItems={"center"} justify={"center"} className={classes.hoverDiv}>
                    <Grid style={{display: relayStatus ? "inherit" : "none"}} item>
                        <Tooltip title="Relay">
                            <ArrowDownwardIcon style={{height: "45px"}}/>
                        </Tooltip>
                    </Grid>
                    <Grid style={{display: relayStatus ? "none" : "inherit"}} item>
                        <Tooltip title={"Add Relay"}>
                            <IconButton
                                className={"hidden-button"}
                                onClick={() => {
                                    props.onAddRelayClick({
                                        ...emptyTask,
                                        time_of_call,
                                        requester_contact: requester_contact ? requester_contact : {
                                            name: "",
                                            telephone_number: ""
                                        },
                                        priority,
                                        priority_id,
                                        dropoff_address,
                                        parent_id,
                                        relay_previous_uuid: task.uuid
                                    })
                                }}
                            >
                                <ArrowDownwardIcon/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </React.Fragment>
    )
    })
}

    const GridColumn = (props) => {
        const tasks = useSelector(state => state.tasks.tasks[props.taskKey]);
        return (
            <TasksKanbanColumn style={{marginRight: "20px", display: props.hidden ? "none" : "inherit"}}>
                <h3>{props.title}</h3>
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
            </TasksKanbanColumn>
        )
    }




    export default function TasksGrid(props) {
        const classes = useStyles();
        const postingSelector = createPostingSelector(["ADD_TASK"]);
        const isPosting = useSelector(state => postingSelector(state));
        const [filteredTasks, setFilteredTasks] = useState(initialTasksState);
        const tasks = useSelector(state => state.tasks.tasks);
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch();


    const emptyTask = {
        time_of_call: new Date().toISOString(),
        time_created: new Date().toISOString(),
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
        dispatch(addTaskRequest(emptyTask))
    }, [])

    const addRelay = React.useCallback((data) => {
        dispatch(addTaskRelayRequest(data));
        dispatch(updateTaskDropoffAddressRequest({
            taskUUID: data.relay_previous_uuid,
            payload: {dropoff_address: null}
        }));

    }, [])


    function updateFilteredTasks() {
        setFilteredTasks(filterTasks(tasks))
    }

    useEffect(updateFilteredTasks, [tasks])

    function doSearch() {
        const result = filterTasks(tasks, searchQuery)
        setFilteredTasks(result);
    }

    useEffect(doSearch, [searchQuery])
    return (
        <Grid container spacing={3} direction={"column"} alignItems={"flex-start"} justify={"flex-start"}>
            <Grid item key={"search"}>
                {props.noFilter ? <></> : <TextFieldControlled label={"Search"} onChange={(e) => {
                    setSearchQuery(e.target.value)
                }}/>}
            </Grid>
            <Grid item key={"tasks"}>
                <Grid container
                      spacing={0}
                      direction={"row"}
                      justify={"flex-start"}
                      alignItems={"stretch"}
                      wrap={"nowrap"}
                >
                    {Object.keys(filteredTasks).map(taskKey => {
                        const title = getColumnTitle(taskKey);
                        return (
                            <React.Fragment key={taskKey}>
                                <Grid item>
                                    <AddCircleButton
                                        disabled={isPosting}
                                        onClick={addEmptyTask}
                                        style={{display: (taskKey === "tasksNew" && !searchQuery && !props.hideAddButton) ? "inherit" : "none"}}
                                    />
                                </Grid>
                                <Grid item xs sm md lg>
                                    <GridColumn title={title}
                                                classes={classes}
                                                hidden={props.excludeColumnList && props.excludeColumnList.includes(taskKey)}
                                                onAddTaskClick={addEmptyTask}
                                                onAddRelayClick={addRelay}
                                                taskKey={taskKey}
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
            </Grid>
        </Grid>
    )
}
