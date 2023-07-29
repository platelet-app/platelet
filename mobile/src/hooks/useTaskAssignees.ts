import * as React from "react";
import * as models from "../models";
import { DataStore } from "aws-amplify";
import convertModelListToTypedObject from "./utilities/convertModelListToTypedObject";
import _ from "lodash";

type ResolvedTaskAssignee = Omit<models.TaskAssignee, "assignee"> & {
    assignee: models.User;
};

type StateType = {
    [key: string]: ResolvedTaskAssignee;
};

const useTaskAssignees = (taskId: string) => {
    const taskAssigneesObserver = React.useRef({ unsubscribe: () => {} });
    const [state, setState] = React.useState<StateType>({});
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const getTaskAssignees = React.useCallback(async () => {
        try {
            taskAssigneesObserver.current.unsubscribe();
            taskAssigneesObserver.current = DataStore.observeQuery(
                models.TaskAssignee,
                (d) => d.task.id.eq(taskId)
            ).subscribe(async ({ items }) => {
                const resolved: ResolvedTaskAssignee[] = await Promise.all(
                    items.map(async (item) => {
                        const assignee = (await item.assignee) || null;
                        return { ...item, assignee };
                    })
                );
                const typedTaskAssignees =
                    convertModelListToTypedObject<ResolvedTaskAssignee>(
                        resolved
                    );
                setState(typedTaskAssignees);
                setIsFetching(false);
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e);
            }
            console.log(e);
            setIsFetching(false);
        }
    }, [taskId]);

    React.useEffect(() => {
        getTaskAssignees();
        return () => taskAssigneesObserver.current.unsubscribe();
    }, [getTaskAssignees]);

    return { state: Object.values(state), isFetching, error };
};

export default useTaskAssignees;
