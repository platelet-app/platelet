import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {AddCircleButton} from "../components/Buttons";
import TaskItem from "./TaskItem";
import {orderTaskList} from "../utilities";
import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {createLoadingSelector, createPostingSelector} from "../redux/selectors";
import {useSelector} from "react-redux";

const useStyles = makeStyles(({
    box: {
        border: 0,
        boxShadow: '0 4px 6px 3px rgba(100, 100, 100, .3)',
        borderRadius: 5,
        height: "100%",
        minWidth: "250px",
        maxWidth: "400px",
        background: "rgba(255, 255, 255, 0.8)",
        padding: "20px"
    },
}));

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



export default function TasksGrid(props) {
    const loadingSelector = createPostingSelector(["ADD_TASK"]);
    const isPosting = useSelector(state => loadingSelector(state));
    console.log(isPosting);
    const emptyTask = {
        session_uuid: props.sessionUUID,
        timestamp: new Date().toISOString(),
    };
    const classes = useStyles();
    return (
    <Grid container
          spacing={3}
          direction={"row"}
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
                    <Box className={classes.box}>
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
                                    <TaskItem task={task} view={props.modalView} fullScreenModal={props.fullScreenModal}
                                              location={props.location} deleteDisabled={props.deleteDisabled}/>
                                )
                            })}
                        </Grid>
                    </Box>
                </Grid>
            )
        })}
    </Grid>
    )
}