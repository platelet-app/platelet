import React from "react";
import * as models from "../models";
import { DataStore } from "aws-amplify";
import { useSelector } from "react-redux";
import { dataStoreModelSyncedStatusSelector } from "../redux/Selectors";
import useModelSubscription from "./useModelSubscription";

const useTask = (taskId: string) => {
    const [state, setState] = React.useState<models.Task | null>(null);
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);
    const [notFound, setNotFound] = React.useState(false);
    const loadedOnce = React.useRef(false);
    const observer = React.useRef({ unsubscribe: () => {} });

    const taskModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Task;

    const locationModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Location;

    const pickUpLocationState = useModelSubscription<models.Location>(
        models.Location,
        state?.pickUpLocation?.id
    );
    const dropOffLocationState = useModelSubscription<models.Location>(
        models.Location,
        state?.dropOffLocation?.id
    );

    const pickUpLocation = pickUpLocationState.state;
    const dropOffLocation = dropOffLocationState.state;

    const getTask = React.useCallback(async () => {
        if (!taskId) return;
        if (!loadedOnce.current) setIsFetching(true);
        observer.current.unsubscribe();
        try {
            const task = await DataStore.query(models.Task, taskId);
            if (task) {
                setState(task);
                setIsFetching(false);
                loadedOnce.current = true;
                observer.current = DataStore.observe(
                    models.Task,
                    taskId
                ).subscribe(async ({ element, opType }) => {
                    if (opType === "DELETE") {
                        setNotFound(true);
                        setState(null);
                    } else {
                        const task = await DataStore.query(
                            models.Task,
                            element.id
                        );
                        setState(task || null);
                    }
                });
            } else {
                setNotFound(true);
                setIsFetching(false);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error);
            }
            loadedOnce.current = true;
            setIsFetching(false);
        }
    }, [taskId]);

    React.useEffect(() => {
        getTask();
        return () => {
            observer.current.unsubscribe();
        };
    }, [getTask, taskModelSynced, locationModelSynced]);

    const newState = { ...state, pickUpLocation, dropOffLocation };
    return {
        state: newState,
        isFetching,
        error,
        setState,
        notFound,
    };
};

export default useTask;
