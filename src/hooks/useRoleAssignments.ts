import { DataStore } from "aws-amplify";
import * as models from "../models";
import React from "react";
import { ResolvedTaskAssignee } from "../resolved-models";

const useRoleAssignments = (
    role: models.Role,
    taskStatuses: models.TaskStatus[] = [],
    coordinatorId: string | null = null,
    tasksNewerThan: Date | null = null
) => {
    const [state, setState] = React.useState<ResolvedTaskAssignee[]>([]);
    const [assignments, setAssignments] = React.useState<models.TaskAssignee[]>(
        []
    );
    const [coordinatorAssignments, setCoordinatorAssignments] = React.useState<
        models.TaskAssignee[] | null
    >(null);
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<any>(null);

    const observer = React.useRef({ unsubscribe: () => {} });
    const observerSecond = React.useRef({ unsubscribe: () => {} });

    const getRoleAssignments = React.useCallback(async () => {
        observer.current.unsubscribe();
        if (!role) return;
        setIsFetching(true);
        try {
            if (taskStatuses.length > 0) {
                observer.current = DataStore.observeQuery(
                    models.TaskAssignee,
                    (c) =>
                        c.and((c) => [
                            c.role.eq(role),
                            c.or((c) =>
                                taskStatuses.map((status) =>
                                    c.task.status.eq(status)
                                )
                            ),
                            c.or((c) => [
                                c.createdAt.gt(
                                    tasksNewerThan
                                        ? tasksNewerThan.toISOString()
                                        : "2000-01-01T00:00:00.000Z"
                                ),
                                c.task.createdAt.eq(undefined),
                            ]),
                        ])
                ).subscribe(async ({ items }) => {
                    setAssignments(items);
                    setIsFetching(false);
                });
            } else {
                observer.current = DataStore.observeQuery(
                    models.TaskAssignee,
                    (c) =>
                        c.and((c) => [
                            c.role.eq(role),
                            c.or((c) => [
                                c.createdAt.gt(
                                    tasksNewerThan
                                        ? tasksNewerThan.toISOString()
                                        : "2000-01-01T00:00:00.000Z"
                                ),
                                c.task.createdAt.eq(undefined),
                            ]),
                        ])
                ).subscribe(async ({ items }) => {
                    setAssignments(items);
                    setIsFetching(false);
                });
            }
        } catch (error) {
            console.log(error);
            setError(error);
            setIsFetching(false);
        }
    }, [role, JSON.stringify(taskStatuses), tasksNewerThan]);

    const getCoordinatorAssignments = React.useCallback(async () => {
        observerSecond.current.unsubscribe();
        if (!coordinatorId) {
            setCoordinatorAssignments(null);
            return;
        }
        try {
            observerSecond.current = DataStore.observeQuery(
                models.TaskAssignee,
                (c) =>
                    c.and((c) => [
                        c.assignee.id.eq(coordinatorId),
                        c.role.eq(models.Role.COORDINATOR),
                        c.or((c) =>
                            taskStatuses.map((status) =>
                                c.task.status.eq(status)
                            )
                        ),

                        c.or((c) => [
                            c.createdAt.gt(
                                tasksNewerThan
                                    ? tasksNewerThan.toISOString()
                                    : "2000-01-01T00:00:00.000Z"
                            ),
                            c.task.createdAt.eq(undefined),
                        ]),
                    ])
            ).subscribe(async ({ items }) => {
                setCoordinatorAssignments(items);
            });
        } catch (error) {
            setError(error);
        }
    }, [coordinatorId, JSON.stringify(taskStatuses), tasksNewerThan]);

    React.useEffect(() => {
        getRoleAssignments();
        return () => {
            observer.current.unsubscribe();
        };
    }, [getRoleAssignments]);

    React.useEffect(() => {
        getCoordinatorAssignments();
        return () => {
            observerSecond.current.unsubscribe();
        };
    }, [getCoordinatorAssignments]);

    const calculateRiders = React.useCallback(async () => {
        let result = assignments;
        if (coordinatorAssignments) {
            const coordTaskIds = await Promise.all(
                coordinatorAssignments.map(async (a) => {
                    const t = await a.task;
                    return t.id;
                })
            );
            const filteredResult = [];
            for (const a of result) {
                const t = await a.task;
                if (coordTaskIds.includes(t.id)) {
                    filteredResult.push(a);
                }
            }
            result = filteredResult;
        }
        const resolved = await Promise.all(
            result.map(async (item) => {
                const assignee = await item.assignee;
                return {
                    ...item,
                    assignee,
                };
            })
        );
        setState(resolved);
    }, [assignments, coordinatorAssignments]);

    React.useEffect(() => {
        calculateRiders();
    }, [calculateRiders]);

    return { state, isFetching, error };
};

export default useRoleAssignments;
