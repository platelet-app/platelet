import React from "react";
import { GraphQLQuery } from "@aws-amplify/api";
import { API } from "aws-amplify";
import {
    Task,
    ModelSortDirection,
    Comment,
    CommentVisibility,
    Location,
    Priority,
    TaskStatus,
} from "../API";
import { useSelector } from "react-redux";
import { getWhoami, tenantIdSelector } from "../redux/Selectors";

type StateType = {
    [key: string]: Task;
};

// this is to keep typescript happy about filtering
// the comments
type ListTasksByTenantIdQuery = {
    listTasksByTenantId?: {
        __typename: "ModelTaskConnection";
        items: Array<{
            __typename: "Task";
            id: string;
            tenantId: string;
            dateCreated: string;
            timeOfCall?: string | null;
            pickUpLocation?: Location | null;
            dropOffLocation?: Location | null;
            riderResponsibility?: string | null;
            priority?: Priority | null;
            status?: TaskStatus | null;
            comments?: {
                __typename: "ModelCommentConnection";
                items: Array<Comment>;
                nextToken?: string | null;
                startedAt?: number | null;
            } | null;
            createdAt: string;
            updatedAt: string;
            _version: number;
            _deleted?: boolean | null;
            _lastChangedAt: number;
            userCreatedTasksId?: string | null;
        } | null>;
        nextToken?: string | null;
        startedAt?: number | null;
    } | null;
};

export const listTasksByTenantId = /* GraphQL */ `
    query ListTasksByTenantId(
        $filter: ModelTaskFilterInput
        $limit: Int
        $nextToken: String
        $tenantId: ID!
        $sortDirection: ModelSortDirection
        $startDate: String
        $endDate: String
    ) {
        listTasksByTenantId(
            filter: $filter
            limit: $limit
            nextToken: $nextToken
            tenantId: $tenantId
            sortDirection: $sortDirection
            createdAt: { between: [$startDate, $endDate] }
        ) {
            items {
                id
                timeOfCall
                dateCreated
                riderResponsibility
                priority
                status
                createdAt
                assignees {
                    items {
                        _deleted
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
                        _deleted
                        deliverableType {
                            label
                            icon
                        }
                    }
                }
                comments {
                    items {
                        id
                        _deleted
                        visibility
                        author {
                            id
                        }
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

const sortByCreatedAt = (a: any, b: any, direction: ModelSortDirection) => {
    const createdAtA = new Date(a.createdAt);
    const createdAtB = new Date(b.createdAt);

    if (direction === ModelSortDirection.ASC) {
        return createdAtA.getTime() - createdAtB.getTime();
    } else {
        return createdAtB.getTime() - createdAtA.getTime();
    }
};

const useGetTasksGraphql = (
    limit: number = 10,
    sortDirection: ModelSortDirection = ModelSortDirection.DESC,
    startDate: Date | null = null,
    endDate: Date | null = null
) => {
    const [state, setState] = React.useState<StateType>({});
    const [isFetching, setIsFetching] = React.useState(false);
    const [isFinished, setIsFinished] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);
    const whoami = useSelector(getWhoami);
    const tenantId = useSelector(tenantIdSelector);

    const nextToken = React.useRef<string | null | undefined>(null);

    const filterComments = React.useCallback(
        (comments: (Comment | null)[]) => {
            return comments.filter(
                (c) =>
                    c &&
                    (c.visibility === CommentVisibility.EVERYONE ||
                        (c.visibility === CommentVisibility.ME &&
                            c.author &&
                            c.author.id === whoami.id))
            );
        },
        [whoami]
    );

    const getNext = React.useCallback(async () => {
        try {
            if (!tenantId) return;
            if (nextToken.current) {
                const variables = {
                    limit,
                    nextToken: nextToken.current,
                    tenantId,
                    sortDirection,
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString(),
                };

                const result = await API.graphql<
                    GraphQLQuery<ListTasksByTenantIdQuery>
                >({
                    query: listTasksByTenantId,
                    variables,
                });
                const tasks = result.data?.listTasksByTenantId?.items;
                if (result.data?.listTasksByTenantId?.nextToken) {
                    nextToken.current =
                        result.data.listTasksByTenantId.nextToken;
                } else {
                    setIsFinished(true);
                    nextToken.current = null;
                }
                if (tasks) {
                    const tasksSorted = tasks.sort((a, b) =>
                        sortByCreatedAt(a, b, sortDirection)
                    );
                    const result = tasksSorted.reduce((acc, task) => {
                        if (task) {
                            const filtered = filterComments(
                                task.comments?.items || []
                            );
                            acc[task.id] = {
                                ...task,
                                comments: {
                                    __typename: "ModelCommentConnection",
                                    items: filtered,
                                },
                            };
                        }
                        return acc;
                    }, {} as StateType);
                    setState((prevState) => ({
                        ...prevState,
                        ...result,
                    }));
                }
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e);
            }
            setIsFinished(true);
            nextToken.current = null;
            console.log(e);
        }
    }, [limit, tenantId, sortDirection, startDate, endDate, filterComments]);

    const getTasks = React.useCallback(async () => {
        try {
            if (!tenantId) return;
            setState({});
            setIsFinished(false);
            setIsFetching(true);
            const variables = {
                limit,
                tenantId,
                sortDirection,
                startDate: startDate?.toISOString(),
                endDate: endDate?.toISOString(),
            };
            const result = await API.graphql<
                GraphQLQuery<ListTasksByTenantIdQuery>
            >({
                query: listTasksByTenantId,
                variables,
            });
            const tasks = result.data?.listTasksByTenantId?.items;

            if (tasks) {
                const tasksSorted = tasks.sort((a, b) =>
                    sortByCreatedAt(a, b, sortDirection)
                );
                const result = tasksSorted.reduce((acc, task) => {
                    if (task) {
                        const filtered = filterComments(
                            task.comments?.items || []
                        );
                        acc[task.id] = {
                            ...task,
                            comments: {
                                __typename: "ModelCommentConnection",
                                items: filtered,
                            },
                        };
                    }
                    return acc;
                }, {} as StateType);
                setState(result);
            }
            if (result.data?.listTasksByTenantId?.nextToken) {
                nextToken.current = result.data.listTasksByTenantId.nextToken;
            } else {
                setIsFinished(true);
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e);
            }
            setIsFinished(true);
            console.log(e);
        } finally {
            setIsFetching(false);
        }
    }, [limit, tenantId, sortDirection, startDate, endDate, filterComments]);

    React.useEffect(() => {
        getTasks();
    }, [getTasks]);

    const refresh = React.useCallback(() => {
        getTasks();
    }, [getTasks]);

    return {
        state: Object.values(state),
        getNext,
        isFinished,
        isFetching,
        error,
        refresh,
    };
};

export default useGetTasksGraphql;
