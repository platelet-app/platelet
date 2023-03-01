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
const GRAPHQL_API_KEY = process.env.API_PLATELET_GRAPHQLAPIKEYOUTPUT;

const query = /* GraphQL */ `
    query LIST_TASKS_BY_ARCHIVE_STATUS(
        $archived: Int!
        $status: ModelStringKeyConditionInput
    ) {
        tasksByArchivedStatus(archived: $archived, status: $status) {
            items {
                id
                createdAt
                _version
            }
            nextToken
        }
    }
`;

const updateTaskMutation = /* GraphQL */ `
    mutation UpdateTask($input: UpdateTaskInput!) {
        updateTask(input: $input) {
            id
            createdAt
        }
    }
`;

const getUnArchivedTasksByStatus = async (status) => {
    const variables = {
        archived: 0,
        status: { eq: status },
    };

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
    const request = new Request(endpoint, signed);

    const response = await fetch(request);
    const body = await response.json();
    if (body.data.tasksByArchivedStatus) {
        return body.data.tasksByArchivedStatus.items;
    } else {
        return [];
    }
};

const updateTask = async (task) => {
    const endpoint = new URL(GRAPHQL_ENDPOINT);
    const variables = {
        input: {
            id: task.id,
            archived: 1,
            _version: task._version,
        },
    };

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
            query: updateTaskMutation,
            variables,
        }),
        path: endpoint.pathname,
    });

    const signed = await signer.sign(requestToBeSigned);
    const request = new Request(endpoint, signed);

    const response = await fetch(request);
    const body = await response.json();
    console.log(`BODY: ${JSON.stringify(body)}`);
    return {
        body: JSON.stringify(body),
    };
};

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const tasks = await Promise.all(
        ["COMPLETED", "REJECTED", "ABANDONED", "CANCELLED"].map((status) =>
            getUnArchivedTasksByStatus(status)
        )
    );
    const tasksFlattened = tasks.flat();
    console.log(tasksFlattened);
    await Promise.all(
        tasksFlattened.map(async (task) => {
            await updateTask(task);
        })
    );
    return JSON.stringify(tasksFlattened);
};
