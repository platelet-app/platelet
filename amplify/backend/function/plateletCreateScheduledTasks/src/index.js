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

const GRAPHQL_ENDPOINT = process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT;

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
                priority
                disabled
            }
            nextToken
            startedAt
        }
    }
`;

const createTask = /* GraphQL */ `
    mutation CreateTask(
        $input: CreateTaskInput!
        $condition: ModelTaskConditionInput
    ) {
        createTask(input: $input, condition: $condition) {
            id
        }
    }
`;

const createLocation = /* GraphQL */ `
    mutation CreateLocation(
        $input: CreateLocationInput!
        $condition: ModelLocationConditionInput
    ) {
        createLocation(input: $input, condition: $condition) {
            id
        }
    }
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
const getScheduledTasks = async () => {
    const items = [];
    let nextToken = null;
    do {
        const variables = {
            nextToken,
        };
        const request = await makeNewRequest(listScheduledTasks, variables);
        const response = await fetch(request);
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
    const request = await makeNewRequest(createLocation, variables);
    const response = await fetch(request);
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
    const request = await makeNewRequest(createTask, variables);
    const response = await fetch(request);
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
