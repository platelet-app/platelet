/* Amplify Params - DO NOT EDIT
	API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { Sha256 } = require("@aws-crypto/sha256-js");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { SignatureV4 } = require("@aws-sdk/signature-v4");
const { HttpRequest } = require("@aws-sdk/protocol-http");
const { default: fetch, Request } = require("node-fetch");
const moment = require("moment");

const GRAPHQL_ENDPOINT = process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT;

const query = /* GraphQL */ `
    query LIST_TASKS_BY_ARCHIVE_STATUS(
        $archived: Int!
        $status: ModelStringKeyConditionInput
        $nextToken: String
    ) {
        tasksByArchivedStatus(
            archived: $archived
            status: $status
            nextToken: $nextToken
        ) {
            items {
                id
                createdAt
                establishmentLocation {
                    id
                    listed
                    _version
                }
                pickUpLocation {
                    id
                    listed
                    _version
                }
                dropOffLocation {
                    id
                    listed
                    _version
                }
                _version
            }
            nextToken
        }
    }
`;

const getTaskAssigneesQuery = /* GraphQL */ `
    query GetTaskAssignees(
        $id: ID!,
        $nextToken: String
    ) {
        getTask(id: $id) {
            id
            assignees(nextToken: $nextToken) {
                items {
                    id
                    _version
                }
                nextToken
            };
        };
    };
`;

const getTaskDeliverablesQuery = /* GraphQL */ `
    query GetTaskDeliverables($id: ID!, $nextToken: String) {
        getTask(id: $id) {
            id
            deliverables(nextToken: $nextToken) {
                items {
                    id
                    _version
                }
                nextToken
            };
        };
    };
`;

const getTaskCommentsQuery = /* GraphQL */ `
    query GetTaskComments($id: ID!, $nextToken: String) {
        getTask(id: $id) {
            id
            comments(nextToken: $nextToken) {
                items {
                    id
                    _version
                }
                nextToken
            };
        };
    };
`;

const updateTaskMutation = /* GraphQL */ `
    mutation UpdateTask($input: UpdateTaskInput!) {
        updateTask(input: $input) {
            id
            archived
        }
    }
`;

const updateDeliverableMutation = /* GraphQL */ `
    mutation UpdateDeliverable($input: UpdateDeliverableInput!) {
        updateDeliverable(input: $input) {
            id
            archived
        };
    };
`;

const updateCommentMutation = /* GraphQL */ `
    mutation UpdateComment($input: UpdateCommentInput!) {
        updateComment(input: $input) {
            id
            archived
        };
    };
`;

const updateLocationMutation = /* GraphQL */ `
    mutation UpdateLocation($input: UpdateLocationInput!) {
        updateLocation(input: $input) {
            id
            archived
        };
    };
`;

const updateTaskAssigneeMutation = /* GraphQL */ `
    mutation UpdateTaskAssignee($input: UpdateTaskAssigneeInput!) {
        updateTaskAssignee(input: $input) {
            id
            archived
        };
    };
`;

let makeNewRequest = async (query, variables) => {
    const endpoint = new URL(GRAPHQL_ENDPOINT);
    const signer = new SignatureV4({
        credentials: defaultProvider(),
        region: process.env.REGION,
        service: "appsync",
        sha256: Sha256,
    });

    const requestToBeSigned = new HttpRequest({
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            host: endpoint.host,
        },
        hostname: endpoint.host,
        body: JSON.stringify({
            query,
            variables,
        }),
        path: endpoint.pathname,
    });

    const signed = await signer.sign(requestToBeSigned);
    return new Request(endpoint, signed);
};

exports.makeNewRequest = makeNewRequest;

const getTaskAssignees = async (task) => {
    const items = [];
    let nextToken = null;
    do {
        const variables = {
            id: task.id,
            nextToken,
        };
        const request = await makeNewRequest(getTaskAssigneesQuery, variables);
        const response = await fetch(request);
        const body = await response.json();
        if (body.data.getTask) {
            items.push(...body.data.getTask.assignees.items);
            nextToken = body.data.getTask.assignees.nextToken;
        } else {
            nextToken = null;
        }
    } while (nextToken);
    return items.flat();
};

const getDeliverables = async (task) => {
    const items = [];
    let nextToken = null;
    do {
        const variables = {
            id: task.id,
            nextToken,
        };
        const request = await makeNewRequest(
            getTaskDeliverablesQuery,
            variables
        );
        const response = await fetch(request);
        const body = await response.json();
        if (body.data.getTask) {
            items.push(...body.data.getTask.deliverables.items);
            nextToken = body.data.getTask.deliverables.nextToken;
        } else {
            nextToken = null;
        }
    } while (nextToken);
    return items.flat();
};

const getComments = async (task) => {
    const items = [];
    let nextToken = null;
    do {
        const variables = {
            id: task.id,
            nextToken,
        };
        const request = await makeNewRequest(getTaskCommentsQuery, variables);
        const response = await fetch(request);
        const body = await response.json();
        if (body.data.getTask) {
            items.push(...body.data.getTask.comments.items);
            nextToken = body.data.getTask.comments.nextToken;
        } else {
            nextToken = null;
        }
    } while (nextToken);
    return items.flat();
};

const getUnArchivedTasksByStatus = async (status) => {
    const items = [];
    let nextToken = null;

    do {
        const variables = {
            archived: 0,
            status: { eq: status },
            nextToken,
        };
        const request = await makeNewRequest(query, variables);
        const response = await fetch(request);
        const body = await response.json();
        if (body.data.tasksByArchivedStatus) {
            items.push(...body.data.tasksByArchivedStatus.items);
            nextToken = body.data.tasksByArchivedStatus.nextToken;
        } else {
            nextToken = null;
        }
    } while (nextToken);

    return items.flat();
};

const updateTaskAssignees = async (assignment) => {
    const variables = {
        input: {
            id: assignment.id,
            archived: 1,
            _version: assignment._version,
        },
    };
    const request = await makeNewRequest(updateTaskAssigneeMutation, variables);
    const response = await fetch(request);
    const body = await response.json();
    return body.data.updateTaskAssignee;
};

const updateDeliverable = async (deliverable) => {
    const variables = {
        input: {
            id: deliverable.id,
            archived: 1,
            _version: deliverable._version,
        },
    };
    const request = await makeNewRequest(updateDeliverableMutation, variables);
    const response = await fetch(request);
    const body = await response.json();
    return body.data.updateDeliverable;
};

const updateComment = async (comment) => {
    const variables = {
        input: {
            id: comment.id,
            archived: 1,
            _version: comment._version,
        },
    };
    const request = await makeNewRequest(updateCommentMutation, variables);
    const response = await fetch(request);
    const body = await response.json();
    return body.data.updateComment;
};

const updateLocation = async (location) => {
    const variables = {
        input: {
            id: location.id,
            archived: 1,
            _version: location._version,
        },
    };
    const request = await makeNewRequest(updateLocationMutation, variables);
    const response = await fetch(request);
    const body = await response.json();
    return body.data.updateLocation;
};

const updateTask = async (task) => {
    const variables = {
        input: {
            id: task.id,
            archived: 1,
            _version: task._version,
        },
    };
    const request = await makeNewRequest(updateTaskMutation, variables);
    const response = await fetch(request);
    const body = await response.json();
    return body.data.updateTask;
};

exports.handler = async (event, makeNewRequestTest) => {
    if (makeNewRequestTest && process.env.NODE_ENV === "test") {
        console.log("TESTING");
        makeNewRequest = makeNewRequestTest;
    }
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const tasks = await Promise.all(
        ["COMPLETED", "REJECTED", "ABANDONED", "CANCELLED"].map((status) =>
            getUnArchivedTasksByStatus(status)
        )
    );
    const tasksFlattened = tasks.flat();
    // TODO: make this one week once we aren't reliant
    // on two weeks of data for CSV exports
    const oneWeekAgo = moment.utc().subtract(14, "days").toISOString();
    const filtered = tasksFlattened.filter(
        (task) => task.createdAt && task.createdAt < oneWeekAgo
    );
    await Promise.all(
        filtered.map(async (task) => {
            try {
                console.log("Updating task: ", task);
                const {
                    establishmentLocation,
                    pickUpLocation,
                    dropOffLocation,
                } = task;

                if (
                    establishmentLocation &&
                    establishmentLocation.listed === 0
                ) {
                    updateLocation(establishmentLocation);
                    console.log(
                        "Archived establishment location",
                        establishmentLocation.id
                    );
                }
                if (pickUpLocation && pickUpLocation.listed === 0) {
                    updateLocation(pickUpLocation);
                    console.log("Archived pick up location", pickUpLocation.id);
                }
                if (dropOffLocation && dropOffLocation.listed === 0) {
                    updateLocation(dropOffLocation);
                    console.log(
                        "Archived drop off location",
                        dropOffLocation.id
                    );
                }

                const assignees = await getTaskAssignees(task);
                console.log("Found assignees: ", assignees);
                const updateAssigneesResult = await Promise.all(
                    assignees.map((assignment) =>
                        updateTaskAssignees(assignment)
                    )
                );
                console.log("updateAssigneesResult", updateAssigneesResult);

                if (updateAssigneesResult.some((a) => a.archived !== 1)) {
                    throw new Error("Failed to archive task assignees");
                }
                const deliverables = await getDeliverables(task);
                console.log("Found deliverables: ", deliverables);
                const updateDeliverablesResult = await Promise.all(
                    deliverables.map((deliverable) =>
                        updateDeliverable(deliverable)
                    )
                );
                console.log(
                    "updateDeliverablesResult",
                    updateDeliverablesResult
                );
                if (updateDeliverablesResult.some((a) => a.archived !== 1)) {
                    throw new Error("Failed to archive task deliverables");
                }
                const comments = await getComments(task);
                console.log("Found comments: ", comments);
                const updateCommentsResult = await Promise.all(
                    comments.map((comment) => updateComment(comment))
                );
                console.log("updateCommentsResult", updateCommentsResult);
                if (updateCommentsResult.some((a) => a.archived !== 1)) {
                    throw new Error("Failed to archive task comments");
                }
                const updateTaskResult = await updateTask(task);
                console.log("updateTaskResult", updateTaskResult);
            } catch (e) {
                console.log(
                    "Task archive process failed and has not been archived for: ",
                    task
                );
                console.error("Error: ", e);
            }
        })
    );
    return filtered;
};
