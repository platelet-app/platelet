/* Amplify Params - DO NOT EDIT
	API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { request } = require("/opt/appSyncRequest");
const {
    createTask,
    createLocation,
    createDeliverable,
} = require("/opt/graphql/mutations");

const listScheduledTasks = /* GraphQL */ `
    query ListScheduledTasks(
        $filter: ModelScheduledTaskFilterInput
        $limit: Int
        $nextToken: String
    ) {
        listScheduledTasks(
            filter: $filter
            limit: $limit
            nextToken: $nextToken
        ) {
            items {
                id
                tenantId
                cronExpression
                pickUpLocation {
                    id
                    listed
                    tenantId
                }
                dropOffLocation {
                    id
                    listed
                    tenantId
                }
                establishmentLocation {
                    id
                    listed
                    tenantId
                }
                deliverables {
                    items {
                        count
                        deliverableTypeDeliverablesId
                        unit
                    }
                }
                priority
                disabled
            }
            nextToken
            startedAt
        }
    }
`;

const GRAPHQL_ENDPOINT = process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT;

const getScheduledTasks = async () => {
    const items = [];
    let nextToken = null;
    do {
        const variables = {
            nextToken,
        };
        const response = await request(
            { query: listScheduledTasks, variables },
            GRAPHQL_ENDPOINT
        );
        const body = await response.json();
        if (body.data.listScheduledTasks) {
            items.push(...body.data.listScheduledTasks.items);
            nextToken = body.data.listScheduledTasks.nextToken;
        } else {
            nextToken = null;
        }
    } while (nextToken);
    return items.flat();
};

const createUnlistedLocation = async (location) => {
    const variables = {
        input: {
            contact: location.contact,
            ward: location.ward,
            line1: location.line1,
            line2: location.line2,
            line3: location.line3,
            town: location.town,
            county: location.county,
            state: location.state,
            country: location.country,
            postcode: location.postcode,
            what3words: location.what3words,
            tenantId: location.tenantId,
            listed: 0,
            archived: 0,
        },
    };
    const response = await request(
        { query: createLocation, variables },
        GRAPHQL_ENDPOINT
    );
    const body = await response.json();
    console.log("Created unlisted location", body.data.createLocation);
    return body.data.createLocation.id;
};

const createNewTask = async (scheduledTask) => {
    const {
        priority,
        pickUpLocation,
        dropOffLocation,
        establishmentLocation,
        deliverables,
        tenantId,
    } = scheduledTask;
    let pickUpLocationId = null;
    let dropOffLocationId = null;
    let establishmentLocationId = null;
    if (pickUpLocation?.listed === 1) {
        pickUpLocationId = pickUpLocation.id;
    } else if (pickUpLocation) {
        pickUpLocationId = await createUnlistedLocation(pickUpLocation);
    }
    if (dropOffLocation?.listed === 1) {
        dropOffLocationId = dropOffLocation.id;
    } else if (dropOffLocation) {
        dropOffLocationId = await createUnlistedLocation(dropOffLocation);
    }
    if (establishmentLocation?.listed === 1) {
        establishmentLocationId = establishmentLocation.id;
    } else if (establishmentLocation) {
        establishmentLocationId = await createUnlistedLocation(
            establishmentLocation
        );
    }

    const currentDate = new Date();
    const dateCreated = currentDate.toISOString().split("T")[0];
    const variables = {
        input: {
            priority,
            tenantId,
            pickUpLocationId,
            dropOffLocationId,
            establishmentLocationId,
            dateCreated,
            status: "NEW",
            archived: 0,
        },
    };
    const response = await request(
        { query: createTask, variables },
        GRAPHQL_ENDPOINT
    );
    const body = await response.json();
    const taskId = body.data.createTask.id;

    const deliverableItems = deliverables.items;
    if (deliverableItems.length > 0) {
        await Promise.all(
            deliverableItems.map(async (deliverable) => {
                const variables = {
                    input: {
                        taskDeliverablesId: taskId,
                        tenantId,
                        count: deliverable.count,
                        deliverableTypeDeliverablesId:
                            deliverable.deliverableTypeDeliverablesId,
                        archived: 0,
                        unit: deliverable.unit,
                    },
                };
                const deliverableResult = await request(
                    { query: createDeliverable, variables },
                    GRAPHQL_ENDPOINT
                );
                const body = await deliverableResult.json();
                console.log("Created deliverable", body.data.createDeliverable);
            })
        );
    }
    console.log("Created task", body.data.createTask);
    return body.data.createTask;
};

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const scheduledTasks = await getScheduledTasks();
    const filtered = scheduledTasks.filter(
        (scheduledTask) => scheduledTask.disabled !== 1
    );
    console.log(`SCHEDULED TASKS: ${JSON.stringify(filtered)}`);
    const tasks = await Promise.all(
        filtered.map((scheduledTask) => createNewTask(scheduledTask))
    );
    console.log(`TASKS: ${JSON.stringify(tasks)}`);
    return tasks;
};
