import React from "react";
import * as models from "../models";
import { useSelector } from "react-redux";
import { getWhoami } from "../redux/Selectors";
import { DataStore } from "aws-amplify";
import convertModelListToTypedObject from "./utilities/convertModelListToTypedObject";

export type ResolvedTask = Omit<
    models.Task,
    "pickUpLocation" | "dropOffLocation"
> & {
    pickUpLocation: models.Location | null;
    dropOffLocation: models.Location | null;
};

type StateType = {
    [id: string]: ResolvedTask;
};

const log = (message: any) => {
    console.log(`[useMyAssignedTasks] ${message}`);
};

const useMyAssignedTasks = (
    status: models.TaskStatus[] | models.TaskStatus,
    role: models.Role.COORDINATOR | models.Role.RIDER
) => {
    const whoami = useSelector(getWhoami);
    const assigneeObserver = React.useRef({ unsubscribe: () => {} });
    const tasksObserver = React.useRef({ unsubscribe: () => {} });
    const locationObserver = React.useRef({ unsubscribe: () => {} });
    const stateRef = React.useRef<StateType>({});
    const [taskIds, setTaskIds] = React.useState<Set<string>>(new Set());
    const [state, setState] = React.useState<StateType>({});
    const [error, setError] = React.useState<Error | null>(null);
    const [isFetching, setIsFetching] = React.useState(true);

    stateRef.current = state;

    let actualStatus: models.TaskStatus[] = React.useMemo(() => {
        if (!Array.isArray(status)) {
            return [status];
        } else {
            return status;
        }
    }, [status]);

    const setUpTasksObserver = React.useCallback(() => {
        try {
            tasksObserver.current.unsubscribe();
            if (taskIds.size === 0) {
                setState({});
                return;
            }
            tasksObserver.current = DataStore.observeQuery(models.Task, (t) =>
                t.and((t) => [
                    t.or((t) => [...taskIds].map((id) => t.id.eq(id))),
                    t.or((t) => actualStatus.map((s) => t.status.eq(s))),
                ])
            ).subscribe(async ({ items }) => {
                const resolvedTasks: ResolvedTask[] = await Promise.all(
                    items.map(async (t) => {
                        const pickUpLocation = (await t.pickUpLocation) || null;
                        const dropOffLocation =
                            (await t.dropOffLocation) || null;
                        return {
                            ...t,
                            pickUpLocation,
                            dropOffLocation,
                        };
                    })
                );
                setState(
                    convertModelListToTypedObject<ResolvedTask>(resolvedTasks)
                );
                setIsFetching(false);
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error);
                log(error);
            }
            setIsFetching(false);
        }
    }, [taskIds, actualStatus]);

    React.useEffect(() => {
        setUpTasksObserver();
        return () => {
            tasksObserver.current.unsubscribe();
        };
    }, [setUpTasksObserver]);

    const setUpLocationObserver = React.useCallback(() => {
        locationObserver.current.unsubscribe();
        locationObserver.current = DataStore.observe(models.Location).subscribe(
            async (location) => {
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
                    log(error);
                }
            }
        );
    }, []);

    React.useEffect(() => {
        setUpLocationObserver();
        return () => {
            locationObserver.current.unsubscribe();
        };
    }, [setUpLocationObserver]);

    const setUpAssignedTasksObserver = React.useCallback(async () => {
        try {
            // TODO: for now use manual filtering
            // consider filtering in the query once this is fixed
            // https://github.com/aws-amplify/amplify-android/issues/2069
            assigneeObserver.current.unsubscribe();
            assigneeObserver.current = DataStore.observeQuery(
                models.TaskAssignee
            ).subscribe(async ({ items }) => {
                const filteredItems = items.filter(
                    (item) => item.role === role
                );
                const myTasks = [];
                for (const item of filteredItems) {
                    const assignee = await item.assignee;
                    if (assignee.id === whoami?.id) {
                        myTasks.push(item);
                    }
                }
                const resolvedTasks = await Promise.all(
                    myTasks.map((t) => {
                        return t.task;
                    })
                );
                const taskIds = resolvedTasks.map((t) => t.id);
                setTaskIds(new Set(taskIds));
            });
            return;
            // some alternative way using observe instead of observeQuery
            const initialValues = await DataStore.query(
                models.TaskAssignee,
                (t) =>
                    t.and((t) => [
                        t.role.eq(role),
                        t.assignee.id.eq(whoami?.id),
                        t.or((t) =>
                            actualStatus.map((s) => t.task.status.eq(s))
                        ),
                    ])
            );
            const resolvedTasks = await Promise.all(
                initialValues.map((t) => {
                    return t.task;
                })
            );
            const taskIds = resolvedTasks.map((t) => t.id);
            setTaskIds(new Set(taskIds));
            assigneeObserver.current.unsubscribe();
            assigneeObserver.current = DataStore.observe(
                models.TaskAssignee
            ).subscribe(async ({ opType, element }) => {
                if (opType === "DELETE") {
                    setTaskIds((prevState) => {
                        // hacky workarounds for DataStore as usual
                        // @ts-ignore
                        const taskId = element.taskAssigneesId;
                        if (prevState.has(taskId)) {
                            const newState = new Set(prevState);
                            newState.delete(taskId);
                            return newState;
                        } else {
                            return prevState;
                        }
                    });
                } else {
                    const assignment = await DataStore.query(
                        models.TaskAssignee,
                        element.id
                    );
                    const task = await assignment?.task;
                    if (!task) {
                        return;
                    }
                    const assignee = await assignment?.assignee;
                    if (
                        !assignment ||
                        assignee?.id !== whoami?.id ||
                        assignment?.role !== role ||
                        !actualStatus.some((s) => s === task?.status)
                    ) {
                        return;
                    }
                    setTaskIds((prevState) => {
                        const newState = new Set(prevState);
                        newState.add(task.id);
                        return newState;
                    });
                }
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                log(error);
                setError(error);
            }
        }
    }, [actualStatus, whoami?.id, role]);

    React.useEffect(() => {
        setUpAssignedTasksObserver();
        return () => {
            assigneeObserver.current.unsubscribe();
        };
    }, [setUpAssignedTasksObserver]);

    return { state: Object.values(state), isFetching, error };
};

export default useMyAssignedTasks;
