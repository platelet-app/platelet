import { DataStore } from "aws-amplify";
import * as models from "../models";
import React from "react";
import convertModelsToObject from "../utilities/convertModelsToObject";

type TaskAssigneesType = {
    [key: string]: models.TaskAssignee;
};

const useTaskAssignees = (taskId: string) => {
    const [state, setState] = React.useState<TaskAssigneesType>({});
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<any>(null);

    const observer = React.useRef({ unsubscribe: () => {} });

    const getTaskAssignees = React.useCallback(async () => {
        if (!taskId) return;
        setIsFetching(true);
        observer.current.unsubscribe();
        try {
            observer.current = DataStore.observeQuery(
                models.TaskAssignee,
                (c) => c.task.id.eq(taskId)
            ).subscribe(({ items }) => {
                console.log(items);
                const result = convertModelsToObject(items);
                setState(result);
                setIsFetching(false);
            });
        } catch (error) {
            setError(error);
            setIsFetching(false);
        }
    }, [taskId]);

    React.useEffect(() => {
        getTaskAssignees();
        return () => {
            observer.current.unsubscribe();
        };
    }, [getTaskAssignees]);

    return { state, isFetching, error };
};

export default useTaskAssignees;
