import React from "react";
import { DataStore } from "aws-amplify";
import * as models from "../models";
import convertModelsToObject from "../utilities/convertModelsToObject";
import { ConvertedModelObject } from "../shared/types";
import _ from "lodash";

export const useTaskHandovers = (taskId: string) => {
    const [state, setState] = React.useState<
        ConvertedModelObject<models.Handover>
    >({});
    const [error, setError] = React.useState<Error | null>(null);
    const [isFetching, setIsFetching] = React.useState<boolean>(false);
    const handoverSubscription = React.useRef({ unsubscribe: () => {} });
    const getHandovers = React.useCallback(async () => {
        try {
            setIsFetching(true);
            const result = (await DataStore.query(models.Handover)).filter(
                (h) => h.task?.id === taskId
            );
            const handoverState = convertModelsToObject(result);
            setState(handoverState);
            handoverSubscription.current = DataStore.observe(
                models.Handover
            ).subscribe(async ({ opType, element }) => {
                // These ignores are in here because of DataStore not properly resolving relations
                // this can be removed once DataStore is upgraded
                // and the condition removed
                //
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (element.task || element.taskHandoversId) {
                    if (
                        element.task?.id === taskId ||
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        element.taskHandoversId === taskId
                    ) {
                        if (opType === "DELETE") {
                            setState((prevState) =>
                                _.omit(prevState, element.id)
                            );
                        } else {
                            const newElement = await DataStore.query(
                                models.Handover,
                                element.id
                            );
                            if (newElement) {
                                setState((prevState) => ({
                                    ...prevState,
                                    [newElement.id]: newElement,
                                }));
                            }
                        }
                    }
                }
            });
            setIsFetching(false);
        } catch (error: any) {
            console.log(error);
            setError(error);
        }
    }, [taskId]);

    React.useEffect(() => {
        getHandovers();
        return () => {
            handoverSubscription.current.unsubscribe();
        };
    }, [getHandovers]);
    return { state, error, isFetching };
};
