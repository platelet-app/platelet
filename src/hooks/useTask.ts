import React from "react";
import * as models from "../models";
import { DataStore } from "aws-amplify";
import { useSelector } from "react-redux";
import { dataStoreModelSyncedStatusSelector } from "../redux/Selectors";
import { ResolvedTask } from "../resolved-models";

const useTask = (taskId: string) => {
    const [state, setState] = React.useState<ResolvedTask | null>(null);
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<any>(null);
    const [notFound, setNotFound] = React.useState(false);
    const loadedOnce = React.useRef(false);
    const observer = React.useRef({ unsubscribe: () => {} });

    const taskModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Task;

    const getTask = React.useCallback(async () => {
        if (!loadedOnce.current) setIsFetching(true);
        observer.current.unsubscribe();
        try {
            const task = await DataStore.query(models.Task, taskId);
            if (task) {
                const pickUpLocation = await task.pickUpLocation;
                const dropOffLocation = await task.dropOffLocation;
                const establishmentLocation = await task.establishmentLocation;
                setState({
                    ...task,
                    pickUpLocation,
                    dropOffLocation,
                    establishmentLocation,
                });
                setIsFetching(false);
                observer.current = DataStore.observe(
                    models.Task,
                    taskId
                ).subscribe(async ({ element, opType }) => {
                    if (opType === "DELETE") {
                        setNotFound(true);
                        setState(null);
                    } else {
                        const pickUpLocation = await element.pickUpLocation;
                        const dropOffLocation = await element.dropOffLocation;
                        const establishmentLocation =
                            await element.establishmentLocation;
                        setState({
                            ...element,
                            pickUpLocation,
                            dropOffLocation,
                            establishmentLocation,
                        });
                    }
                });
            } else {
                setNotFound(true);
                setIsFetching(false);
            }
        } catch (error) {
            setError(error);
            loadedOnce.current = true;
            setIsFetching(false);
        }
    }, [taskId]);

    React.useEffect(() => {
        getTask();
        return () => {
            observer.current.unsubscribe();
        };
    }, [getTask, taskModelSynced]);

    return { state, isFetching, error, setState, notFound };
};

export default useTask;
