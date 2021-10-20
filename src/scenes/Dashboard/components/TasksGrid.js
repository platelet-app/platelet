import React, { useEffect, useState } from "react";
import _ from "lodash";
import Grid from "@mui/material/Grid";
import TaskItem from "./TaskItem";
import { useDispatch, useSelector } from "react-redux";
import { addTaskRelayRequest } from "../../../redux/tasks/TasksActions";
import Tooltip from "@mui/material/Tooltip";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { filterTasks } from "../utilities/functions";
import PropTypes from "prop-types";
import { showHide } from "../../../styles/common";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import { GuidedSetup } from "../../GuidedSetup/GuidedSetup";
import TasksGridColumn from "./TasksGridColumn";
import columns from "./tasksGridColumns";

const getColumnTitle = (key) => {
    switch (key) {
        case "tasksNew":
            return "New".toUpperCase();
        case "tasksActive":
            return "Active".toUpperCase();
        case "tasksPickedUp":
            return "Picked Up".toUpperCase();
        case "tasksDroppedOff":
            return "Delivered".toUpperCase();
        case "tasksRejected":
            return "Rejected".toUpperCase();
        case "tasksCancelled":
            return "Cancelled".toUpperCase();
        case "tasksRejectedCancelled":
            return "Rejected/Cancelled".toUpperCase();
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
    const [filteredTasksUUIDs, setFilteredTasksUUIDs] = useState(null);
    const [showGuidedSetup, setShowGuidedSetup] = useState(false);

    const dispatch = useDispatch();
    const dashboardFilter = useSelector((state) => state.dashboardFilter);
    const { show, hide } = showHide();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));

    const addRelay = React.useCallback((data) => {
        dispatch(addTaskRelayRequest(data));
    }, []);

    function doSearch() {
        const result = filterTasks(props.tasks, dashboardFilter);
        setFilteredTasksUUIDs(result);
    }

    useEffect(doSearch, [dashboardFilter, props.tasks]);

    return (
        <>
            <Grid
                container
                spacing={2}
                direction={"row"}
                justifyContent={isSm ? "center" : "flex-start"}
                alignItems={"stretch"}
            >
                {Object.keys(columns).map((taskKey) => {
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
                                onAddRelayClick={addRelay}
                                deleteDisabled
                                taskKey={taskKey}
                                tasks={props.tasks[taskKey]}
                                showTasks={filteredTasksUUIDs}
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
