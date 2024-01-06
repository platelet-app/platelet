/* Amplify Params - DO NOT EDIT
	API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const moment = require("moment");
const _ = require("lodash");
const {
    updateTask,
    updateDeliverable,
    updateLocation,
    updateComment,
    updateTaskAssignee,
} = require("/opt/graphql/mutations");
const { request, errorCheck } = require("/opt/appSyncRequest");

const GRAPHQL_ENDPOINT = process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT;
const DAYS_TO_ARCHIVE = 4;

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

const getTaskAssignees = async (task) => {
    const items = [];
    let nextToken = null;
    do {
        const variables = {
            id: task.id,
            nextToken,
        };
        const response = await request(
            { query: getTaskAssigneesQuery, variables },
            GRAPHQL_ENDPOINT
        );
        const body = await response.json();
        errorCheck(body);
        if (body?.data?.getTask?.assignees) {
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
        const response = await request(
            { query: getTaskDeliverablesQuery, variables },
            GRAPHQL_ENDPOINT
        );
        const body = await response.json();
        errorCheck(body);
        if (body?.data?.getTask?.deliverables) {
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
        const response = await request(
            { query: getTaskCommentsQuery, variables },
            GRAPHQL_ENDPOINT
        );
        const body = await response.json();
        errorCheck(body);
        if (body?.data?.getTask?.comments) {
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
        const response = await request({ query, variables }, GRAPHQL_ENDPOINT);
        const body = await response.json();
        errorCheck(body);
        if (body?.data?.tasksByArchivedStatus) {
            items.push(...body.data.tasksByArchivedStatus.items);
            nextToken = body.data.tasksByArchivedStatus.nextToken;
        } else {
            nextToken = null;
        }
    } while (nextToken);

    return items.flat();
};

const updateTaskAssigneeItem = async (assignment) => {
    const variables = {
        input: {
            id: assignment.id,
            archived: 1,
            _version: assignment._version,
        },
    };
    const response = await request(
        { query: updateTaskAssignee, variables },
        GRAPHQL_ENDPOINT
    );
    const body = await response.json();
    errorCheck(body);
    return body.data.updateTaskAssignee;
};

const updateDeliverableItem = async (deliverable) => {
    const variables = {
        input: {
            id: deliverable.id,
            archived: 1,
            _version: deliverable._version,
        },
    };
    const response = await request(
        { query: updateDeliverable, variables },
        GRAPHQL_ENDPOINT
    );
    const body = await response.json();
    errorCheck(body);
    return body.data.updateDeliverable;
};

const updateCommentItem = async (comment) => {
    const variables = {
        input: {
            id: comment.id,
            archived: 1,
            _version: comment._version,
        },
    };
    const response = await request(
        { query: updateComment, variables },
        GRAPHQL_ENDPOINT
    );
    const body = await response.json();
    errorCheck(body);
    return body.data.updateComment;
};

const updateLocationItem = async (location) => {
    const variables = {
        input: {
            id: location.id,
            archived: 1,
            _version: location._version,
        },
    };
    const response = await request(
        { query: updateLocation, variables },
        GRAPHQL_ENDPOINT
    );
    const body = await response.json();
    errorCheck(body);
    return body.data.updateLocation;
};

const updateTaskItem = async (task) => {
    const variables = {
        input: {
            id: task.id,
            archived: 1,
            _version: task._version,
        },
    };
    const response = await request(
        { query: updateTask, variables },
        GRAPHQL_ENDPOINT
    );
    const body = await response.json();
    errorCheck(body);
    return body.data.updateTask;
};

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const tasks = await Promise.all(
        ["COMPLETED", "REJECTED", "ABANDONED", "CANCELLED"].map((status) =>
            getUnArchivedTasksByStatus(status)
        )
    );
    const tasksFlattened = tasks.flat();
    const daysAgo = moment
        .utc()
        .subtract(DAYS_TO_ARCHIVE, "days")
        .toISOString();
    const filtered = tasksFlattened.filter(
        (task) => task.createdAt && task.createdAt < daysAgo
    );
    // split into 10 item lists
    const chunked = _.chunk(filtered, 10);
    console.log("Chunked into: ", chunked.length, " chunks");
    const results = [];
    for (const chunk of chunked) {
        await Promise.all(
            chunk.map(async (task) => {
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
                        updateLocationItem(establishmentLocation);
                        console.log(
                            "Archived establishment location",
                            establishmentLocation.id
                        );
                    }
                    if (pickUpLocation && pickUpLocation.listed === 0) {
                        updateLocationItem(pickUpLocation);
                        console.log(
                            "Archived pick up location",
                            pickUpLocation.id
                        );
                    }
                    if (dropOffLocation && dropOffLocation.listed === 0) {
                        updateLocationItem(dropOffLocation);
                        console.log(
                            "Archived drop off location",
                            dropOffLocation.id
                        );
                    }

                    const assignees = await getTaskAssignees(task);
                    console.log("Found assignees: ", assignees);
                    const updateAssigneesResult = await Promise.all(
                        assignees.map((assignment) =>
                            updateTaskAssigneeItem(assignment)
                        )
                    );
                    console.log("updateAssigneesResult", updateAssigneesResult);

                    if (updateAssigneesResult.some((a) => a?.archived !== 1)) {
                        throw new Error("Failed to archive task assignees");
                    }
                    const deliverables = await getDeliverables(task);
                    console.log("Found deliverables: ", deliverables);
                    const updateDeliverablesResult = await Promise.all(
                        deliverables.map((deliverable) =>
                            updateDeliverableItem(deliverable)
                        )
                    );
                    console.log(
                        "updateDeliverablesResult",
                        updateDeliverablesResult
                    );
                    if (
                        updateDeliverablesResult.some((a) => a.archived !== 1)
                    ) {
                        throw new Error("Failed to archive task deliverables");
                    }
                    const comments = await getComments(task);
                    console.log("Found comments: ", comments);
                    const updateCommentsResult = await Promise.all(
                        comments.map((comment) => updateCommentItem(comment))
                    );
                    console.log("updateCommentsResult", updateCommentsResult);
                    if (updateCommentsResult.some((a) => a.archived !== 1)) {
                        throw new Error("Failed to archive task comments");
                    }
                    const updateTaskResult = await updateTaskItem(task);
                    console.log("updateTaskResult", updateTaskResult);
                    if (updateTaskResult.archived !== 1) {
                        throw new Error("Failed to archive task");
                    }

                    results.push(updateTaskResult);
                } catch (e) {
                    console.log(
                        "Task archive process failed and has not been archived for: ",
                        task
                    );
                    console.error("Error: ", e);
                }
            })
        );
    }
    return results;
};
