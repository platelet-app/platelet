import * as React from "react";
import { DataStore } from "aws-amplify";
import * as models from "../models";
import convertModelListToTypedObject from "./utilities/convertModelListToTypedObject";
import _ from "lodash";

type ScheduledTasksState = {
    [key: string]: models.ScheduledTask;
};

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
                    setState(
                        convertModelListToTypedObject<models.ScheduledTask>(
                            items
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
