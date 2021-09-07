import React, { useEffect, useState } from "react";
import _ from "lodash";
import Grid from "@material-ui/core/Grid";
import TaskItem from "./TaskItem";
import {
    createLoadingSelector,
    createPostingSelector,
} from "../../../redux/LoadingSelectors";
import { useDispatch, useSelector } from "react-redux";
import { addTaskRelayRequest } from "../../../redux/tasks/TasksActions";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { filterTasks } from "../utilities/functions";
import PropTypes from "prop-types";
import { showHide } from "../../../styles/common";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import { getTasksSelector } from "../../../redux/Selectors";
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
        case "tasksDelivered":
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
        [theme.breakpoints.down("sm")]: {
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
            const {
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
                parent_id,
                relay_next,
                assigned_coordinators,
                assigned_coordinators_display_string,
            } = task;
            const dropoff_address = task.dropoff_location
                ? task.dropoff_location.address
                : null;
            const pickup_address = task.pickup_location
                ? task.pickup_location.address
                : null;

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
                        justify={"center"}
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
                                justify={"center"}
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
    const postingSelector = createPostingSelector(["ADD_TASK"]);
    const isPosting = useSelector((state) => postingSelector(state));
    const loadingSelector = createLoadingSelector(["GET_TASKS"]);
    const isFetching = useSelector((state) => loadingSelector(state));
    const [filteredTasksUUIDs, setFilteredTasksUUIDs] = useState(null);
    const [showGuidedSetup, setShowGuidedSetup] = useState(false);

    const tasks = useSelector(getTasksSelector);
    const roleView = useSelector((state) => state.roleView);
    const whoami = useSelector((state) => state.whoami.user);
    const dispatch = useDispatch();
    const dashboardFilter = useSelector((state) => state.dashboardFilter);
    const { show, hide } = showHide();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    const addRelay = React.useCallback((data) => {
        dispatch(addTaskRelayRequest(data));
    }, []);

    function doSearch() {
        const result = filterTasks(tasks, dashboardFilter);
        setFilteredTasksUUIDs(result);
    }

    useEffect(doSearch, [dashboardFilter]);

    return (
        <>
            <Grid
                container
                spacing={2}
                direction={"row"}
                justify={isSm ? "center" : "flex-start"}
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
                                onAddTaskClick={() => setShowGuidedSetup(true)}
                                onAddRelayClick={addRelay}
                                disableAddButton={isPosting}
                                taskKey={taskKey}
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
};

export default TasksGrid;
