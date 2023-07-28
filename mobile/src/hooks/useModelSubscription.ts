import * as React from "react";
import { DataStore } from "aws-amplify";
import { useSelector } from "react-redux";
import { dataStoreModelSyncedStatusSelector } from "../redux/Selectors";
import {
    PersistentModel,
    PersistentModelConstructor,
} from "@aws-amplify/datastore";

const useModelSubscription = <T extends PersistentModel>(
    model: PersistentModelConstructor<T>,
    id?: string
) => {
    const [state, setState] = React.useState<T | null>(null);
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);
    const [notFound, setNotFound] = React.useState(false);

    const observer = React.useRef({ unsubscribe: () => {} });

    const modelSynced = useSelector(dataStoreModelSyncedStatusSelector)[
        model.name
    ];

    const getData = React.useCallback(async () => {
        if (!id) {
            setState(null);
            return;
        }
        observer.current.unsubscribe();
        setIsFetching(true);
        try {
            // @ts-ignore
            const result = await DataStore.query(model, id);

            if (result) {
                setNotFound(false);
                setState(result);
                setIsFetching(false);
                observer.current = DataStore.observe(model, id).subscribe(
                    async ({ opType }) => {
                        if (opType === "DELETE") {
                            setNotFound(true);
                            return;
                        } else {
                            // @ts-ignore
                            const result = await DataStore.query(model, id);
                            if (!result) {
                                setNotFound(true);
                            } else {
                                setState(result);
                            }
                        }
                    }
                );
            } else {
                setNotFound(true);
                setIsFetching(false);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error);
            }
            setIsFetching(false);
        }
    }, [id, model]);

    React.useEffect(() => {
        getData();
        return () => {
            observer.current.unsubscribe();
        };
    }, [getData, modelSynced]);

    return { state, isFetching, error, setState, notFound };
};

export default useModelSubscription;
