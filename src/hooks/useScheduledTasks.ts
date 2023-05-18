import React from "react";
import { DataStore } from "aws-amplify";
import * as models from "../models";
import convertModelListToTypedObject from "./utilities/convertModelListToTypedObject";
import _ from "lodash";

type ScheduledTasksState = {
    [key: string]: models.ScheduledTask;
};

async function dataStoreNestedWorkAroundMapper(
    data: models.ScheduledTask[] = []
) {
    return Promise.all(
        data.map(async (item) => {
            // @ts-ignore
            const {
                // @ts-ignore
                pickUpLocationId,
                // @ts-ignore
                dropOffLocationId,
                // @ts-ignore
                establishmentLocationId,
                ...rest
            } = item;
            const pickUpLocation = pickUpLocationId
                ? await DataStore.query(models.Location, pickUpLocationId)
                : rest.pickUpLocation;
            const dropOffLocation = dropOffLocationId
                ? await DataStore.query(models.Location, dropOffLocationId)
                : rest.dropOffLocation;
            const establishmentLocation = establishmentLocationId
                ? await DataStore.query(
                      models.Location,
                      establishmentLocationId
                  )
                : rest.establishmentLocation;
            return {
                ...rest,
                pickUpLocation,
                dropOffLocation,
                establishmentLocation,
            };
        })
    );
}

const useScheduledTasks = () => {
    const [state, setState] = React.useState<ScheduledTasksState>({});
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);
    const observer = React.useRef({ unsubscribe: () => {} });
    const locationObserver = React.useRef({ unsubscribe: () => {} });

    const getScheduledTasks = React.useCallback(async () => {
        setIsFetching(true);
        try {
            const restartObserver = () => {
                observer.current.unsubscribe();
                observer.current = DataStore.observeQuery(
                    models.ScheduledTask
                ).subscribe(async ({ items }) => {
                    const itemsWithNestedData =
                        await dataStoreNestedWorkAroundMapper(items);
                    setState(
                        convertModelListToTypedObject<models.ScheduledTask>(
                            itemsWithNestedData
                        )
                    );
                    setIsFetching(false);
                });
            };

            const debouncedRestartObserver = _.debounce(restartObserver, 1000, {
                trailing: true,
            });

            locationObserver.current.unsubscribe();
            locationObserver.current = DataStore.observe(
                models.Location
            ).subscribe(async ({ opType }) => {
                if (opType === "UPDATE") {
                    debouncedRestartObserver();
                }
            });
            restartObserver();
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e);
            }
            console.log(e);
            setIsFetching(false);
        }
    }, []);

    React.useEffect(() => {
        getScheduledTasks();
        return () => {
            observer.current.unsubscribe();
            locationObserver.current.unsubscribe();
        };
    }, [getScheduledTasks]);

    return { state: Object.values(state), isFetching, error };
};

export default useScheduledTasks;
