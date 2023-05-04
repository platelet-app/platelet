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
const { createTask, createLocation } = require("/opt/graphql/mutations");
const { scheduledTasksByDisabledStatus } = require("/opt/graphql/queries");

const GRAPHQL_ENDPOINT = process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT;

const getScheduledTasks = async () => {
    const items = [];
    let nextToken = null;
    do {
        const variables = {
            nextToken,
            disabled: 0,
        };
        const response = await request(
            { query: scheduledTasksByDisabledStatus, variables },
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
        },
    };
    const response = await request(
        { query: createLocation, variables },
        GRAPHQL_ENDPOINT
    );
    const body = await response.json();
    return body.data.createLocation.id;
};

const createNewTask = async (scheduledTask) => {
    const {
        priority,
        pickUpLocation,
        dropOffLocation,
        establishmentLocation,
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
    console.log(`BODY: ${JSON.stringify(body)}`);
    return body.data.createTask.id;
};

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const scheduledTasks = await getScheduledTasks();
    console.log(`SCHEDULED TASKS: ${JSON.stringify(scheduledTasks)}`);
    const tasks = await Promise.all(
        scheduledTasks.map((scheduledTask) => createNewTask(scheduledTask))
    );
    console.log(`TASKS: ${JSON.stringify(tasks)}`);
};
