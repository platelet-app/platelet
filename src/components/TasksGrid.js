import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {AddCircleButton} from "../components/Buttons";
import TaskItem from "./TaskItem";
import {orderTaskList} from "../utilities";
import {createPostingSelector} from "../redux/selectors";
import {useSelector} from "react-redux";
import {TasksKanbanColumn, TasksSheetColumn} from "../css/TaskColumns";


const getColumnTitle = key => {
    switch (key) {
        case "tasksNew":
            return <Typography><h3>New</h3></Typography>;
        case "tasksActive":
            return <Typography><h3>Active</h3></Typography>;
        case "tasksPickedUp":
            return <Typography><h3>Picked up</h3></Typography>;
        case "tasksDelivered":
            return <Typography><h3>Delivered</h3></Typography>;
        case "tasksRejected":
            return <Typography><h3>Rejected</h3></Typography>;
        case "tasksCancelled":
            return <Typography><h3>Cancelled</h3></Typography>;
        case "tasksRejectedCancelled":
            return <Typography><h3>Rejected/Cancelled</h3></Typography>;
        default:
            return ""
    }
};

function Column(props)
{
    if (props.kanbanMode) {
        return (
            <TasksKanbanColumn>
                {props.children}
            </TasksKanbanColumn>
        )
    } else {
        return(
            <TasksSheetColumn>
                {props.children}
            </TasksSheetColumn>
        )

    }

}


export default function TasksGrid(props) {
    const loadingSelector = createPostingSelector(["ADD_TASK"]);
    const isPosting = useSelector(state => loadingSelector(state));
    const kanbanMode = useSelector(state => state.kanbanMode);
    const emptyTask = {
        session_uuid: props.sessionUUID,
        timestamp: new Date().toISOString(),
    };
    return (
    <Grid container
          spacing={3}
          direction={ kanbanMode ? "row" : "column"}
          justify={"flex-start"}
          alignItems={"stretch"}
    >
        {Object.entries(orderTaskList(props.tasks)).map(taskList => {
            if (props.excludeColumnList && props.excludeColumnList.includes(taskList[0]))
                return <></>
            let newTaskButton = "";
            if (props.sessionUUID && taskList[0] === "tasksNew") {
                newTaskButton = <AddCircleButton disabled={isPosting} onClick={() => {props.onAddTaskClick(emptyTask)}}/>

            }
            const title = getColumnTitle(taskList[0]);
            return (
                <Grid item xs sm md lg key={taskList[0]}>
                    <Column kanbanMode={kanbanMode}>
                        {title}
                        <Grid container
                              spacing={kanbanMode ? 3 : 0}
                              direction={"column"}
                              justify={"flex-start"}
                              alignItems={"center"}
                        >
                            {newTaskButton}
                            {taskList[1].map(task => {
                                return (
                                    <TaskItem task={task} kanban={kanbanMode} view={props.modalView} fullScreenModal={props.fullScreenModal}
                                              location={props.location} deleteDisabled={props.deleteDisabled}/>
                                )
                            })}
                        </Grid>
                    </Column>
                </Grid>
            )
        })}
    </Grid>
    )
}