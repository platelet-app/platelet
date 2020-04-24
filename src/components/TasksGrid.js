import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {AddCircleButton} from "../components/Buttons";
import TaskItem from "./TaskItem";
import {orderTaskList} from "../utilities";
import {createPostingSelector} from "../redux/selectors";
import {useSelector} from "react-redux";
import {TasksKanbanColumn} from "../css/TaskColumns";
import {TextFieldControlled} from "./TextFieldControlled";

function filterTasks(tasks, search) {
    if (!search) {
        return tasks;
    } else {
        return tasks.filter(task => {
            if (task.rider ? task.rider.display_name.toLowerCase().includes(search.toLowerCase()) : false) {
                return task
            } else if (task.patch ? task.patch.toLowerCase().includes(search.toLowerCase()) : false) {
                return task;
            } else if (task.priority ? task.priority.toLowerCase().includes(search.toLowerCase()) : false) {
                return task;
            } else if (task.dropoff_address ? task.dropoff_address.line1.toLowerCase().includes(search.toLowerCase()) : false) {
                return task;
            } else if (task.pickup_address ? task.pickup_address.line1.toLowerCase().includes(search.toLowerCase()) : false) {
                return task;
            } else if (task.pickup_address ? task.pickup_address.ward.toLowerCase().includes(search.toLowerCase()) : false) {
                return task;
            } else if (task.dropoff_address ? task.dropoff_address.ward.toLowerCase().includes(search.toLowerCase()) : false) {
                return task;
            }
        })
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
    const [filteredTasks, setFilteredTasks] = useState(props.tasks);
    const [searchQuery, setSearchQuery] = useState("");
    const emptyTask = {
        session_uuid: props.sessionUUID,
        time_of_call: new Date().toISOString(),
    };
    useEffect(() => setFilteredTasks(filterTasks(props.tasks, searchQuery)), [searchQuery, props.tasks]);
    return (<Grid container spacing={3} direction={"column"} alignItems={"flex-start"}>
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
                >
                    {Object.entries(orderTaskList(filteredTasks)).map(taskList => {
                        if (props.excludeColumnList && props.excludeColumnList.includes(taskList[0]))
                            return <></>
                        let newTaskButton = "";
                        if (props.sessionUUID && taskList[0] === "tasksNew" && !searchQuery) {
                            newTaskButton = <AddCircleButton disabled={isPosting} onClick={() => {
                                props.onAddTaskClick(emptyTask)
                            }}/>

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
                                                <TaskItem key={task.uuid} task={task} view={props.modalView}
                                                          fullScreenModal={props.fullScreenModal}
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