import React from "react";
import { DataStore } from "aws-amplify";
import * as models from "../models";
import convertModelsToObject from "../utilities/convertModelsToObject";
import { useSelector } from "react-redux";
import { dataStoreModelSyncedStatusSelector } from "../redux/Selectors";

type StateType = {
    [key: string]: models.RiderResponsibility;
};

const usePossibleRiderResponsibilities = (riderId: string) => {
    const [state, setState] = React.useState<StateType>({});
    const [isFetching, setIsFetching] = React.useState<boolean>(false);
    const [error, setError] = React.useState<Error | null>(null);
    const observer = React.useRef({ unsubscribe: () => {} });

    const riderResponsibilityModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).RiderResponsibility;
    const possibleRiderResponsibilityModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).PossibleRiderResponsibilities;

    const getData = React.useCallback(async () => {
        if (!riderId) return;
        setIsFetching(true);
        try {
            const currentRiderResponsibilities = await DataStore.query(
                models.PossibleRiderResponsibilities
            );
            const filtered = currentRiderResponsibilities
                .filter((resp) => {
                    return (
                        resp.user && resp.user.id && riderId === resp.user.id
                    );
                })
                .map((r) => r.riderResponsibility);
            const converted =
                convertModelsToObject<models.RiderResponsibility>(filtered);
            setState(converted);
            observer.current.unsubscribe();
            observer.current = DataStore.observe(
                models.PossibleRiderResponsibilities
            ).subscribe(() => {
                DataStore.query(models.PossibleRiderResponsibilities).then(
                    (result) => {
                        const filtered = result
                            .filter((responsibility) => {
                                return (
                                    responsibility.user &&
                                    responsibility.user.id &&
                                    riderId === responsibility.user.id
                                );
                            })
                            .map((r) => r.riderResponsibility);
                        const converted =
                            convertModelsToObject<models.RiderResponsibility>(
                                filtered
                            );
                        setState(converted);
                    }
                );
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e);
            }
            console.log(e);
            setIsFetching(false);
        }
    }, [riderId]);

    React.useEffect(() => {
        getData();
        return () => {
            observer.current.unsubscribe();
        };
    }, [
        getData,
        riderResponsibilityModelSynced,
        possibleRiderResponsibilityModelSynced,
    ]);

    return { state: Object.values(state), setState, isFetching, error };
};

export default usePossibleRiderResponsibilities;
