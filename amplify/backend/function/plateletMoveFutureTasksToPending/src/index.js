/* Amplify Params - DO NOT EDIT
	API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const { request, errorCheck } = require("/opt/appSyncRequest");
const { updateTask } = require("/opt/graphql/mutations");
const _ = require("lodash");

const GRAPHQL_ENDPOINT = process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT;

const query = /* GraphQL */ `
    query LIST_TASKS_BY_STATUS($status: TaskStatus!, $nextToken: String) {
        tasksByStatus(status: $status, nextToken: $nextToken) {
            items {
                id
                status
                pickUpSchedule {
                    timePrimary
                }
                dropOffSchedule {
                    timePrimary
                }
                _version
            }
            nextToken
        }
    }
`;

const getFutureTasks = async () => {
    const items = [];
    let nextToken = null;

    do {
        const variables = {
            status: "FUTURE",
            nextToken,
        };
        const response = await request({ query, variables }, GRAPHQL_ENDPOINT);
        const body = await response.json();
        errorCheck(body);
        if (body?.data?.tasksByStatus) {
            items.push(...body.data.tasksByStatus.items);
            nextToken = body.data.tasksByStatus.nextToken;
        } else {
            nextToken = null;
        }
    } while (nextToken);

    return items.flat();
};

const processTask = async (task) => {
    if (task && task.pickUpSchedule) {
        if (task.pickUpSchedule.timePrimary) {
            const pickUpTime = new Date(task.pickUpSchedule.timePrimary);
            const now = new Date();
            now.setDate(now.getDate() + 1);
            if (pickUpTime < now) {
                console.log(
                    "Task is due to be picked up within 24 hours, moving to PENDING",
                    task?.id
                );
                const variables = {
                    input: {
                        id: task.id,
                        status: "PENDING",
                        _version: task._version,
                    },
                };
                const response = await request(
                    {
                        query: updateTask,
                        variables,
                    },
                    GRAPHQL_ENDPOINT
                );
                const body = await response.json();
                errorCheck(body);
                console.log("Response:", body);
            }
        }
    } else if (task && task.dropOffSchedule) {
        if (task && task.dropOffSchedule) {
            if (task.dropOffSchedule.timePrimary) {
                const dropOffTime = new Date(task.dropOffSchedule.timePrimary);
                const now = new Date();
                now.setDate(now.getDate() + 1);
                if (dropOffTime < now) {
                    console.log(
                        "Task is due to be dropped off within 24 hours, moving to PENDING",
                        task?.id
                    );
                    const variables = {
                        input: {
                            id: task.id,
                            status: "PENDING",
                            _version: task._version,
                        },
                    };
                    const response = await request(
                        {
                            query: updateTask,
                            variables,
                        },
                        GRAPHQL_ENDPOINT
                    );
                    const body = await response.json();
                    errorCheck(body);
                    console.log("Response:", body);
                }
            }
        }
    }
};

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const futureTasks = await getFutureTasks();
    const chunked = _.chunk(futureTasks, 10);
    for (const chunk of chunked) {
        await Promise.all(chunk.map((task) => processTask(task)));
    }
};
