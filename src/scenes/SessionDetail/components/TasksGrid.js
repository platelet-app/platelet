import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {AddCircleButton} from "../../../components/Buttons";
import TaskItem from "./TaskItem";
import {createPostingSelector} from "../../../redux/selectors";
import {useSelector} from "react-redux";
import {TasksKanbanColumn} from "../styles/TaskColumns";
import {TextFieldControlled} from "../../../components/TextFields";

const initialTasksState = {tasksNew: [], tasksActive: [], tasksPickedUp: [], tasksDelivered: []}

function filterTasks(tasks, search) {
    let result = initialTasksState;
    if (!search) {
        return tasks;
    } else {
        for (const [key, value] of Object.entries(tasks)) {
            result[key] = value.filter(task => {
                const searchTerm = search.toLowerCase();
                if (task.assigned_users_display_string ? task.assigned_users_display_string.toLowerCase().includes(searchTerm) : false) {
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
            return <h3>Picked up</h3>;
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

export default function TasksGrid(props) {
    const postingSelector = createPostingSelector(["ADD_TASK"]);
    const isPosting = useSelector(state => postingSelector(state));
    //const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState(initialTasksState);
    const tasks = useSelector(state => state.tasks.tasks);
    const [searchQuery, setSearchQuery] = useState("");

    function componentDidMount() {
        setFilteredTasks(filterTasks(tasks))
    }
    useEffect(componentDidMount, [])

    function doSearch() {
        const result = filterTasks(tasks, searchQuery)
        setFilteredTasks(result);
    }
    useEffect(doSearch, [searchQuery])
    //TODO: separate task columns into individual components so that there is less rerendering
    return (
        <Grid container spacing={3} direction={"column"} alignItems={"flex-start"} justify={"flex-start"}>
            <Grid item>
                {props.noFilter ? <></> : <TextFieldControlled label={"Search"} onChange={(e) => {
                    //const result = filterTasks(tasks, e.target.value)
                    //setFilteredTasks(result);
                    setSearchQuery(e.target.value)
                }}/>}
            </Grid>
            <Grid item>
                <Grid container
                      spacing={3}
                      direction={"row"}
                      justify={"flex-start"}
                      alignItems={"stretch"}
                >
                    {Object.entries(filteredTasks).map(taskList => {
                        if (props.excludeColumnList && props.excludeColumnList.includes(taskList[0]))
                            return <></>
                        let newTaskButton = "";
                        if (props.sessionUUID && taskList[0] === "tasksNew" && !searchQuery) {
                            newTaskButton = <AddCircleButton
                                disabled={isPosting}
                                onClick={props.onAddTaskClick}
                            />

                        }
                        const title = getColumnTitle(taskList[0]);
                        return (
                            <Grid item xs sm md lg key={taskList[0]}>
                                <TasksKanbanColumn>
                                    {title}
                                    <Grid container
                                          spacing={3}
                                          direction={"column"}
                                          justify={"flex-start"}
                                          alignItems={"center"}
                                    >
                                        {newTaskButton}
                                        {taskList[1].map(task => {
                                            return (
                                                <TaskItem key={task.uuid}
                                                          task={task}
                                                          view={props.modalView}
                                                          location={props.location}
                                                          deleteDisabled={props.deleteDisabled}/>
                                            )
                                        })}
                                    </Grid>
                                </TasksKanbanColumn>
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
        </Grid>
    )
}