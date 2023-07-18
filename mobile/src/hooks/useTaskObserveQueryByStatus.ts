import { DataStore } from "aws-amplify";
import React from "react";
import * as models from "../models";

const useTaskObserveQueryByStatus = (
    status: models.TaskStatus[] | models.TaskStatus
) => {
    const observeQuery = React.useRef({ unsubscribe: () => {} });
    const [state, setState] = React.useState<models.Task[]>([]);
    const [error, setError] = React.useState<Error | null>(null);
    const [isFetching, setIsFetching] = React.useState(false);

    let actualStatus: models.TaskStatus[] = React.useMemo(() => {
        if (!Array.isArray(status)) {
            return [status];
        } else {
            return status;
        }
    }, [status]);

    const getTasks = React.useCallback(() => {
        try {
            observeQuery.current.unsubscribe();
            observeQuery.current = DataStore.observeQuery(
                models.Task
            ).subscribe(({ items }) => {
                // for some reason observeQuery won't update
                // when just filtered by status
                // so gotta do it manually I guess
                const filtered = items.filter((item) =>
                    actualStatus.some((s) => s === item.status)
                );
                setState(filtered);
                setIsFetching(false);
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error);
            }
            setIsFetching(false);
        }
    }, [actualStatus]);

    React.useEffect(() => {
        getTasks();
        return () => {
            observeQuery.current.unsubscribe();
        };
    }, [getTasks]);

    return { state, isFetching, error };
};

export default useTaskObserveQueryByStatus;
