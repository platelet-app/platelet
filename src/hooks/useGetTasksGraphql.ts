import React from "react";
import * as queries from "../graphql/queries";
import { GraphQLQuery } from "@aws-amplify/api";
import { API } from "aws-amplify";
import { Task, ListTasksQuery } from "../API";

type StateType = {
    [key: string]: Task;
};

const useGetTasksGraphql = (limit: number = 10) => {
    const [state, setState] = React.useState<StateType>({});
    const [finished, setFinished] = React.useState(false);

    const nextToken = React.useRef<string | null | undefined>(null);

    const getNext = React.useCallback(async () => {
        if (nextToken.current) {
            const variables = {
                limit,
                nextToken: nextToken.current,
            };

            const result = await API.graphql<GraphQLQuery<ListTasksQuery>>({
                query: queries.listTasks,
                variables,
            });
            const tasks = result.data?.listTasks?.items;
            if (tasks) {
                setState((prevState) => ({
                    ...prevState,
                    ...tasks.reduce((acc, task) => {
                        if (task) acc[task.id] = task;
                        return acc;
                    }, {} as StateType),
                }));
            }

            if (result.data?.listTasks?.nextToken) {
                nextToken.current = result.data.listTasks.nextToken;
            } else {
                setFinished(true);
            }
        }
    }, [limit]);

    const getTasks = React.useCallback(async () => {
        const variables = {
            limit,
        };
        const result = await API.graphql<GraphQLQuery<ListTasksQuery>>({
            query: queries.listTasks,
            variables,
        });
        const tasks = result.data?.listTasks?.items;
        if (tasks) {
            setState(
                tasks.reduce((acc, task) => {
                    if (task) acc[task.id] = task;
                    return acc;
                }, {} as StateType)
            );
        }
        if (result.data?.listTasks?.nextToken) {
            nextToken.current = result.data.listTasks.nextToken;
        } else {
            setFinished(true);
        }
    }, [limit]);

    React.useEffect(() => {
        getTasks();
    }, [getTasks]);

    return { state: Object.values(state), getNext, finished };
};

export default useGetTasksGraphql;
