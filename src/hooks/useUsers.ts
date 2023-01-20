import React from "react";
import { DataStore } from "aws-amplify";
import * as models from "../models";

const useUsers = (role: models.Role | null = null) => {
    const [state, setState] = React.useState<models.User[]>([]);
    const [error, setError] = React.useState<any>(null);
    const [isFetching, setIsFetching] = React.useState(true);

    const observer = React.useRef({ unsubscribe: () => {} });

    const getUsers = React.useCallback(async () => {
        try {
            observer.current.unsubscribe();
            if (role) {
                observer.current = DataStore.observeQuery(models.User, (u) =>
                    u.roles.contains(role)
                ).subscribe(({ items }) => {
                    setState(items);
                    setIsFetching(false);
                });
            } else {
                observer.current = DataStore.observeQuery(
                    models.User
                ).subscribe(({ items }) => {
                    setState(items);
                    setIsFetching(false);
                });
            }
        } catch (e) {
            console.log(e);
            setError(e);
        }
    }, [role]);

    React.useEffect(() => {
        getUsers();
        return () => {
            observer.current.unsubscribe();
        };
    }, [getUsers]);

    return { state, isFetching, error };
};

export default useUsers;
