import React from "react";
import {
    Task,
    Priority,
    TaskStatus,
    TaskAssignee,
    Deliverable,
    Comment,
    Role,
    CommentVisibility,
} from "../API";
import { GraphQLQuery } from "@aws-amplify/api";
import { API } from "aws-amplify";
import { useSelector } from "react-redux";
import { getWhoami } from "../redux/Selectors";

export const getTask = /* GraphQL */ `
    query GetTask($id: ID!) {
        getTask(id: $id) {
            id
            createdAt
            archived
            timeOfCall
            timePickedUp
            timePickedUpSenderName
            timeDroppedOff
            timeDroppedOffRecipientName
            timeCancelled
            timeRejected
            timeRiderHome
            requesterContact {
                name
                telephoneNumber
            }
            createdBy {
                id
                name
                displayName
                profilePicture {
                    key
                }
            }
            pickUpLocation {
                id
                listed
                name
                ward
                line1
                line2
                line3
                town
                county
                state
                country
                postcode
                contact {
                    name
                    telephoneNumber
                }
                what3words
                createdAt
                updatedAt
            }
            dropOffLocation {
                id
                listed
                name
                ward
                line1
                line2
                line3
                town
                county
                state
                country
                postcode
                contact {
                    name
                    telephoneNumber
                }
                what3words
                createdAt
                updatedAt
            }
            establishmentLocation {
                id
                name
            }
            riderResponsibility
            assignees {
                items {
                    id
                    _deleted
                    createdAt
                    role
                    assignee {
                        id
                        name
                        displayName
                        profilePicture {
                            key
                        }
                    }
                }
                nextToken
                startedAt
            }
            priority
            deliverables {
                items {
                    id
                    _deleted
                    createdAt
                    deliverableType {
                        id
                        label
                    }
                    count
                    unit
                }
                nextToken
                startedAt
            }
            comments {
                items {
                    id
                    _deleted
                    createdAt
                    visibility
                    author {
                        id
                        displayName
                        profilePicture {
                            key
                        }
                    }
                    body
                    _version
                }
                nextToken
                startedAt
            }
            status
            isRiderUsingOwnVehicle
        }
    }
`;

export type GetTaskQuery = {
    getTask?: {
        __typename: "Task";
        id: string;
        archived?: number | null;
        tenantId: string;
        createdAt?: string | null;
        createdBy?: {
            __typename: "User";
            id: string;
            username: string;
            cognitoId: string;
            tenantId: string;
            isPrimaryAdmin?: number | null;
            displayName: string;
            name?: string | null;
            roles: Array<Role>;
            dateOfBirth?: string | null;
            riderResponsibility?: string | null;
            disabled?: number | null;
            createdAt: string;
            updatedAt: string;
            _version: number;
            _deleted?: boolean | null;
            _lastChangedAt: number;
        } | null;
        dateCreated: string;
        timeOfCall?: string | null;
        timePickedUp?: string | null;
        timePickedUpSenderName?: string | null;
        timeDroppedOff?: string | null;
        timeDroppedOffRecipientName?: string | null;
        timeCancelled?: string | null;
        timeRejected?: string | null;
        timeRiderHome?: string | null;
        requesterContact?: {
            __typename: "AddressAndContactDetails";
            name?: string | null;
            telephoneNumber?: string | null;
            mobileNumber?: string | null;
            emailAddress?: string | null;
            ward?: string | null;
            line1?: string | null;
            line2?: string | null;
            line3?: string | null;
            town?: string | null;
            county?: string | null;
            state?: string | null;
            country?: string | null;
            postcode?: string | null;
            what3words?: string | null;
        } | null;
        pickUpLocationId?: string | null;
        dropOffLocationId?: string | null;
        establishmentLocationId?: string | null;
        pickUpLocation?: {
            __typename: "Location";
            id: string;
            tenantId: string;
            name?: string | null;
            listed?: number | null;
            ward?: string | null;
            line1?: string | null;
            line2?: string | null;
            line3?: string | null;
            town?: string | null;
            county?: string | null;
            state?: string | null;
            country?: string | null;
            postcode?: string | null;
            what3words?: string | null;
            disabled?: number | null;
            googleMapsPlaceId?: string | null;
            createdAt: string;
            updatedAt: string;
            _version: number;
            _deleted?: boolean | null;
            _lastChangedAt: number;
            userCreatedLocationsId?: string | null;
        } | null;
        dropOffLocation?: {
            __typename: "Location";
            id: string;
            tenantId: string;
            name?: string | null;
            listed?: number | null;
            ward?: string | null;
            line1?: string | null;
            line2?: string | null;
            line3?: string | null;
            town?: string | null;
            county?: string | null;
            state?: string | null;
            country?: string | null;
            postcode?: string | null;
            what3words?: string | null;
            disabled?: number | null;
            googleMapsPlaceId?: string | null;
            createdAt: string;
            updatedAt: string;
            _version: number;
            _deleted?: boolean | null;
            _lastChangedAt: number;
            userCreatedLocationsId?: string | null;
        } | null;
        establishmentLocation?: {
            __typename: "Location";
            id: string;
            tenantId: string;
            name?: string | null;
            listed?: number | null;
            ward?: string | null;
            line1?: string | null;
            line2?: string | null;
            line3?: string | null;
            town?: string | null;
            county?: string | null;
            state?: string | null;
            country?: string | null;
            postcode?: string | null;
            what3words?: string | null;
            disabled?: number | null;
            googleMapsPlaceId?: string | null;
            createdAt: string;
            updatedAt: string;
            _version: number;
            _deleted?: boolean | null;
            _lastChangedAt: number;
            userCreatedLocationsId?: string | null;
        } | null;
        riderResponsibility?: string | null;
        assignees?: {
            __typename: "ModelTaskAssigneeConnection";
            items: Array<TaskAssignee | null>;
            nextToken?: string | null;
            startedAt?: number | null;
        } | null;
        priority?: Priority | null;
        deliverables?: {
            __typename: "ModelDeliverableConnection";
            items: Array<Deliverable | null>;
            nextToken?: string | null;
            startedAt?: number | null;
        } | null;
        comments?: {
            __typename: "ModelCommentConnection";
            items: Array<Comment | null>;
            nextToken?: string | null;
            startedAt?: number | null;
        } | null;
        status?: TaskStatus | null;
        isRiderUsingOwnVehicle?: number | null;
        updatedAt: string;
        _version: number;
        _deleted?: boolean | null;
        _lastChangedAt: number;
        userCreatedTasksId?: string | null;
    } | null;
};

const fetchTask = async (id: string) => {
    const variables = { id };
    const result = await API.graphql<GraphQLQuery<GetTaskQuery>>({
        query: getTask,
        variables,
    });
    const task = result.data?.getTask;
    return task;
};

const useTaskGraphQL = (taskId: string) => {
    const [state, setState] = React.useState<Task | null>(null);
    const [isFetching, setIsFetching] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);
    const [notFound, setNotFound] = React.useState(false);
    const whoami = useSelector(getWhoami);

    const getTask = React.useCallback(async () => {
        if (!taskId || !whoami) return;
        setIsFetching(true);
        setNotFound(false);
        setError(null);
        try {
            const task = await fetchTask(taskId);
            if (task) {
                const filteredComments = task.comments?.items?.filter(
                    (comment) =>
                        comment &&
                        (comment.visibility === CommentVisibility.EVERYONE ||
                            (comment.visibility === CommentVisibility.ME &&
                                comment.author?.id === whoami?.id))
                );
                if (filteredComments && task.comments) {
                    setState({
                        ...task,
                        comments: { ...task.comments, items: filteredComments },
                    });
                } else {
                    setState(task);
                }
            } else {
                setNotFound(true);
            }
            setIsFetching(false);
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e);
            }
            console.log(e);
            setIsFetching(false);
        }
    }, [taskId, whoami]);

    React.useEffect(() => {
        getTask();
    }, [getTask]);

    return { state, isFetching, error, notFound };
};

export default useTaskGraphQL;
