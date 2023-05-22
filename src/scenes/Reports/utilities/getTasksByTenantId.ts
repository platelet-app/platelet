import {
    Priority,
    TaskStatus,
    Task,
    ListTasksByTenantIdQuery,
} from "../../../API";
import { API } from "aws-amplify";
import * as queries from "../../../graphql/queries";
import { GraphQLQuery } from "@aws-amplify/api";

// this is to keep typescript happy about filtering
// the comments
type ListTasksByTenantIdQueryaaaa = {
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
    ) {
        listTasksByTenantId(
            filter: $filter
            limit: $limit
            nextToken: $nextToken
            tenantId: $tenantId
            sortDirection: $sortDirection
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
                        assignee {
                            id
                            _deleted
                            displayName
                            name
                        }
                        role
                    }
                }
                pickUpLocation {
                    ward
                    line1
                    line2
                    line3
                    town
                    county
                    state
                    country
                    postcode
                    what3words
                }
                dropOffLocation {
                    ward
                    line1
                    line2
                    line3
                    town
                    county
                    state
                    country
                    postcode
                    what3words
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
                            displayName
                            name
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

const getTasksByTenantId = async (tenantId: string) => {
    const items = [];
    let nextToken: string | null = null;
    do {
        const variables: any = {
            tenantId,
            nextToken,
        };
        const result = await API.graphql<
            GraphQLQuery<ListTasksByTenantIdQuery>
        >({
            query: listTasksByTenantId,
            variables,
        });
        if (result.data?.listTasksByTenantId) {
            items.push(...result.data.listTasksByTenantId.items);
            nextToken = result.data.listTasksByTenantId.nextToken || null;
        }
    } while (nextToken);
    console.log("items", items);
    return items.flat();
};

export default getTasksByTenantId;
