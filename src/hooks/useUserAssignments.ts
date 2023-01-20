import { DataStore } from "aws-amplify";
import * as models from "../models";
import React from "react";
import { ResolvedTaskAssignee } from "../resolved-models";

const useUserAssignments = (
    userId: string,
    role: models.Role,
    status: models.TaskStatus
) => {
    const [state, setState] = React.useState<ResolvedTaskAssignee[]>([]);
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<any>(null);

    const observer = React.useRef({ unsubscribe: () => {} });

    const getUserAssignments = React.useCallback(async () => {
        if (!userId) return;
        setIsFetching(true);
        observer.current.unsubscribe();
        try {
            observer.current = DataStore.observeQuery(
                models.TaskAssignee,
                (c) =>
                    c.and((c) => [
                        c.assignee.id.eq(userId),
                        c.role.eq(role),
                        c.task.status.eq(status),
                    ])
            ).subscribe(async ({ items }) => {
                const resolved = await Promise.all(
                    items.map(async (item) => {
                        const assignee = await item.assignee;
                        return {
                            ...item,
                            assignee,
                        };
                    })
                );
                setState(resolved);
                setIsFetching(false);
            });
        } catch (error) {
            setError(error);
            setIsFetching(false);
        }
    }, [userId, role, status]);

    React.useEffect(() => {
        getUserAssignments();
        return () => {
            observer.current.unsubscribe();
        };
    }, [getUserAssignments]);

    return { state, isFetching, error };
};

export default useUserAssignments;
