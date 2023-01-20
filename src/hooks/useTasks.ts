import { DataStore } from "aws-amplify";
import { DataStoreSnapshot } from "@aws-amplify/datastore";
import * as models from "../models";
import React from "react";
import { ResolvedTask } from "../resolved-models";
import moment from "moment";

export const isCompletedTab = (key: models.TaskStatus) =>
    [
        models.TaskStatus.COMPLETED,
        models.TaskStatus.CANCELLED,
        models.TaskStatus.REJECTED,
        models.TaskStatus.ABANDONED,
    ].includes(key);

const resolveTask = async (task: models.Task) => {
    //const createdBy = await task.createdBy;
    const pickUpLocation = await task.pickUpLocation;
    const dropOffLocation = await task.dropOffLocation;
    const establishmentLocation = await task.establishmentLocation;
    return {
        ...task,
        //createdBy,
        pickUpLocation,
        dropOffLocation,
        establishmentLocation,
    };
};

const generateObserveQueryWithRole = (
    userId: string,
    role: models.Role,
    status: models.TaskStatus,
    callback: (arg0: DataStoreSnapshot<models.TaskAssignee>) => void
) => {
    const oneWeekAgo = moment.utc().subtract(7, "days").toISOString();
    return DataStore.observeQuery(models.TaskAssignee, (c) =>
        c.and((c) => [
            c.assignee.id.eq(userId),
            c.role.eq(role),
            c.task.status.eq(status),
            c.or((c) => [
                c.createdAt.gt(
                    isCompletedTab(status)
                        ? oneWeekAgo
                        : "2000-01-01T00:00:00.000Z"
                ),
                c.createdAt.eq(undefined),
            ]),
        ])
    ).subscribe(callback);
};

const useTasks = (
    userId: string,
    role: models.Role | "ALL",
    status: models.TaskStatus,
    filterByRiderId?: string | null
) => {
    const [state, setState] = React.useState<ResolvedTask[]>([]);
    const [riderTasksIds, setRiderTasksIds] = React.useState<string[]>([]);
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<any>(null);
    const [refresh, setRefresh] = React.useState(false);
    const oneWeekAgo = React.useRef(
        moment.utc().subtract(7, "days").toISOString()
    );

    const observer = React.useRef({ unsubscribe: () => {} });
    // for rider filter
    const secondaryObserver = React.useRef({ unsubscribe: () => {} });
    const taskObserver = React.useRef({ unsubscribe: () => {} });

    const getTasks = React.useCallback(async () => {
        setIsFetching(true);
        observer.current.unsubscribe();
        secondaryObserver.current.unsubscribe();
        const isCompleted = isCompletedTab(status);
        if (role === "ALL") {
            try {
                observer.current = DataStore.observeQuery(models.Task, (c) =>
                    c.and((c) => [
                        c.status.eq(status),
                        c.or((c) => [
                            c.createdAt.gt(
                                isCompleted
                                    ? oneWeekAgo.current
                                    : "2000-01-01T00:00:00.000Z"
                            ),
                            c.createdAt.eq(undefined),
                        ]),
                    ])
                ).subscribe(async ({ items }) => {
                    const resolved = await Promise.all(
                        items.map(async (item) => {
                            return await resolveTask(item);
                        })
                    );
                    if (riderTasksIds.length > 0) {
                        const filtered = resolved.filter((task) =>
                            riderTasksIds.includes(task.id)
                        );
                        setState(filtered);
                    } else {
                        setState(resolved);
                    }
                    setIsFetching(false);
                });
            } catch (error) {
                setError(error);
                setIsFetching(false);
            }
        } else {
            try {
                const callback = async ({
                    items,
                }: {
                    items: models.TaskAssignee[];
                }) => {
                    const resolved = await Promise.all(
                        items.map(async (item) => {
                            return await resolveTask(await item.task);
                        })
                    );
                    if (riderTasksIds.length > 0) {
                        const filtered = resolved.filter((task) =>
                            riderTasksIds.includes(task.id)
                        );
                        setState(filtered);
                    } else {
                        setState(resolved);
                    }

                    setIsFetching(false);
                };
                observer.current = generateObserveQueryWithRole(
                    userId,
                    role,
                    status,
                    callback
                );
            } catch (error) {
                setError(error);
                setIsFetching(false);
            }
        }
    }, [userId, role, status, riderTasksIds]);

    const getRiderIds = React.useCallback(async () => {
        secondaryObserver.current.unsubscribe();
        try {
            const riderTasksCallback = async ({
                items,
            }: {
                items: models.TaskAssignee[];
            }) => {
                const tasks = await Promise.all(
                    items.map(async (item) => await item.task)
                );
                const ids = tasks.map((task) => task.id);
                setRiderTasksIds(ids);
            };
            console.log("filter by rider id", filterByRiderId);
            if (filterByRiderId) {
                secondaryObserver.current = generateObserveQueryWithRole(
                    filterByRiderId,
                    models.Role.RIDER,
                    status,
                    riderTasksCallback
                );
            }
        } catch (error) {
            setError(error);
            setIsFetching(false);
        }
    }, [filterByRiderId, status]);

    const setupTaskObserver = React.useCallback(() => {
        taskObserver.current = DataStore.observe(models.Task).subscribe(
            (newTask) => {
                try {
                    if (newTask.opType === "UPDATE") {
                        getTasks();
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        );
    }, [getTasks]);

    React.useEffect(() => {
        setupTaskObserver();
        return () => {
            taskObserver.current.unsubscribe();
        };
    }, [setupTaskObserver]);

    React.useEffect(() => {
        getTasks();
        return () => {
            observer.current.unsubscribe();
        };
    }, [getTasks]);

    React.useEffect(() => {
        getRiderIds();
        return () => {
            secondaryObserver.current.unsubscribe();
        };
    }, [getRiderIds]);

    return { state, isFetching, error };
};

export default useTasks;
