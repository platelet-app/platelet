import React from "react";
import * as models from "../models";
import { DataStore } from "aws-amplify";
import { useSelector } from "react-redux";
import { dataStoreModelSyncedStatusSelector } from "../redux/Selectors";
import convertModelListToTypedObject from "./utilities/convertModelListToTypedObject";
import _ from "lodash";

type StateType = {
    [key: string]: models.Deliverable;
};

const useTaskDeliverables = (
    taskId: string,
    taskModelType: "Task" | "ScheduledTask"
) => {
    const deliverablesObserver = React.useRef({ unsubscribe: () => {} });
    const deliverablesSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Deliverable;
    const deliverableTypesSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).DeliverableType;

    const [state, setState] = React.useState<StateType>({});
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const loadedOnce = React.useRef(false);
    const getDeliverables = React.useCallback(async () => {
        if (!loadedOnce.current) setIsFetching(true);
        try {
            const result = await DataStore.query(models.Deliverable);
            let filtered = [];
            if (taskModelType === "Task") {
                filtered = result.filter((d) => d.task && d.task.id === taskId);
            } else {
                filtered = result.filter(
                    (d) => d.scheduledTask && d.scheduledTask.id === taskId
                );
            }
            setState(
                convertModelListToTypedObject<models.Deliverable>(filtered)
            );
            setIsFetching(false);
            loadedOnce.current = true;
            deliverablesObserver.current.unsubscribe();
            deliverablesObserver.current = DataStore.observe(
                models.Deliverable
            ).subscribe(async ({ opType, element }) => {
                DataStore.query(models.Deliverable, element.id).then(
                    (result) => {
                        if (opType === "DELETE") {
                            setState((prevState) =>
                                _.omit(prevState, element.id)
                            );
                            return;
                        }
                        // DataStore quirk
                        if (
                            // @ts-ignore
                            element.taskDeliverablesId !== taskId &&
                            // @ts-ignore
                            element.scheduledTaskDeliverablesId !== taskId
                        )
                            return;
                        if (result) {
                            if (opType === "INSERT") {
                                setState((prevState) => ({
                                    ...prevState,
                                    [element.id]: result,
                                }));
                            } else if (opType === "UPDATE") {
                                setState((prevState) => ({
                                    ...prevState,
                                    [element.id]: result,
                                }));
                            }
                        }
                    }
                );
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e);
            }
            console.log(e);
        }
    }, [taskId, taskModelType]);

    React.useEffect(() => {
        getDeliverables();
        return () => deliverablesObserver.current.unsubscribe();
    }, [deliverablesSynced, deliverableTypesSynced, getDeliverables]);

    return { state, isFetching, error, setState };
};

export default useTaskDeliverables;
