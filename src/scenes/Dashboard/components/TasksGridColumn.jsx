import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import Grid from "@material-ui/core/Grid";
import TaskItem from "./TaskItem";
import { dashboardQuery } from "../queries/tasksGridQuery";
import {
    createNotFoundSelector,
    createSimpleLoadingSelector,
} from "../../../redux/LoadingSelectors";
import { useDispatch, useSelector } from "react-redux";
import { TasksKanbanColumn } from "../styles/TaskColumns";
import Button from "@material-ui/core/Button";
import { Waypoint } from "react-waypoint";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { CircularProgress, Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import TasksGridSkeleton from "./TasksGridSkeleton";
import PropTypes from "prop-types";
import { showHide } from "../../../styles/common";
import {
    appendTasksCancelledRequest,
    appendTasksDeliveredRequest,
    appendTasksRejectedRequest,
} from "../../../redux/tasks/TasksWaypointActions";
import { clearDashboardFilter } from "../../../redux/dashboardFilter/DashboardFilterActions";
import clsx from "clsx";
import { API } from "aws-amplify";
import { makeStyles } from "@material-ui/core";
import columns from "./tasksGridColumns";

const loaderStyles = makeStyles((theme) => ({
    linear: {
        width: "100%",
        "& > * + *": {
            marginTop: theme.spacing(2),
        },
    },
    circular: {
        display: "flex",
        "& > * + *": {
            marginLeft: theme.spacing(2),
        },
    },
}));

const useStyles = makeStyles((theme) => ({
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
    gridItem: {
        width: "100%",
    },
}));

function TasksGridColumn(props) {
    const classes = useStyles();
    const loaderClass = loaderStyles();
    const { show, hide } = showHide();
    const dispatch = useDispatch();
    //const tasks = useSelector(getTasksSelector)[props.taskKey];
    const [tasks, setTasks] = useState([]);
    const whoami = useSelector((state) => state.whoami.user);
    let selectorsString = "";
    if (props.taskKey === "tasksDelivered")
        selectorsString = "APPEND_TASKS_DELIVERED";
    else if (props.taskKey === "tasksCancelled")
        selectorsString = "APPEND_TASKS_CANCELLED";
    else if (props.taskKey === "tasksRejected")
        selectorsString = "APPEND_TASKS_REJECTED";
    const notFoundSelector = createNotFoundSelector([selectorsString]);
    const endlessLoadEnd = useSelector((state) => notFoundSelector(state));
    const isFetchingSelector = createSimpleLoadingSelector([selectorsString]);
    const endlessLoadIsFetching = useSelector((state) =>
        isFetchingSelector(state)
    );
    const roleView = useSelector((state) => state.roleView);
    const [isFetching, setIsFetching] = useState(false);
    const dispatchAppendFunctions = {
        tasksCancelled:
            endlessLoadEnd || endlessLoadIsFetching
                ? () => ({ type: "IGNORE" })
                : appendTasksCancelledRequest,
        tasksDelivered:
            endlessLoadEnd || endlessLoadIsFetching
                ? () => ({ type: "IGNORE" })
                : appendTasksDeliveredRequest,
        tasksRejected:
            endlessLoadEnd || endlessLoadIsFetching
                ? () => ({ type: "IGNORE" })
                : appendTasksRejectedRequest,
    };
    let appendFunction = () => {};
    appendFunction = dispatchAppendFunctions[props.taskKey];

    async function getTasks() {
        setIsFetching(true);
        try {
            const tasksData = await API.graphql({
                query: dashboardQuery,
                variables: { status: columns[props.taskKey] },
            });
            setIsFetching(false);
            const tasks = tasksData.data.tasksByStatus.items;
            setTasks(tasks);
        } catch (error) {
            setIsFetching(false);
            console.log("Request failed", error);
        }
    }
    useEffect(() => getTasks(), []);

    const header =
        props.taskKey === "tasksNew" &&
        !props.hideAddButton &&
        props.showTasks === null ? (
            <React.Fragment>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={props.disableAddButton}
                    onClick={props.onAddTaskClick}
                    className={
                        props.taskKey === "tasksNew" &&
                        !props.hideAddButton &&
                        props.showTasks === null
                            ? show
                            : hide
                    }
                >
                    Create New
                </Button>
            </React.Fragment>
        ) : props.showTasks !== null && props.taskKey === "tasksNew" ? (
            <Button
                variant="contained"
                color="primary"
                disabled={props.disableAddButton}
                onClick={() => dispatch(clearDashboardFilter())}
            >
                Clear Search
            </Button>
        ) : (
            <Typography className={classes.header}>{props.title}</Typography>
        );

    // const tasksList = Object.entries(tasks)
    //     .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    //     .reverse();
    // const lastParent =
    //     tasksList.length === 0 ? 0 : tasksList[tasksList.length - 1][0];

    const animate = useRef(false);
    useEffect(() => {
        animate.current = !isFetching;
    }, [isFetching]);

    if (isFetching) {
        return <TasksGridSkeleton />;
    } else {
        return (
            <TasksKanbanColumn>
                <Grid
                    container
                    direction={"column"}
                    spacing={2}
                    alignItems={"center"}
                    justify={"flex-start"}
                >
                    <Grid item>{header}</Grid>
                    <Grid item>
                        <Divider className={classes.divider} />
                    </Grid>
                    <Grid
                        container
                        item
                        spacing={0}
                        direction={"column"}
                        justify={"flex-start"}
                        alignItems={"center"}
                        key={props.title + "column"}
                    >
                        {tasks.map((task) => {
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
                                    <Grid item className={classes.gridItem}>
                                        <TaskItem
                                            animate={animate}
                                            {...task}
                                            taskUUID={task.id}
                                            view={props.modalView}
                                            deleteDisabled={
                                                props.deleteDisabled
                                            }
                                        />
                                        <Grid
                                            container
                                            alignItems={"center"}
                                            justify={"center"}
                                            className={classes.spacer}
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
                                                        style={{
                                                            height: "35px",
                                                        }}
                                                    />
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </div>
                            );
                        })}
                        {[
                            "tasksDelivered",
                            "tasksRejected",
                            "tasksCancelled",
                        ].includes(props.taskKey) ? (
                            <React.Fragment>
                                <Waypoint
                                    onEnter={() => {
                                        if (props.showTasks) return;
                                        if (false) {
                                            dispatch(
                                                appendFunction(
                                                    whoami.uuid,
                                                    1,
                                                    roleView,
                                                    props.taskKey,
                                                    null
                                                )
                                            );
                                        }
                                    }}
                                />
                                {endlessLoadIsFetching ? (
                                    <div className={loaderClass.root}>
                                        <CircularProgress color="secondary" />
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </React.Fragment>
                        ) : (
                            <></>
                        )}
                    </Grid>
                </Grid>
            </TasksKanbanColumn>
        );
    }
}

TasksGridColumn.propTypes = {
    title: PropTypes.string,
    classes: PropTypes.object,
    onAddTaskClick: PropTypes.func,
    onAddRelayClick: PropTypes.bool,
    disableAddButton: PropTypes.bool,
    taskKey: PropTypes.string,
    showTasks: PropTypes.arrayOf(PropTypes.string),
};

export default TasksGridColumn;
