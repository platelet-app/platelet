import React from "react";
import * as models from "../models";
import { DataStore } from "aws-amplify";
import { useSelector } from "react-redux";
import { dataStoreModelSyncedStatusSelector } from "../redux/Selectors";

const useUser = (userId: string) => {
    const [state, setState] = React.useState<models.User | null>(null);
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<any>(null);
    const [notFound, setNotFound] = React.useState(false);

    const observer = React.useRef({ unsubscribe: () => {} });

    const userModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).User;

    const getUser = React.useCallback(async () => {
        observer.current.unsubscribe();
        setIsFetching(true);
        try {
            const user = await DataStore.query(models.User, userId);
            if (user) {
                setState(user);
                setIsFetching(false);
                observer.current = DataStore.observe(
                    models.User,
                    userId
                ).subscribe(({ element }) => {
                    setState(element);
                });
            } else {
                setNotFound(true);
                setIsFetching(false);
            }
        } catch (error) {
            setError(error);
            setIsFetching(false);
        }
    }, [userId]);

    React.useEffect(() => {
        getUser();
        return () => {
            observer.current.unsubscribe();
        };
    }, [getUser, userModelSynced]);

    return { state, isFetching, error, setState, notFound };
};

export default useUser;
