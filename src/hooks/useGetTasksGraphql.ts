import React from "react";
import { GraphQLQuery } from "@aws-amplify/api";
import { API } from "aws-amplify";
import { Task, ListTasksQuery } from "../API";

type StateType = {
    [key: string]: Task;
};

export const listTasks = /* GraphQL */ `
    query ListTasks(
        $filter: ModelTaskFilterInput
        $limit: Int
        $nextToken: String
    ) {
        listTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                id
                timeOfCall
                riderResponsibility
                priority
                status
                createdAt
                assignees {
                    items {
                        assignee {
                            displayName
                            profilePicture {
                                key
                            }
                        }
                    }
                }
                pickUpLocation {
                    name
                    ward
                    line1
                    town
                    postcode
                }
                dropOffLocation {
                    ward
                    line1
                    name
                    town
                    postcode
                }
                deliverables {
                    items {
                        count
                        deliverableType {
                            label
                            icon
                        }
                    }
                }
                comments {
                    items {
                        id
                    }
                }
                _version
                _deleted
                _lastChangedAt
            }
            nextToken
            startedAt
        }
    }
`;

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
                query: listTasks,
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
            query: listTasks,
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
