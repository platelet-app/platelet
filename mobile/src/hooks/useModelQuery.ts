import * as React from "react";
import { DataStore } from "aws-amplify";
import { useSelector } from "react-redux";
import { dataStoreModelSyncedStatusSelector } from "../redux/Selectors";
import {
    PersistentModel,
    PersistentModelConstructor,
} from "@aws-amplify/datastore";

const useModelQuery = <T extends PersistentModel>(
    model: PersistentModelConstructor<T>,
    id?: string
) => {
    const [state, setState] = React.useState<T | null>(null);
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);
    const [notFound, setNotFound] = React.useState(false);

    const modelSynced = useSelector(dataStoreModelSyncedStatusSelector)[
        model.name
    ];

    const getData = React.useCallback(async () => {
        if (!id) {
            setState(null);
            return;
        }
        setIsFetching(true);
        try {
            // @ts-ignore
            const result = await DataStore.query(model, id);
            if (result) {
                setState(result);
            } else {
                setNotFound(true);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error);
            }
        } finally {
            setIsFetching(false);
        }
    }, [id, model]);

    React.useEffect(() => {
        getData();
    }, [getData, modelSynced]);

    return { state, isFetching, error, setState, notFound };
};

export default useModelQuery;
