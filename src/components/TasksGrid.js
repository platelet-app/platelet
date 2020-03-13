import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {StyledAddCircleOutline} from "../css/common";
import TaskItem from "./TaskItem";
import {orderTaskList} from "../utilities";
import makeStyles from "@material-ui/core/styles/makeStyles";

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
        default:
            return ""
    }
};

const circleAdd = (callback, sessionUUID) => {
    const emptyTask = {
        session_uuid: sessionUUID,
        timestamp: new Date().toISOString(),
    };
    return (
    <StyledAddCircleOutline
        onClick={() => {
            callback(emptyTask)
        }
        }
    />);
}

export default function TasksGrid(props) {
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
                newTaskButton = circleAdd(props.onAddTaskClick, props.sessionUUID)

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