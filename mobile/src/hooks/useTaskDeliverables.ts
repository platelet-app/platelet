import * as React from "react";
import * as models from "../models";
import { DataStore } from "aws-amplify";
import convertModelListToTypedObject from "./utilities/convertModelListToTypedObject";
import _ from "lodash";

type ResolvedDeliverable = Omit<models.Deliverable, "deliverableType"> & {
    deliverableType: models.DeliverableType | null;
};

type StateType = {
    [key: string]: ResolvedDeliverable;
};

const useTaskDeliverables = (taskId: string) => {
    const deliverablesObserver = React.useRef({ unsubscribe: () => {} });

    const [state, setState] = React.useState<StateType>({});
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const getDeliverables = React.useCallback(async () => {
        try {
            deliverablesObserver.current.unsubscribe();
            deliverablesObserver.current = DataStore.observeQuery(
                models.Deliverable,
                (d) => d.task.id.eq(taskId)
            ).subscribe(async ({ items }) => {
                const resolved: ResolvedDeliverable[] = await Promise.all(
                    items.map(async (item) => {
                        const deliverableType =
                            (await item.deliverableType) || null;
                        return { ...item, deliverableType };
                    })
                );
                const typedDeliverables =
                    convertModelListToTypedObject<ResolvedDeliverable>(
                        resolved
                    );
                setState(typedDeliverables);
                setIsFetching(false);
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e);
            }
            console.log(e);
        }
    }, [taskId]);

    React.useEffect(() => {
        getDeliverables();
        return () => deliverablesObserver.current.unsubscribe();
    }, [getDeliverables]);

    return { state: Object.values(state), isFetching, error };
};

export default useTaskDeliverables;
