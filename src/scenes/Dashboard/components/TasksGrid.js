import React, {useEffect, useMemo, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {AddCircleButton} from "../../../components/Buttons";
import TaskItem from "./TaskItem";
import {createPostingSelector} from "../../../redux/selectors";
import {useDispatch, useSelector} from "react-redux";
import {TasksKanbanColumn} from "../styles/TaskColumns";
import {TextFieldControlled} from "../../../components/TextFields";
import {task} from "../../../redux/tasks/TasksReducers";
import {Waypoint} from "react-waypoint";
import {
    addTaskRelayRequest, addTaskRequest,
    getAllTasksRequest,
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
            return <h3>New</h3>;
        case "tasksActive":
            return <h3>Active</h3>;
        case "tasksPickedUp":
            return <h3>Picked Up</h3>;
        case "tasksDelivered":
            return <h3>Delivered</h3>;
        case "tasksRejected":
            return <h3>Rejected</h3>;
        case "tasksCancelled":
            return <h3>Cancelled</h3>;
        case "tasksRejectedCancelled":
            return <h3>Rejected/Cancelled</h3>;
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
        return (
            <TasksKanbanColumn>
                {props.title}
                <Grid container
                      spacing={0}
                      direction={"column"}
                      justify={"flex-start"}
                      alignItems={"center"}
                >
                    {props.newTaskButton}
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
                                                    //dispatch(updateTaskDropoffAddressRequest({
                                                     //   taskUUID: task.uuid,
                                                    //    payload: {dropoff_address: null},
                                                    //}));
                                                }}
                                            >
                                                <ArrowDownwardIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>;
                            return (
                                <>
                                    {task.parent_id}
                                    <TaskItem key={task.uuid}
                                              task={task}
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
            <Grid item>
                {props.noFilter ? <></> : <TextFieldControlled label={"Search"} onChange={(e) => {
                    setSearchQuery(e.target.value)
                }}/>}
            </Grid>
            <Grid item>
                <Grid container
                      spacing={3}
                      direction={"row"}
                      justify={"flex-start"}
                      alignItems={"stretch"}
                      wrap={"nowrap"}
                >
                    {Object.entries(filteredTasks).map(taskList => {
                        if (props.excludeColumnList && props.excludeColumnList.includes(taskList[0]))
                            return <></>
                        let newTaskButton = "";
                        if (taskList[0] === "tasksNew" && !searchQuery && !props.hideAddButton) {
                            newTaskButton = <AddCircleButton
                                disabled={isPosting}
                                onClick={props.onAddTaskClick}
                            />

                        }
                        const title = getColumnTitle(taskList[0]);
                        return (
                            <Grid item xs sm md lg key={taskList[0]}>
                                <GridColumn title={title} newTaskButton={newTaskButton} tasks={taskList[1]}/>
                                <Waypoint
                                    onEnter={() => {
                                        // dispatch(getAllTasksRequest("42acdac8-8d07-4c4b-b698-dd81ed44b561", "2"))
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
