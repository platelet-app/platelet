import React from "react";
import * as models from "../models";
import { DataStore } from "aws-amplify";
import { useSelector } from "react-redux";
import { dataStoreModelSyncedStatusSelector } from "../redux/Selectors";

const useLocation = (locationId: string, wait: boolean = false) => {
    const [state, setState] = React.useState<models.Location | null>(null);
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<any>(null);
    const [notFound, setNotFound] = React.useState(false);
    const loadedOnce = React.useRef(false);
    const observer = React.useRef({ unsubscribe: () => {} });

    const locationModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Location;

    const getLocation = React.useCallback(async () => {
        if (wait) return;
        if (!loadedOnce.current) setIsFetching(true);
        if (!locationId) {
            setState(null);
            setIsFetching(false);
            loadedOnce.current = true;
            return;
        }
        observer.current.unsubscribe();
        try {
            const location = await DataStore.query(models.Location, locationId);
            if (location) {
                setState(location);
                setIsFetching(false);
                observer.current = DataStore.observe(
                    models.Location,
                    locationId
                ).subscribe(({ element }) => {
                    setState(element);
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
    }, [locationId, wait]);

    React.useEffect(() => {
        getLocation();
        return () => {
            observer.current.unsubscribe();
        };
    }, [getLocation, locationModelSynced]);

    return { state, isFetching, error, setState, notFound };
};

export default useLocation;
