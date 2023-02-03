import React from "react";
import { DataStore } from "aws-amplify";
import { useSelector } from "react-redux";
import { dataStoreModelSyncedStatusSelector } from "../redux/Selectors";
import * as models from "../models";
import { ResolvedDeliverable } from "../resolved-models";

const useTaskDeliverables = (taskId: string) => {
    const loadedOnce = React.useRef(false);
    const [state, setState] = React.useState<ResolvedDeliverable[]>([]);
    const [isFetching, setIsFetching] = React.useState(false);
    const [error, setError] = React.useState<any>(null);
    const observer = React.useRef({ unsubscribe: () => {} });

    const deliverableTypesSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).DeliverableType;

    const getDeliverables = React.useCallback(async () => {
        if (!loadedOnce.current) setIsFetching(true);
        try {
            setIsFetching(false);
            loadedOnce.current = true;

            observer.current.unsubscribe();
            observer.current = DataStore.observeQuery(models.Deliverable, (d) =>
                d.task.id.eq(taskId)
            ).subscribe(async ({ items }) => {
                const resolvedDeliverables = await Promise.all(
                    items.map(async (d): Promise<ResolvedDeliverable> => {
                        const deliverableType = await d.deliverableType;
                        return {
                            ...d,
                            deliverableType,
                        };
                    })
                );
                setState(resolvedDeliverables);
            });
        } catch (error) {
            console.log(error);
            setError(error);
            setIsFetching(false);
        }
    }, [taskId]);

    React.useEffect(() => {
        getDeliverables();
        return () => {
            observer.current.unsubscribe();
        };
    }, [getDeliverables, deliverableTypesSynced]);
    React.useEffect(() => {
        console.log("useTaskDeliverables", state);
    }, [state]);
    return { state, isFetching, error, setState };
};

export default useTaskDeliverables;
