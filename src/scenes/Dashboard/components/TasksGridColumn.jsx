import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import TaskItem from "./TaskItem";
import * as models from "../../../models/index";
import { useSelector } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Skeleton, Stack, Typography, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import { showHide } from "../../../styles/common";
import clsx from "clsx";
import makeStyles from "@mui/styles/makeStyles";
import {
    dashboardFilteredUserSelector,
    getRoleView,
    getWhoami,
    taskAssigneesReadyStatusSelector,
    taskAssigneesSelector,
    dataStoreModelSyncedStatusSelector,
} from "../../../redux/Selectors";
import { sortByCreatedTime } from "../../../utilities";
import { DataStore } from "aws-amplify";
import { filterTasks } from "../utilities/functions";
import GetError from "../../../ErrorComponents/GetError";
import { userRoles } from "../../../apiConsts";
import Box from "@mui/material/Box";
import DateStampDivider from "./TimeStampDivider";
import getTasksAll from "../utilities/getTasksAll";
import getAllTasksByUser from "../utilities/getAllTasksByUser";
import getAllMyTasks from "../utilities/getAllMyTasks";
import getAllMyTasksWithUser from "../utilities/getAllMyTasksWithUser";
import useWindowSize from "../../../hooks/useWindowSize";
import { useTheme } from "@mui/styles";
import { useInView } from "react-intersection-observer";

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
    column: {
        padding: 5,
        backgroundColor: "rgba(180, 180, 180, 0.1)",
        borderRadius: 5,
        border: 0,
        boxShadow: "0 2px 3px 1px rgba(100, 100, 100, .3)",
        height: "100%",
        maxWidth: 360,
        minWidth: 285,
        [theme.breakpoints.down("lg")]: {
            padding: 0,
        },
        [theme.breakpoints.down("sm")]: {
            maxWidth: "100%",
            width: "100%",
        },
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
    const [state, setState] = useState([]);
    const stateRef = useRef({});
    const { show, hide } = showHide();
    const taskAssignees = useSelector(taskAssigneesSelector);
    const prevTaskAssigneesRef = useRef(null);
    const taskAssigneesReady = useSelector(taskAssigneesReadyStatusSelector);
    const [isFetching, setIsFetching] = useState(true);
    const [errorState, setErrorState] = useState(false);
    const [filteredTasksIds, setFilteredTasksIds] = useState(null);
    const [visibility, setVisibility] = useState(false);
    const [width, height] = useWindowSize();
    const whoami = useSelector(getWhoami);
    const dashboardFilter = useSelector((state) => state.dashboardFilter);
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);
    const roleView = useSelector(getRoleView);
    const dataStoreModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    );
    const getTasksRef = useRef(null);
    const tasksSubscription = useRef({
        unsubscribe: () => {},
    });
    const locationsSubscription = useRef({
        unsubscribe: () => {},
    });
    const theme = useTheme();
    const { ref, inView, entry } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        if (inView && !visibility) {
            setVisibility(true);
        }
    }, [inView]);

    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

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
        if (!roleView || !visibility || !taskAssigneesReady) {
            return;
        } else {
            try {
                if (roleView === "ALL" && !dashboardFilteredUser) {
                    setState(await getTasksAll(props.taskKey));
                } else if (roleView === "ALL" && dashboardFilteredUser) {
                    setState(
                        await getAllTasksByUser(
                            props.taskKey,
                            dashboardFilteredUser,
                            userRoles.rider,
                            taskAssignees.items
                        )
                    );
                } else if (roleView !== "ALL" && !dashboardFilteredUser) {
                    setState(
                        await getAllMyTasks(
                            props.taskKey,
                            whoami.id,
                            roleView,
                            taskAssignees.items
                        )
                    );
                } else if (roleView !== "ALL" && dashboardFilteredUser) {
                    setState(
                        await getAllMyTasksWithUser(
                            props.taskKey,
                            whoami.id,
                            roleView,
                            dashboardFilteredUser,
                            taskAssignees.items
                        )
                    );
                }

                animate.current = false;
                prevTaskAssigneesRef.current = taskAssignees.items;
                setIsFetching(false);
            } catch (error) {
                setErrorState(true);
                setIsFetching(false);
                console.log(error);
            }
        }
    }

    getTasksRef.current = getTasks;

    useEffect(
        () => {
            getTasks();
        },
        // JSON.stringify prevents component remount from an array prop
        [
            dataStoreModelSynced.Task,
            dataStoreModelSynced.Location,
            dashboardFilteredUser,
            taskAssigneesReady,
            visibility,
            roleView,
            JSON.stringify(props.taskKey),
        ]
    );

    useEffect(() => {
        try {
            if (roleView === "ALL" || !prevTaskAssigneesRef.current) return;
            const newItems = taskAssignees.items;
            // get any items that are not in the previous list
            const newItemsIds = newItems.map((item) => item.id);
            const newItemsIdsSet = new Set(newItemsIds);
            const prevItemsIds = prevTaskAssigneesRef.current.map(
                (item) => item.id
            );
            const prevItemsIdsSet = new Set(prevItemsIds);
            const addedItems = newItems.filter(
                (item) => !prevItemsIdsSet.has(item.id)
            );
            const removedItems = prevTaskAssigneesRef.current.filter(
                (item) => !newItemsIdsSet.has(item.id)
            );
            if (
                [...addedItems, ...removedItems].map(
                    (item) => item.assignee && item.assignee.id === whoami.id
                ).length > 0
            ) {
                getTasksRef.current();
            }
        } catch (error) {
            console.log(error);
        }
    }, [taskAssignees, roleView, whoami]);

    function setUpObservers() {
        tasksSubscription.current.unsubscribe();
        tasksSubscription.current = DataStore.observe(models.Task).subscribe(
            (newTask) => {
                try {
                    if (newTask.opType === "UPDATE") {
                        if (
                            newTask.element.status &&
                            props.taskKey.includes(newTask.element.status) &&
                            !(newTask.element.id in stateRef.current)
                        ) {
                            animate.current = true;
                            getTasksRef
                                .current()
                                .then(() => (animate.current = false));
                            return;
                        } else if (
                            newTask.element.status &&
                            !props.taskKey.includes(newTask.element.status)
                        ) {
                            removeTaskFromState(newTask.element);
                            return;
                        } else if (newTask.element.id in stateRef.current) {
                            if (
                                newTask.element.pickUpLocationId !==
                                    stateRef.current[newTask.element.id]
                                        .pickUpLocationId ||
                                newTask.element.dropOffLocationId !==
                                    stateRef.current[newTask.element.id]
                                        .dropOffLocationId
                            ) {
                                getTasksRef.current();
                            } else {
                                addTaskToState(newTask.element);
                            }
                        }
                    } else {
                        // if roleView is rider or coordinator, let the assignments observer deal with it
                        if (roleView !== "ALL") return;
                        if (props.taskKey.includes(newTask.element.status)) {
                            getTasksRef.current();
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        );
        locationsSubscription.current.unsubscribe();
        locationsSubscription.current = DataStore.observe(
            models.Location
        ).subscribe(async (location) => {
            try {
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
                                    pickUpLocation: location.element,
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
                                    dropOffLocation: location.element,
                                },
                            }));
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        });
        // big block of commented code for old way of getting assignments
        /* taskAssigneesObserver.current.unsubscribe();
        taskAssigneesObserver.current = DataStore.observe(
            models.TaskAssignee
        ).subscribe((taskAssignee) => {
            try {
                if (taskAssignee.opType === "INSERT") {
                    const element = taskAssignee.element;
                    // if roleView is ALL let the task observer deal with it
                    if (roleView === "ALL") return;
                    if (
                        element.assigneeId === whoami.id &&
                        element.role === roleView
                    ) {
                        if (!element.taskId) return;
                        DataStore.query(models.Task, element.taskId).then(
                            (result) => {
                                if (props.taskKey.includes(result.status)) {
                                    animate.current = true;
                                    getTasksRef.current();
                                }
                            }
                        );
                    }
                } else if (taskAssignee.opType === "DELETE") {
                    const element = taskAssignee.element;
                    // if roleView is ALL do nothing
                    if (roleView === "ALL") return;
                    if (
                        element.assignee &&
                        element.assignee.id === whoami.id &&
                        element.role === roleView
                    ) {
                        removeTaskFromState(element.task);
                    }
                }
            } catch (e) {
                console.log(e);
            }
        });
        */
    }

    useEffect(() => {
        setUpObservers();
    }, [roleView]);

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
            <Box
                className={classes.column}
                ref={ref}
                sx={{
                    width: isSm ? "100%" : width / 4.2,
                }}
            >
                <Stack direction="column" spacing={4}>
                    <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        data-cy={`${props.title}-title-skeleton`}
                        height={50}
                    />
                    {_.range(4).map((i) => (
                        <Box key={i} className={classes.taskItem}>
                            <Skeleton
                                variant="rectangular"
                                width={"100%"}
                                height={200}
                            />
                        </Box>
                    ))}
                </Stack>
            </Box>
        );
    } else {
        let displayDate = false;
        let lastTime = new Date();
        const filteredTasksIdsList = filteredTasksIds || [];
        return (
            <Box
                className={classes.column}
                ref={ref}
                sx={{
                    width: isSm ? "100%" : width / 4.2,
                }}
            >
                {header}
                <Stack
                    direction={"column"}
                    data-cy={`tasks-kanban-column-${props.taskKey}`}
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
                            <Box
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
                                <Box
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
                                </Box>
                            </Box>
                        );
                    })}
                </Stack>
            </Box>
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
