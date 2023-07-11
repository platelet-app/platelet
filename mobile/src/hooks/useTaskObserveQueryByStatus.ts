import { DataStore } from "aws-amplify";
import React from "react";
import * as models from "../models";

const useTaskObserveQueryByStatus = (status: models.TaskStatus) => {
    const observeQuery = React.useRef({ unsubscribe: () => {} });
    const [state, setState] = React.useState<models.Task[]>([]);
    const [error, setError] = React.useState<Error | null>(null);
    const [isFetching, setIsFetching] = React.useState(false);

    const getTasks = React.useCallback(() => {
        try {
            observeQuery.current.unsubscribe();
            observeQuery.current = DataStore.observeQuery(
                models.Task
            ).subscribe(({ items }) => {
                // for some reason observeQuery won't update
                // when just filtered by status
                // so gotta do it manually I guess
                console.log("items", items);
                const filtered = items.filter((item) => item.status === status);
                setState(filtered);
                setIsFetching(false);
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error);
            }
        } finally {
            setIsFetching(false);
        }
    }, [status]);

    React.useEffect(() => {
        getTasks();
        return () => {
            observeQuery.current.unsubscribe();
        };
    }, [getTasks]);

    return { state, isFetching, error };
};

export default useTaskObserveQueryByStatus;
