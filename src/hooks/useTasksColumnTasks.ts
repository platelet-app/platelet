import React from "react";
import * as models from "../models";
import { useSelector } from "react-redux";
import {
    getRoleView,
    getWhoami,
    taskAssigneesSelector,
    dashboardFilteredUserSelector,
    taskAssigneesReadyStatusSelector,
    dataStoreModelSyncedStatusSelector,
    selectionActionsPendingSelector,
} from "../redux/Selectors";
import getAllMyTasks from "./utilities/getAllMyTasks";
import getAllMyTasksWithUser from "./utilities/getAllMyTasksWithUser";
import getAllTasksByUser from "./utilities/getAllTasksByUser";
import getTasksAll from "./utilities/getTasksAll";
import { DataStore } from "aws-amplify";
import _ from "lodash";

export type TaskStateType = {
    [key: string]: models.Task;
};

export function convertTasksToStateType(tasks: models.Task[]): TaskStateType {
    const state: TaskStateType = {};
    tasks.forEach((task) => {
        state[task.id] = task;
    });
    return state;
}

const useTasksColumnTasks = (taskStatusKey: models.TaskStatus[]) => {
    const [state, setState] = React.useState<TaskStateType>({});
    const dashboardFilteredUser = useSelector(dashboardFilteredUserSelector);
    const roleView = useSelector(getRoleView);
    const dataStoreModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    );
    const selectionActionsPending = useSelector(
        selectionActionsPendingSelector
    );
    const getTasksRef = React.useRef<Function>(
        async (): Promise<TaskStateType> => {
            return {};
        }
    );
    const tasksSubscription = React.useRef({
        unsubscribe: () => {},
    });
    const stateRef = React.useRef<TaskStateType>({});
    const locationsSubscription = React.useRef({
        unsubscribe: () => {},
    });
    const animate = React.useRef(true);
    const whoami = useSelector(getWhoami);
    const taskAssignees = useSelector(taskAssigneesSelector);
    const prevTaskAssigneesRef = React.useRef<models.TaskAssignee[] | null>(
        null
    );
    const taskAssigneesReady = useSelector(taskAssigneesReadyStatusSelector);
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState(false);
    stateRef.current = state;

    function addTaskToState(newTask: models.Task) {
        animate.current = true;
        setState((prevState) => {
            return { ...prevState, [newTask.id]: newTask };
        });
        animate.current = false;
    }

    function removeTaskFromState(newTask: models.Task) {
        setState((prevState) => {
            if (prevState[newTask.id]) return _.omit(prevState, newTask.id);
            else return prevState;
        });
    }

    const getTasks = React.useCallback(
        async (
            dashboardFilteredUser,
            taskKey,
            roleView,
            selectionActionsPending,
            taskAssigneesItems,
            taskAssigneesReady,
            whoamiId
        ) => {
            if (
                !roleView ||
                !taskAssigneesReady ||
                selectionActionsPending ||
                !taskKey
            ) {
                return;
            } else {
                try {
                    if (roleView === "ALL" && !dashboardFilteredUser) {
                        setState(await getTasksAll(taskKey));
                    } else if (roleView === "ALL" && dashboardFilteredUser) {
                        setState(
                            await getAllTasksByUser(
                                taskKey,
                                dashboardFilteredUser,
                                models.Role.RIDER,
                                taskAssigneesItems
                            )
                        );
                    } else if (roleView !== "ALL" && !dashboardFilteredUser) {
                        setState(
                            await getAllMyTasks(
                                taskKey,
                                whoamiId,
                                roleView,
                                taskAssigneesItems
                            )
                        );
                    } else if (roleView !== "ALL" && dashboardFilteredUser) {
                        setState(
                            await getAllMyTasksWithUser(
                                taskKey,
                                whoamiId,
                                roleView,
                                dashboardFilteredUser,
                                taskAssigneesItems
                            )
                        );
                    }

                    animate.current = false;
                    prevTaskAssigneesRef.current = taskAssigneesItems;
                    setIsFetching(false);
                } catch (error) {
                    setError(true);
                    setIsFetching(false);
                    console.log(error);
                }
            }
        },
        []
    );

    const getTasksNoParams = React.useCallback(() => {
        return getTasks(
            dashboardFilteredUser,
            taskStatusKey,
            roleView,
            selectionActionsPending,
            taskAssignees.items,
            taskAssigneesReady,
            whoami.id
        );
    }, [
        dashboardFilteredUser,
        taskStatusKey,
        roleView,
        selectionActionsPending,
        taskAssignees.items,
        taskAssigneesReady,
        whoami.id,
        getTasks,
    ]);

    getTasksRef.current = getTasksNoParams;

    const tasksKeyJSON = JSON.stringify(taskStatusKey);
    React.useEffect(() => {
        getTasks(
            dashboardFilteredUser,
            taskStatusKey,
            roleView,
            selectionActionsPending,
            taskAssignees.items,
            taskAssigneesReady,
            whoami.id
        );
    }, [
        dataStoreModelSynced.Task,
        dataStoreModelSynced.Location,
        selectionActionsPending,
        dashboardFilteredUser,
        taskAssigneesReady,
        roleView,
        // JSON.stringify prevents component remount from an array prop
        tasksKeyJSON,
        getTasks,
        whoami.id,
        taskAssignees.items,
    ]);

    React.useEffect(() => {
        try {
            if (roleView === "ALL" || !prevTaskAssigneesRef.current) return;
            const newItems = taskAssignees.items;
            // get any items that are not in the previous list
            const newItemsIds = newItems.map(
                (item: models.TaskAssignee) => item.id
            );
            const newItemsIdsSet = new Set(newItemsIds);
            const prevItemsIds = prevTaskAssigneesRef.current.map(
                (item: models.TaskAssignee) => item.id
            );
            const prevItemsIdsSet = new Set(prevItemsIds);
            const addedItems = newItems.filter(
                (item: models.TaskAssignee) => !prevItemsIdsSet.has(item.id)
            );
            const removedItems = prevTaskAssigneesRef.current.filter(
                (item: models.TaskAssignee) => !newItemsIdsSet.has(item.id)
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

    const selectionActionsPendingRef = React.useRef(false);
    selectionActionsPendingRef.current = selectionActionsPending;

    const setUpObservers = React.useCallback((roleView, taskKey) => {
        tasksSubscription.current.unsubscribe();
        tasksSubscription.current = DataStore.observe(models.Task).subscribe(
            (newTask) => {
                if (selectionActionsPendingRef.current) return;
                try {
                    if (newTask.opType === "UPDATE") {
                        if (
                            newTask.element.status &&
                            taskKey.includes(newTask.element.status) &&
                            !(newTask.element.id in stateRef.current)
                        ) {
                            animate.current = true;
                            getTasksRef
                                .current()
                                .then(() => (animate.current = false));
                            return;
                        } else if (
                            newTask.element.status &&
                            !taskKey.includes(newTask.element.status)
                        ) {
                            removeTaskFromState(newTask.element);
                            return;
                        } else if (newTask.element.id in stateRef.current) {
                            if (
                                // DataStore observer quirk
                                // @ts-ignore
                                newTask.element.pickUpLocationId !==
                                    stateRef.current[newTask.element.id]
                                        // prettier-ignore
                                        // @ts-ignore
                                        .pickUpLocationId ||
                                // @ts-ignore
                                newTask.element.dropOffLocationId !==
                                    stateRef.current[newTask.element.id]
                                        // prettier-ignore
                                        // @ts-ignore
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
                        if (taskKey.includes(newTask.element.status)) {
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
    }, []);

    React.useEffect(() => {
        setUpObservers(roleView, taskStatusKey);
    }, [roleView, setUpObservers, taskStatusKey]);

    React.useEffect(() => {
        return () => {
            tasksSubscription.current.unsubscribe();
            locationsSubscription.current.unsubscribe();
        };
    }, []);
    return { state, isFetching, error };
};

export default useTasksColumnTasks;
