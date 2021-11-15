import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import TaskItem from "./TaskItem";
import * as models from "../../../models/index";
import { useSelector } from "react-redux";
import { TasksKanbanColumn } from "../styles/TaskColumns";
import { Waypoint } from "react-waypoint";
import Tooltip from "@mui/material/Tooltip";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { CircularProgress, Skeleton, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { showHide } from "../../../styles/common";
import clsx from "clsx";
import makeStyles from "@mui/styles/makeStyles";
import {
    dataStoreReadyStatusSelector,
    getWhoami,
} from "../../../redux/Selectors";
import { convertListDataToObject, sortByCreatedTime } from "../../../utilities";
import { DataStore } from "aws-amplify";
import { filterTasks } from "../utilities/functions";
import GetError from "../../../ErrorComponents/GetError";
import { tasksStatus } from "../../../apiConsts";

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
    const stateRef = useRef({});
    const loaderClass = loaderStyles();
    const { show, hide } = showHide();
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [isFetching, setIsFetching] = useState(false);
    const [errorState, setErrorState] = useState(false);
    const [filteredTasksIds, setFilteredTasksIds] = useState(null);
    const whoami = useSelector(getWhoami);
    const [endlessLoadEnd, setEndlessLoadEnd] = useState(false);
    const dashboardFilter = useSelector((state) => state.dashboardFilter);
    const page = useRef(1);
    const [endlessLoadIsFetching, setEndlessLoadIsFetching] = useState(false);
    const roleView = useSelector((state) => state.roleView);
    const tasksSubscription = useRef({
        unsubscribe: () => {},
    });
    const locationsSubscription = useRef({
        unsubscribe: () => {},
    });

    stateRef.current = state;

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

    async function getTasks() {
        setIsFetching(true);
        if (!dataStoreReadyStatus) {
            return;
        } else {
            try {
                const allAssignments = await DataStore.query(
                    models.TaskAssignee
                );
                let tasksResult = [];
                if (roleView === "all") {
                    if (
                        [
                            tasksStatus.droppedOff,
                            tasksStatus.cancelled,
                            tasksStatus.rejected,
                        ].includes(props.taskKey)
                    ) {
                        tasksResult = await DataStore.query(
                            models.Task,
                            (task) => task.status("eq", props.taskKey),
                            {
                                page: 0,
                                limit: 100,
                            }
                        );
                    } else {
                        tasksResult = await DataStore.query(
                            models.Task,
                            (task) => task.status("eq", props.taskKey)
                        );
                    }
                } else {
                    const assignments = (
                        await DataStore.query(models.TaskAssignee, (a) =>
                            a.role("eq", roleView.toUpperCase())
                        )
                    ).filter((a) => a.assignee.id === whoami.id);
                    // once DataStore implements lazy loading, get the tasks for assignments instead
                    const taskIds = assignments.map((a) => a.task.id);
                    let tasks;
                    if (
                        [
                            tasksStatus.droppedOff,
                            tasksStatus.cancelled,
                            tasksStatus.rejected,
                        ].includes(props.taskKey)
                    ) {
                        tasks = await DataStore.query(
                            models.Task,
                            (task) => task.status("eq", props.taskKey),
                            {
                                page: 0,
                                limit: 100,
                            }
                        );
                    } else {
                        tasks = await DataStore.query(models.Task, (t) =>
                            t.status("eq", props.taskKey)
                        );
                    }
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
                locationsSubscription.current.unsubscribe();
                locationsSubscription.current = DataStore.observe(
                    models.Location
                ).subscribe(async (location) => {
                    if (location.opType === "UPDATE") {
                        for (const task of Object.values(stateRef.current)) {
                            if (
                                task.pickUpLocation &&
                                task.pickUpLocation.id === location.element.id
                            ) {
                                setState((prevState) => ({
                                    ...prevState,
                                    [task.id]: {
                                        ...prevState[task.id],
                                        pickUpLocation: {
                                            ...task.pickUpLocation,
                                            ...location.element,
                                        },
                                    },
                                }));
                            }
                            if (
                                task.dropOffLocation &&
                                task.dropOffLocation.id === location.element.id
                            ) {
                                setState((prevState) => ({
                                    ...prevState,
                                    [task.id]: {
                                        ...prevState[task.id],
                                        dropOffLocation: {
                                            ...task.dropOffLocation,
                                            ...location.element,
                                        },
                                    },
                                }));
                            }
                        }
                    }
                });
                setIsFetching(false);
            } catch (error) {
                setErrorState(true);
                setIsFetching(false);
                console.error(error);
            }
        }
    }

    useEffect(
        () => getTasks(),
        [dataStoreReadyStatus, roleView, props.taskKey]
    );
    useEffect(() => {
        return () => {
            tasksSubscription.current.unsubscribe();
            locationsSubscription.current.unsubscribe();
        };
    }, []);

    async function appendTasks() {
        setEndlessLoadIsFetching(true);
        try {
            const tasksResult = await DataStore.query(
                models.Task,
                (task) => task.status("eq", props.taskKey),
                {
                    page: page.current,
                    limit: 10,
                }
            );
            if (tasksResult.length === 0) {
                setEndlessLoadEnd(true);
            } else {
                let assignments;
                if (roleView === "all") {
                    assignments = await DataStore.query(models.TaskAssignee);
                } else {
                    assignments = (
                        await DataStore.query(models.TaskAssignee, (a) =>
                            a.role("eq", roleView.toUpperCase())
                        )
                    ).filter((a) => a.assignee.id === whoami.id);
                }
                const finalResult = addAssigneesAndConvertToObject(
                    tasksResult,
                    assignments
                );

                setState((prevState) => ({ ...finalResult, ...prevState }));
                page.current++;
            }
        } catch (error) {
            console.error(error);
        }
        setEndlessLoadIsFetching(false);
    }

    const header = (
        <Typography className={classes.header}>{props.title}</Typography>
    );

    const animate = useRef(false);
    useEffect(() => {
        // this is a bit of a hack really
        // prevents the cards from animating on first mount
        if (isFetching) animate.current = false;
        else setTimeout(() => (animate.current = true), 3000);
    }, [isFetching]);

    useEffect(() => {
        // to prevent role view changes from animating cards
        if (isFetching) return;
        animate.current = false;
        setTimeout(() => (animate.current = true), 3000);
    }, [roleView, isFetching]);

    if (errorState) {
        return <GetError />;
    } else if (isFetching) {
        return (
            <TasksKanbanColumn>
                <Stack direction="column" spacing={4}>
                    <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        height={50}
                    />
                    {_.range(4).map((i) => (
                        <Skeleton
                            variant="rectangular"
                            width={"100%"}
                            height={200}
                        />
                    ))}
                </Stack>
            </TasksKanbanColumn>
        );
    } else {
        return (
            <TasksKanbanColumn>
                {header}
                <Stack
                    direction={"column"}
                    id={`tasks-kanban-column-${props.taskKey}`}
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
                    {endlessLoadIsFetching ? (
                        <div className={loaderClass.root}>
                            <CircularProgress color="secondary" />
                        </div>
                    ) : (
                        <></>
                    )}
                </Stack>
                {/*[
                    tasksStatus.droppedOff,
                    tasksStatus.cancelled,
                    tasksStatus.rejected,
                ].includes(props.taskKey) ? (
                    <React.Fragment>
                        <Waypoint
                            onEnter={() => {
                                return;
                                if (
                                    (filteredTasksIds &&
                                        filteredTasksIds.length > 0) ||
                                    endlessLoadIsFetching ||
                                    endlessLoadEnd
                                )
                                    return;
                                appendTasks();
                            }}
                        />
                    </React.Fragment>
                ) : (
                    <></>
                )*/}
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
    tasks: PropTypes.array,
};

TasksGridColumn.defaultProps = {
    tasks: [],
};

export default TasksGridColumn;
