import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import TaskItem from "./TaskItem";
import * as models from "../../../models/index";
import { useSelector } from "react-redux";
import { TasksKanbanColumn } from "../styles/TaskColumns";
import Tooltip from "@mui/material/Tooltip";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Skeleton, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { showHide } from "../../../styles/common";
import clsx from "clsx";
import makeStyles from "@mui/styles/makeStyles";
import {
    dashboardFilteredUserSelector,
    dataStoreReadyStatusSelector,
    getRoleView,
    getWhoami,
} from "../../../redux/Selectors";
import { convertListDataToObject, sortByCreatedTime } from "../../../utilities";
import { DataStore } from "aws-amplify";
import { filterTasks } from "../utilities/functions";
import GetError from "../../../ErrorComponents/GetError";
import { tasksStatus, userRoles } from "../../../apiConsts";
import moment from "moment";
import Box from "@mui/material/Box";
import DateStampDivider from "./TimeStampDivider";

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
    const { show, hide } = showHide();
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [isFetching, setIsFetching] = useState(false);
    const [errorState, setErrorState] = useState(false);
    const [filteredTasksIds, setFilteredTasksIds] = useState(null);
    const whoami = useSelector(getWhoami);
    const dashboardFilter = useSelector((state) => state.dashboardFilter);
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);
    const roleView = useSelector(getRoleView);
    const tasksSubscription = useRef({
        unsubscribe: () => {},
    });
    const locationsSubscription = useRef({
        unsubscribe: () => {},
    });

    stateRef.current = state;

    function addTaskToState(newTask) {
        animate.current = true;
        setState((prevState) => ({
            ...prevState,
            [newTask.id]: newTask,
        }));
        animate.current = false;
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
            const isCompletedTab =
                _.intersection(
                    [
                        tasksStatus.droppedOff,
                        tasksStatus.cancelled,
                        tasksStatus.rejected,
                    ],
                    props.taskKey
                ).length > 0;
            try {
                const allAssignments = await DataStore.query(
                    models.TaskAssignee
                );
                let tasksResult = [];
                let taskIds = null;
                if (
                    [userRoles.coordinator, userRoles.rider].includes(roleView)
                ) {
                    const assignments = (
                        await DataStore.query(models.TaskAssignee, (a) =>
                            a.role("eq", roleView)
                        )
                    ).filter((a) => a.assignee.id === whoami.id);

                    // once DataStore implements lazy loading, get the tasks from assignments instead
                    taskIds = assignments.map((a) => a.task.id);
                }
                if (dashboardFilteredUser) {
                    const usersTaskIds = (
                        await DataStore.query(models.TaskAssignee, (a) =>
                            a.role("eq", userRoles.rider)
                        )
                    )
                        .filter(
                            (a) =>
                                a.task &&
                                props.taskKey.includes(a.task.status) &&
                                a.assignee &&
                                dashboardFilteredUser === a.assignee.id
                        )
                        .map((a) => a.task && a.task.id);
                    if (taskIds !== null) {
                        taskIds = _.intersection(taskIds, usersTaskIds);
                    } else {
                        taskIds = usersTaskIds;
                    }
                }
                tasksResult = await DataStore.query(
                    models.Task,
                    (task) =>
                        task.or((task) =>
                            task
                                // TODO: not ideal since it sometimes is one index but works for now
                                .status("eq", props.taskKey[0])
                                .status("eq", props.taskKey[1])
                        ),

                    {
                        sort: (s) => s.createdAt("desc"),
                        limit: isCompletedTab ? 200 : 0,
                    }
                );
                if (taskIds !== null) {
                    tasksResult = tasksResult.filter((t) =>
                        taskIds.includes(t.id)
                    );
                }
                if (isCompletedTab) {
                    // filter tasksResult to only return tasks that were created in the last week
                    tasksResult = tasksResult.filter((task) =>
                        moment(task.createdAt).isAfter(
                            moment().subtract(1, "week")
                        )
                    );
                }
                setState(
                    addAssigneesAndConvertToObject(tasksResult, allAssignments)
                );
                //TODO this needs an observer for assignees
                tasksSubscription.current.unsubscribe();
                tasksSubscription.current = DataStore.observe(
                    models.Task
                ).subscribe(async (newTask) => {
                    if (newTask.opType === "UPDATE") {
                        const replaceTask = await DataStore.query(
                            models.Task,
                            newTask.element.id
                        );
                        if (
                            replaceTask.status === tasksStatus.new &&
                            props.taskKey.includes(tasksStatus.new) &&
                            dashboardFilteredUser
                        ) {
                            return;
                        }
                        if (props.taskKey.includes(replaceTask.status)) {
                            const assignees = (
                                await DataStore.query(models.TaskAssignee)
                            ).filter(
                                (a) => a.task && a.task.id === replaceTask.id
                            );
                            addTaskToState({ ...replaceTask, assignees });
                        } else {
                            removeTaskFromState(replaceTask);
                        }
                    } else {
                        const task = newTask.element;
                        const assignees = (
                            await DataStore.query(models.TaskAssignee)
                        ).filter((a) => a.task && a.task.id === task.id);
                        let pickUpLocation = null;
                        let dropOffLocation = null;
                        if (task.pickUpLocationId) {
                            pickUpLocation = await DataStore.query(
                                models.Location,
                                task.pickUpLocationId
                            );
                        }
                        if (task.dropOffLocationId) {
                            dropOffLocation = await DataStore.query(
                                models.Location,
                                task.dropOffLocationId
                            );
                        }
                        if (props.taskKey.includes(task.status))
                            addTaskToState({
                                ...task,
                                pickUpLocation,
                                dropOffLocation,
                                assignees,
                            });
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
                console.log(error);
            }
        }
    }

    useEffect(
        () => getTasks(),
        // JSON.stringify prevents component remount from an array prop
        [
            dataStoreReadyStatus,
            dashboardFilteredUser,
            roleView,
            JSON.stringify(props.taskKey),
        ]
    );
    useEffect(() => {
        return () => {
            tasksSubscription.current.unsubscribe();
            locationsSubscription.current.unsubscribe();
        };
    }, []);

    const header = (
        <Typography className={classes.header}>{props.title}</Typography>
    );

    const animate = useRef(false);

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
                            key={i}
                            variant="rectangular"
                            width={"100%"}
                            height={200}
                        />
                    ))}
                </Stack>
            </TasksKanbanColumn>
        );
    } else {
        let displayDate = false;
        let lastTime = new Date();
        const filteredTasksIdsList = filteredTasksIds || [];
        return (
            <TasksKanbanColumn>
                {header}
                <Stack
                    direction={"column"}
                    id={`tasks-kanban-column-${props.taskKey}`}
                    spacing={0}
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    {sortByCreatedTime(
                        Object.values(state).reverse(),
                        "newest"
                    ).map((task) => {
                        displayDate = false;
                        const timeComparison = new Date(
                            task.createdAt || task.timeOfCall || null
                        );
                        if (
                            timeComparison &&
                            (filteredTasksIdsList.length === 0 ||
                                filteredTasksIdsList.includes(task.id)) &&
                            timeComparison.getDate() <= lastTime.getDate() - 1
                        ) {
                            lastTime = timeComparison;
                            displayDate = true;
                        }
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
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    height={35}
                                    sx={{ width: "100%" }}
                                >
                                    {displayDate && (
                                        <DateStampDivider date={lastTime} />
                                    )}
                                </Box>
                                <TaskItem
                                    animate={animate.current}
                                    task={task}
                                    taskUUID={task.id}
                                    deleteDisabled
                                />
                                <div
                                    className={
                                        !!task.relayNext &&
                                        props.showTasks === null &&
                                        !props.hideRelayIcons &&
                                        roleView !== userRoles.rider
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
            </TasksKanbanColumn>
        );
    }
}

TasksGridColumn.propTypes = {
    title: PropTypes.string,
    taskKey: PropTypes.array.isRequired,
    showTasks: PropTypes.arrayOf(PropTypes.string),
    hideRelayIcons: PropTypes.bool,
};

TasksGridColumn.defaultProps = {
    showTasks: [],
    title: "TASKS",
    hideRelayIcons: false,
};

export default TasksGridColumn;
