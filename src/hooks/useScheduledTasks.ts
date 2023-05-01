import React from "react";
import { DataStore } from "aws-amplify";
import * as models from "../models";
import convertModelListToTypedObject from "./utilities/convertModelListToTypedObject";

type ScheduledTasksState = {
    [key: string]: models.ScheduledTask;
};

const dataStoreNestedWorkAroundMapper = async (
    data: models.ScheduledTask[]
) => {
    return Promise.all(
        data.map(async (item) => {
            if (
                // @ts-ignore
                !item.taskTemplateScheduledTasksId
            ) {
                return item;
            }
            const {
                // @ts-ignore
                taskTemplateScheduledTasksId,
                ...rest
            } = item;
            const taskTemplate = taskTemplateScheduledTasksId
                ? await DataStore.query(
                      models.TaskTemplate,
                      taskTemplateScheduledTasksId
                  )
                : null;
            return { ...rest, taskTemplate };
        })
    );
};

const useScheduledTasks = () => {
    const [state, setState] = React.useState<ScheduledTasksState>({});
    const [isFetching, setIsFetching] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);
    const observer = React.useRef({ unsubscribe: () => {} });

    const getScheduledTasks = React.useCallback(async () => {
        setIsFetching(true);
        try {
            const result = await DataStore.query(models.ScheduledTask);
            setState(
                convertModelListToTypedObject<models.ScheduledTask>(result)
            );
            observer.current.unsubscribe();
            observer.current = DataStore.observeQuery(
                models.ScheduledTask
            ).subscribe(async ({ items }) => {
                const fixed = await dataStoreNestedWorkAroundMapper(items);
                setState(
                    convertModelListToTypedObject<models.ScheduledTask>(
                        fixed as models.ScheduledTask[]
                    )
                );
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e);
            }
            console.log(e);
        } finally {
            setIsFetching(false);
        }
    }, []);

    React.useEffect(() => {
        getScheduledTasks();
    }, [getScheduledTasks]);

    return { state: Object.values(state), isFetching, error };
};

export default useScheduledTasks;
