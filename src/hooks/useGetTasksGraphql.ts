import React from "react";
import { GraphQLQuery } from "@aws-amplify/api";
import { API } from "aws-amplify";
import { Task, GetTasksByTenantIdQuery } from "../API";
import { useSelector } from "react-redux";
import { tenantIdSelector } from "../redux/Selectors";

type StateType = {
    [key: string]: Task;
};

export const getTasksByTenantId = /* GraphQL */ `
    query GetTasksByTenantId(
        $filter: ModelTaskFilterInput
        $limit: Int
        $nextToken: String
        $tenantId: ID!
        $sortDirection: ModelSortDirection
    ) {
        getTasksByTenantId(
            filter: $filter
            limit: $limit
            nextToken: $nextToken
            tenantId: $tenantId
            sortDirection: $sortDirection
        ) {
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
    const tenantId = useSelector(tenantIdSelector);

    const nextToken = React.useRef<string | null | undefined>(null);

    const getNext = React.useCallback(async () => {
        if (!tenantId) return;
        if (nextToken.current) {
            const variables = {
                limit,
                nextToken: nextToken.current,
                tenantId,
                sortDirection: "DESC",
            };

            const result = await API.graphql<
                GraphQLQuery<GetTasksByTenantIdQuery>
            >({
                query: getTasksByTenantId,
                variables,
            });
            const tasks = result.data?.getTasksByTenantId?.items;
            if (tasks) {
                setState((prevState) => ({
                    ...prevState,
                    ...tasks.reduce((acc, task) => {
                        if (task) acc[task.id] = task;
                        return acc;
                    }, {} as StateType),
                }));
            }

            if (result.data?.getTasksByTenantId?.nextToken) {
                nextToken.current = result.data.getTasksByTenantId.nextToken;
            } else {
                setFinished(true);
            }
        }
    }, [limit, tenantId]);

    const getTasks = React.useCallback(async () => {
        debugger;
        if (!tenantId) return;
        const variables = {
            limit,
            tenantId,
            sortDirection: "DESC",
        };
        const result = await API.graphql<GraphQLQuery<GetTasksByTenantIdQuery>>(
            {
                query: getTasksByTenantId,
                variables,
            }
        );
        const tasks = result.data?.getTasksByTenantId?.items;
        if (tasks) {
            console.log(tasks);
            setState(
                tasks.reduce((acc, task) => {
                    if (task) acc[task.id] = task;
                    return acc;
                }, {} as StateType)
            );
        }
        if (result.data?.getTasksByTenantId?.nextToken) {
            nextToken.current = result.data.getTasksByTenantId.nextToken;
        } else {
            setFinished(true);
        }
    }, [limit, tenantId]);

    React.useEffect(() => {
        getTasks();
    }, [getTasks]);

    return { state: Object.values(state), getNext, finished };
};

export default useGetTasksGraphql;
