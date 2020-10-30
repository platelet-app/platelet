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
    addTaskRelayRequest,
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


const GridColumn = React.memo((props) => {
        const dispatch = useDispatch();
        const classes = useStyles();
        const newTaskButton =
            props.showAddTaskButton ?
                <AddCircleButton
                    disabled={props.disableAddTaskButton}
                    onClick={props.onAddTaskClick}
                /> : <></>
        return (
            <TasksKanbanColumn style={{marginRight: "20px", display: props.hidden ? "none" : "inherit"}}>
                <h3>{props.title}</h3>
                <Grid container
                      spacing={0}
                      direction={"column"}
                      justify={"flex-start"}
                      alignItems={"center"}
                >
                    {newTaskButton}
                    {props.tasks.map(taskList => {
                        return !taskList ? <></> : taskList.map((task, i, arr) => {
                            const relayIcon = arr.length - 1 !== i ?
                                <Grid container alignItems={"center"} justify={"center"} className={classes.hoverDiv}>
                                    <Grid item>
                                        <Tooltip title="Relay">
                                            <ArrowDownwardIcon style={{height: "45px"}}/>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                                :
                                <Grid container alignItems={"center"} justify={"center"} className={classes.hoverDiv}>
                                    <Grid item>
                                        <Tooltip title={"Add Relay"}>
                                            <IconButton
                                                className={"hidden-button"}
                                                onClick={() => {
                                                    const {requester_contact, priority, priority_id, time_of_call, dropoff_address, parent_id} = {...task};
                                                    dispatch(addTaskRelayRequest({
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
                                                    }));
                                                    dispatch(updateTaskDropoffAddressRequest({
                                                        taskUUID: task.uuid,
                                                        payload: {dropoff_address: null},
                                                    }));
                                                }}
                                            >
                                                <ArrowDownwardIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>;

                            const {
                                pickup_address,
                                dropoff_address,
                                assigned_riders_display_string,
                                time_picked_up,
                                time_dropped_off,
                                time_of_call,
                                priority,
                                patch,
                                uuid,
                                assigned_riders
                            } = task;

                            return (
                                <>
                                    <TaskItem key={uuid}
                                              pickupAddress={pickup_address}
                                              assignedRidersDisplayString={assigned_riders_display_string}
                                              dropoffAddress={dropoff_address}
                                              timePickedUp={time_picked_up}
                                              timeDroppedOff={time_dropped_off}
                                              timeOfCall={time_of_call}
                                              priority={priority}
                                              patch={patch}
                                              assignedRiders={assigned_riders}
                                              taskUUID={uuid}
                                              view={props.modalView}
                                              deleteDisabled={props.deleteDisabled}/>
                                    {relayIcon}
                                </>
                            )

                        })
                    })
                    }

                </Grid>
            </TasksKanbanColumn>
        )
    }
)

export default function TasksGrid(props) {
    const postingSelector = createPostingSelector(["ADD_TASK"]);
    const isPosting = useSelector(state => postingSelector(state));
    const [filteredTasks, setFilteredTasks] = useState(initialTasksState);
    const tasks = useSelector(state => state.tasks.tasks);
    const [searchQuery, setSearchQuery] = useState("");

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
                    {Object.entries(filteredTasks).map(taskList => {
                        const title = getColumnTitle(taskList[0]);
                        return (
                            <Grid item xs sm md lg key={taskList[0]}>
                                <GridColumn title={title}
                                            hidden={props.excludeColumnList && props.excludeColumnList.includes(taskList[0])}
                                            onAddTaskClick={props.onAddTaskClick}
                                            showAddTaskButton={taskList[0] === "tasksNew" && !searchQuery && !props.hideAddButton}
                                            disableAddTaskButton={isPosting}
                                            tasks={taskList[1]}
                                            key={taskList[0]}/>
                                <Waypoint
                                    onEnter={() => {
                                        console.log("YAY ENTER")
                                    }
                                    }
                                    onLeave={() => console.log("YAY LEAVE")}
                                />
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
        </Grid>
    )
}
