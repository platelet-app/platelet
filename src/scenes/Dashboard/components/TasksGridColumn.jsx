import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import TaskItem from "./TaskItem";
import * as models from "../../../models/index";
import {
    createNotFoundSelector,
    createSimpleLoadingSelector,
} from "../../../redux/LoadingSelectors";
import { useDispatch, useSelector } from "react-redux";
import { TasksKanbanColumn } from "../styles/TaskColumns";
import { Waypoint } from "react-waypoint";
import Tooltip from "@mui/material/Tooltip";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { CircularProgress, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { showHide } from "../../../styles/common";
import {
    appendTasksCancelledRequest,
    appendTasksDeliveredRequest,
    appendTasksRejectedRequest,
} from "../../../redux/tasks/TasksWaypointActions";
import clsx from "clsx";
import makeStyles from "@mui/styles/makeStyles";
import {
    dataStoreReadyStatusSelector,
    getWhoami,
} from "../../../redux/Selectors";
import { convertListDataToObject, sortByCreatedTime } from "../../../utilities";
import { DataStore } from "aws-amplify";
import { tasksStatus, userRoles } from "../../../apiConsts";
import { filterTasks } from "../utilities/functions";

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

function addAssigneesAndConvertToObject(tasks, allAssignees) {
    const finalResult = {};
    for (const t of tasks) {
        const assignmentsFiltered = allAssignees.filter(
            (a) => a.task.id === t.id
        );
        const assignees = convertListDataToObject(assignmentsFiltered);
        finalResult[t.id] = { ...t, assignees };
    }

    return finalResult;
}

function TasksGridColumn(props) {
    const classes = useStyles();
    const [state, setState] = useState([]);
    const loaderClass = loaderStyles();
    const { show, hide } = showHide();
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [isFetching, setIsFetching] = useState(false);
    const dispatch = useDispatch();
    const [filteredTasksIds, setFilteredTasksIds] = useState(null);
    const whoami = useSelector(getWhoami);
    let selectorsString = "";
    if (props.taskKey === "tasksDroppedOff")
        selectorsString = "APPEND_TASKS_DELIVERED";
    else if (props.taskKey === "tasksCancelled")
        selectorsString = "APPEND_TASKS_CANCELLED";
    else if (props.taskKey === "tasksRejected")
        selectorsString = "APPEND_TASKS_REJECTED";
    const notFoundSelector = createNotFoundSelector([selectorsString]);
    const endlessLoadEnd = useSelector((state) => notFoundSelector(state));
    const isFetchingSelector = createSimpleLoadingSelector([selectorsString]);
    const dashboardFilter = useSelector((state) => state.dashboardFilter);
    const endlessLoadIsFetching = useSelector((state) =>
        isFetchingSelector(state)
    );
    const roleView = useSelector((state) => state.roleView);
    const tasksSubscription = useRef({
        unsubscribe: () => {},
    });
    const previousRoleView = useRef(null);

    useEffect(() => console.log(filteredTasksIds), [filteredTasksIds]);

    function addTaskToState(newTask) {
        setState((prevState) => ({
            ...prevState,
            [newTask.id]: newTask,
        }));
    }

    function removeTaskFromState(newTask) {
        setState((prevState) => {
            if (prevState[newTask.id]) return _.omit(prevState, newTask.id);
            else return prevState;
        });
    }

    function doSearch() {
        const searchResult = filterTasks(state, dashboardFilter);
        setFilteredTasksIds(searchResult);
    }
    useEffect(doSearch, [dashboardFilter, state]);

    async function filterTasksByRole() {
        return;
        if (roleView === "all" && !!!dashboardFilter) {
            setFilteredTasksIds(null);
            return;
        }
        const allIds = Object.values(state).map((t) => t.id);
        if (previousRoleView.current !== roleView) {
            const assignments = (
                await DataStore.query(models.TaskAssignee, (a) =>
                    a.role("eq", roleView.toUpperCase())
                )
            ).filter((a) => a.assignee.id === whoami.id);
            const myTasks = assignments.map((a) => a.task);
            const roleTasks = myTasks.filter((t) => allIds.includes(t.id));
            const roleTasksIds = roleTasks.map((t) => t.id);
            setFilteredTasksIds((prevState) => {
                if (prevState) return [...prevState, ...roleTasksIds];
                else return roleTasksIds;
            });
            previousRoleView.current = roleView;
        }
        const searchResult = filterTasks(state, dashboardFilter);
        setFilteredTasksIds((prevState) => {
            if (prevState) return _.intersection(prevState, searchResult);
            else return searchResult;
        });
    }
    useEffect(() => filterTasksByRole(), [roleView, dashboardFilter, state]);

    async function getTasks() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
            return;
        } else {
            const allAssignments = await DataStore.query(models.TaskAssignee);
            let tasksResult = [];
            if (roleView === "all") {
                tasksResult = await DataStore.query(models.Task, (task) =>
                    task.status("eq", props.taskKey)
                );
            } else {
                const assignments = (
                    await DataStore.query(models.TaskAssignee, (a) =>
                        a.role("eq", roleView.toUpperCase())
                    )
                ).filter((a) => a.assignee.id === whoami.id);
                // once DataStore implements lazy loading, get the tasks for assignments instead
                const taskIds = assignments.map((a) => a.task.id);
                const tasks = await DataStore.query(models.Task, (t) =>
                    t.status("eq", props.taskKey)
                );
                tasksResult = tasks.filter((t) => taskIds.includes(t.id));
            }
            setState(
                addAssigneesAndConvertToObject(tasksResult, allAssignments)
            );
            tasksSubscription.current.unsubscribe();
            tasksSubscription.current = DataStore.observe(
                models.Task
            ).subscribe(async (newTask) => {
                if (newTask.opType === "UPDATE") {
                    const replaceTask = await DataStore.query(
                        models.Task,
                        newTask.element.id
                    );
                    if (replaceTask.status === props.taskKey) {
                        const assignees = (
                            await DataStore.query(models.TaskAssignee)
                        ).filter((a) => a.task.id === replaceTask.id);
                        addTaskToState({ ...replaceTask, assignees });
                    } else {
                        removeTaskFromState(replaceTask);
                    }
                } else {
                    const task = newTask.element;
                    if (task.status === props.taskKey) addTaskToState(task);
                }
            });
            setIsFetching(false);
        }
    }

    useEffect(
        () => getTasks(),
        [dataStoreReadyStatus, roleView, props.taskKey]
    );

    const dispatchAppendFunctions = {
        tasksCancelled:
            endlessLoadEnd || endlessLoadIsFetching
                ? () => ({ type: "IGNORE" })
                : appendTasksCancelledRequest,
        tasksDroppedOff:
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

    const header = (
        <Typography className={classes.header}>{props.title}</Typography>
    );

    const animate = useRef(false);
    useEffect(() => {
        if (state.length === 0) {
            setTimeout(() => (animate.current = true), 1000);
            return;
        }
        animate.current = true;
    }, [state]);

    return (
        <TasksKanbanColumn>
            {header}
            <Stack
                direction={"column"}
                spacing={4}
                alignItems={"center"}
                justifyContent={"flex-start"}
            >
                {sortByCreatedTime(
                    Object.values(state).reverse(),
                    "newest"
                ).map((task) => {
                    return (
                        <div
                            className={clsx(
                                classes.taskItem,
                                filteredTasksIds === null ||
                                    filteredTasksIds.includes(task.id)
                                    ? show
                                    : hide
                            )}
                            key={task.id}
                        >
                            <TaskItem
                                animate={animate.current}
                                task={task}
                                taskUUID={task.id}
                                view={props.modalView}
                                deleteDisabled={props.deleteDisabled}
                            />
                            <div
                                className={
                                    !!task.relayNext &&
                                    props.showTasks === null &&
                                    !props.hideRelayIcons &&
                                    roleView !== "rider"
                                        ? show
                                        : hide
                                }
                            >
                                <Tooltip title="Relay">
                                    <ArrowDownwardIcon
                                        style={{
                                            height: "35px",
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    );
                })}
            </Stack>
            {["tasksDroppedOff", "tasksRejected", "tasksCancelled"].includes(
                props.taskKey
            ) ? (
                <React.Fragment>
                    <Waypoint
                        onEnter={() => {
                            if (props.showTasks) return;
                            if (false) {
                                dispatch(
                                    appendFunction(
                                        whoami.id,
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
        </TasksKanbanColumn>
    );
}

TasksGridColumn.propTypes = {
    title: PropTypes.string,
    classes: PropTypes.object,
    onAddTaskClick: PropTypes.func,
    onAddRelayClick: PropTypes.bool,
    disableAddButton: PropTypes.bool,
    taskKey: PropTypes.string,
    showTasks: PropTypes.arrayOf(PropTypes.string),
    tasks: PropTypes.array,
};

TasksGridColumn.defaultProps = {
    tasks: [],
};

export default TasksGridColumn;
