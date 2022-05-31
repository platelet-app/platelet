import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import * as models from "../../../models/index";
import { useSelector } from "react-redux";
import { Skeleton, Stack, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";
import {
    dashboardFilteredUserSelector,
    getRoleView,
    getWhoami,
    taskAssigneesReadyStatusSelector,
    taskAssigneesSelector,
    dataStoreModelSyncedStatusSelector,
    dashboardFilterTermSelector,
    selectedItemsSelector,
    dashboardTabIndexSelector,
    selectionActionsPendingSelector,
} from "../../../redux/Selectors";
import { DataStore } from "aws-amplify";
import { filterTasks } from "../utilities/functions";
import GetError from "../../../ErrorComponents/GetError";
import { userRoles } from "../../../apiConsts";
import Box from "@mui/material/Box";
import getTasksAll from "../utilities/getTasksAll";
import getAllTasksByUser from "../utilities/getAllTasksByUser";
import getAllMyTasks from "../utilities/getAllMyTasks";
import getAllMyTasksWithUser from "../utilities/getAllMyTasksWithUser";
import useWindowSize from "../../../hooks/useWindowSize";
import { useTheme } from "@mui/styles";
import TaskGridColumnHeader from "./TaskGridColumnHeader";
import TaskGridTasksList from "./TaskGridTasksList";

const useStyles = () =>
    makeStyles((theme) => ({
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
        gridItem: {
            width: "100%",
        },
    }));

function TasksGridColumn(props) {
    const [state, setState] = useState([]);
    const stateRef = useRef({});
    const taskAssignees = useSelector(taskAssigneesSelector);
    const prevTaskAssigneesRef = useRef(null);
    const taskAssigneesReady = useSelector(taskAssigneesReadyStatusSelector);
    const [isFetching, setIsFetching] = useState(true);
    const [errorState, setErrorState] = useState(false);
    const [filteredTasksIds, setFilteredTasksIds] = useState(null);
    const [width, height] = useWindowSize();
    const whoami = useSelector(getWhoami);
    const dashboardFilter = useSelector(dashboardFilterTermSelector);
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);
    const roleView = useSelector(getRoleView);
    const selectedItemsAll = useSelector(selectedItemsSelector);
    const tabIndex = useSelector(dashboardTabIndexSelector);
    const isSomeSelected = useRef(false);
    const dataStoreModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    );
    const selectionActionsPending = useSelector(
        selectionActionsPendingSelector
    );
    const getTasksRef = useRef(null);
    const tasksSubscription = useRef({
        unsubscribe: () => {},
    });
    const locationsSubscription = useRef({
        unsubscribe: () => {},
    });
    const theme = useTheme();
    useEffect(() => {
        const selectedItems = selectedItemsAll[tabIndex];
        if (!selectedItems) return;
        const values = Object.values(selectedItems);
        isSomeSelected.current = Object.values(state).some((t) =>
            values.map((a) => a.id).includes(t.id)
        );
    });

    const classes = useStyles(isSomeSelected.current)();

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
        if (!roleView || !taskAssigneesReady || selectionActionsPending) {
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
            selectionActionsPending,
            dashboardFilteredUser,
            taskAssigneesReady,
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

    const selectionActionsPendingRef = useRef(false);
    selectionActionsPendingRef.current = selectionActionsPending;

    function setUpObservers() {
        tasksSubscription.current.unsubscribe();
        tasksSubscription.current = DataStore.observe(models.Task).subscribe(
            (newTask) => {
                if (selectionActionsPendingRef.current) return;
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

    const animate = useRef(false);

    if (errorState) {
        return <GetError />;
    } else if (isFetching) {
        return (
            <Box
                className={classes.column}
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
        return (
            <Box
                className={classes.column}
                sx={{
                    width: isSm ? "100%" : width / 4.2,
                }}
            >
                <TaskGridColumnHeader tasks={state} title={props.title} />
                <TaskGridTasksList
                    tasks={state}
                    includeList={filteredTasksIds}
                />
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
