import React, { useState } from "react";
import _ from "lodash";
import Grid from "@mui/material/Grid";
import TaskItem from "./TaskItem";
import { useSelector } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PropTypes from "prop-types";
import { showHide } from "../../../styles/common";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import { GuidedSetup } from "../../GuidedSetup/GuidedSetup";
import TasksGridColumn from "./TasksGridColumn";
import { tasksStatus } from "../../../apiConsts";

const getColumnTitle = (key) => {
    switch (key) {
        case tasksStatus.new:
            return "New".toUpperCase();
        case tasksStatus.active:
            return "Active".toUpperCase();
        case tasksStatus.pickedUp:
            return "Picked Up".toUpperCase();
        case tasksStatus.droppedOff:
            return "Delivered".toUpperCase();
        case tasksStatus.rejected:
            return "Rejected".toUpperCase();
        case tasksStatus.cancelled:
            return "Cancelled".toUpperCase();
        default:
            return "";
    }
};

const useStyles = makeStyles((theme) => ({
    addRelay: {
        visibility: "hidden",
        "&:hover $hoverDiv": {
            visibility: "visible",
        },
    },
    header: {
        fontWeight: "bold",
        padding: "6px",
    },
    divider: {
        width: "95%",
    },
    spacer: {
        height: 35,
    },
    taskItem: {
        width: "100%",
    },
    column: {
        [theme.breakpoints.down("md")]: {
            width: "100%",
        },
    },
}));

const taskGroupStyles = makeStyles({
    hoverDiv: {
        width: "100%",
        height: "35px",
        "& .hidden-button": {
            display: "none",
        },
        "&:hover .hidden-button": {
            display: "inline",
        },
    },
    root: {
        width: "100%",
    },
});

const TaskGroup = (props) => {
    const classes = taskGroupStyles();
    const { show, hide } = showHide();
    const taskArr = Object.values(props.group).map((value) => value);
    const roleView = useSelector((state) => state.roleView);

    //taskArr.sort((a, b) => a.orderInRelay - b.orderInRelay);
    return taskArr.length === 0 ? (
        <></>
    ) : (
        taskArr.map((task, i, arr) => {
            return (
                <div
                    className={clsx(
                        classes.taskItem,
                        props.showTasks === null ||
                            props.showTasks.includes(task.id)
                            ? show
                            : hide
                    )}
                    key={task.id}
                >
                    <Grid
                        container
                        className={classes.root}
                        alignItems={"center"}
                        justifyContent={"center"}
                    >
                        <Grid item className={classes.root}>
                            <TaskItem
                                animate={props.animate}
                                timeOfCall={task.timeOfCall}
                                assignedCoordinatorsDisplayString={
                                    task.assignedCoordinatorsDisplayString
                                }
                                assignedRidersDisplayString={
                                    task.assignedRidersDisplayString
                                }
                                timePickedUp={task.timePickedUp}
                                assignedRiders={[]}
                                assignedCoordinators={[]}
                                timeDroppedOff={task.timeDroppedOff}
                                timeRejected={task.timeRejected}
                                timeCancelled={task.timeCancelled}
                                relayNext={task.relayNext}
                                taskUUID={task.id}
                                parentID={1}
                                view={props.modalView}
                                deleteDisabled={props.deleteDisabled}
                            />
                            <Grid
                                container
                                alignItems={"center"}
                                justifyContent={"center"}
                            >
                                <Grid
                                    className={
                                        !!task.relayNext &&
                                        props.showTasks === null &&
                                        !props.hideRelayIcons &&
                                        roleView !== "rider"
                                            ? show
                                            : hide
                                    }
                                    item
                                >
                                    <Tooltip title="Relay">
                                        <ArrowDownwardIcon
                                            style={{ height: "35px" }}
                                        />
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            );
        })
    );
};

TaskGroup.propTypes = {
    showTasks: PropTypes.arrayOf(PropTypes.string),
};

function TasksGrid(props) {
    const classes = useStyles();
    const [showGuidedSetup, setShowGuidedSetup] = useState(false);
    const { show, hide } = showHide();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <>
            <Grid
                container
                spacing={2}
                direction={"row"}
                justifyContent={isSm ? "center" : "flex-start"}
                alignItems={"stretch"}
            >
                {[
                    tasksStatus.new,
                    tasksStatus.active,
                    tasksStatus.pickedUp,
                    tasksStatus.droppedOff,
                    tasksStatus.cancelled,
                    tasksStatus.rejected,
                ].map((taskKey) => {
                    const title = getColumnTitle(taskKey);
                    return (
                        <Grid
                            item
                            key={taskKey}
                            className={clsx([
                                props.excludeColumnList &&
                                props.excludeColumnList.includes(taskKey)
                                    ? hide
                                    : show,
                                classes.column,
                            ])}
                        >
                            <TasksGridColumn
                                title={title}
                                classes={classes}
                                onAddTaskClick={props.onAddTaskClick}
                                deleteDisabled
                                taskKey={taskKey}
                                showTasks={props.showTaskIds}
                                key={title}
                            />
                        </Grid>
                    );
                })}
            </Grid>
            <GuidedSetup
                show={showGuidedSetup}
                onClose={() => setShowGuidedSetup(false)}
            />
        </>
    );
}

TasksGrid.propTypes = {
    fullScreenModal: PropTypes.bool,
    modalView: PropTypes.string,
    hideRelayIcons: PropTypes.bool,
    hideAddButton: PropTypes.bool,
    excludeColumnList: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
};

export default TasksGrid;
