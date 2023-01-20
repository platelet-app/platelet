import React from "react";
import * as models from "../models";
import { DataStore } from "aws-amplify";

const usePossibleRiderResponsibilities = (userId: string) => {
    const [state, setState] = React.useState<models.RiderResponsibility[]>([]);
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<any>(null);

    const observer = React.useRef({ unsubscribe: () => {} });

    const getPossibleRiderResponsibilities = React.useCallback(async () => {
        observer.current.unsubscribe();
        setIsFetching(true);
        try {
            observer.current = DataStore.observeQuery(
                models.PossibleRiderResponsibilities,
                (c) => c.user.id.eq(userId)
            ).subscribe(async ({ items }) => {
                const riderResponsibilities = await Promise.all(
                    items.map(async (item) => await item.riderResponsibility)
                );
                setState(riderResponsibilities);
                setIsFetching(false);
            });
        } catch (error) {
            setError(error);
            setIsFetching(false);
        }
    }, [userId]);

    React.useEffect(() => {
        getPossibleRiderResponsibilities();
        return () => {
            observer.current.unsubscribe();
        };
    }, [getPossibleRiderResponsibilities]);

    return { state, isFetching, error };
};

export default usePossibleRiderResponsibilities;
