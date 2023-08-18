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
    ).Task;
    const selectionActionsPending = useSelector(
        selectionActionsPendingSelector
    );
    const tasksSubscription = React.useRef({
        unsubscribe: () => {},
    });
    const stateRef = React.useRef<TaskStateType>({});
    const taskAssigneeItemsRef = React.useRef<models.TaskAssignee[]>([]);
    const locationsSubscription = React.useRef({
        unsubscribe: () => {},
    });
    const whoami = useSelector(getWhoami);
    const taskAssignees = useSelector(taskAssigneesSelector);
    const taskAssigneesReady = useSelector(taskAssigneesReadyStatusSelector);
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState(false);
    stateRef.current = state;
    taskAssigneeItemsRef.current = taskAssignees.items;

    const myTaskAssigneeIds = React.useMemo(() => {
        const result = taskAssignees.items
            .filter(
                (a: models.TaskAssignee) =>
                    a?.assignee?.id === whoami?.id && a?.role === roleView
            )
            .map((a2: models.TaskAssignee) => a2?.task?.id)
            .sort((a: string, b: string) => {
                return a.localeCompare(b);
            });

        if (dashboardFilteredUser && roleView === models.Role.COORDINATOR) {
            const theirAssignments = taskAssignees.items.filter(
                (a: models.TaskAssignee) =>
                    a.role === models.Role.RIDER &&
                    a.task &&
                    a.assignee?.id === dashboardFilteredUser
            );
            const theirTaskIds = theirAssignments.map(
                (a: models.TaskAssignee) => a.task?.id
            );
            const intersectingTasksIds = _.intersection(result, theirTaskIds);
            return intersectingTasksIds;
        }
        return result;
    }, [taskAssignees.items, roleView, whoami, dashboardFilteredUser]);

    function addTaskToState(newTask: models.Task) {
        setState((prevState) => {
            return { ...prevState, [newTask.id]: newTask };
        });
    }

    function removeTaskFromState(newTask: models.Task) {
        setState((prevState) => {
            if (prevState[newTask.id]) return _.omit(prevState, newTask.id);
            else return prevState;
        });
    }

    const getTasks = React.useCallback(async () => {
        if (
            !roleView ||
            !taskAssigneesReady ||
            selectionActionsPending ||
            !taskStatusKey
        ) {
            return;
        } else {
            try {
                if (
                    taskStatusKey.includes(models.TaskStatus.PENDING) ||
                    (roleView === "ALL" && !dashboardFilteredUser)
                ) {
                    setState(await getTasksAll(taskStatusKey));
                } else if (roleView === "ALL" && dashboardFilteredUser) {
                    setState(
                        await getAllTasksByUser(
                            taskStatusKey,
                            dashboardFilteredUser,
                            models.Role.RIDER,
                            // can get away with a ref here
                            // since myTaskAssigneeIds is a memoized value linked to taskAssignees.items
                            taskAssigneeItemsRef.current
                        )
                    );
                } else if (roleView !== "ALL") {
                    setState(
                        await getAllMyTasks(taskStatusKey, myTaskAssigneeIds)
                    );
                }

                setIsFetching(false);
            } catch (error) {
                setError(true);
                setIsFetching(false);
                console.log(error);
            }
        }
    }, [
        dashboardFilteredUser,
        taskStatusKey,
        roleView,
        selectionActionsPending,
        myTaskAssigneeIds,
        taskAssigneesReady,
    ]);

    React.useEffect(() => {
        getTasks();
    }, [getTasks, dataStoreModelSynced]);

    const selectionActionsPendingRef = React.useRef(false);
    selectionActionsPendingRef.current = selectionActionsPending;

    const setUpObservers = React.useCallback(
        (roleView, taskKey) => {
            tasksSubscription.current.unsubscribe();
            tasksSubscription.current = DataStore.observe(
                models.Task
            ).subscribe((newTask) => {
                if (selectionActionsPendingRef.current) return;
                try {
                    if (newTask.opType === "UPDATE") {
                        if (
                            newTask.element.status &&
                            taskKey.includes(newTask.element.status) &&
                            !(newTask.element.id in stateRef.current)
                        ) {
                            getTasks();
                            return;
                        } else if (
                            newTask.element.status &&
                            !taskKey.includes(newTask.element.status)
                        ) {
                            removeTaskFromState(newTask.element);
                            return;
                        } else if (newTask.element.id in stateRef.current) {
                            addTaskToState(newTask.element);
                        }
                    } else {
                        // if roleView is rider or coordinator, let the assignments observer deal with it
                        if (
                            roleView !== "ALL" &&
                            !taskKey.includes(models.TaskStatus.PENDING)
                        )
                            return;
                        if (taskKey.includes(newTask.element.status)) {
                            getTasks();
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            });
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
        },
        [getTasks]
    );

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
