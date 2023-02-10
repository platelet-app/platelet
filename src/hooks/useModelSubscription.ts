import React from "react";
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

    const userModelSynced = useSelector(dataStoreModelSyncedStatusSelector)[
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
            const result = await DataStore.query(model, id);
            if (result) {
                setState(result);
                setIsFetching(false);
                observer.current = DataStore.observe(model, id).subscribe(
                    ({ element }) => {
                        setState(element);
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
    }, [getData, userModelSynced]);

    return { state, isFetching, error, setState, notFound };
};

export default useModelSubscription;
