/* Amplify Params - DO NOT EDIT
	API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	API_PLATELET_RIDERRESPONSIBILITYTABLE_ARN
	API_PLATELET_RIDERRESPONSIBILITYTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */ /* Amplify Params - DO NOT EDIT API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { request, errorCheck } = require("/opt/appSyncRequest");

const {
    deleteRiderResponsibility,
    deletePossibleRiderResponsibilities,
} = require("/opt/graphql/mutations");

const { listPossibleRiderResponsibilities } = require("/opt/graphql/queries");

const GRAPHQL_ENDPOINT = process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT;

const getRiderResponsibility = /* GraphQL */ `
    query GetRiderResponsibility($id: ID!) {
        getRiderResponsibility(id: $id) {
            id
            _version
            _deleted
        }
    }
`;

const deleteRiderResp = async (id) => {
    const variables = { id };
    const currentRiderResponsibility = await request(
        {
            query: getRiderResponsibility,
            variables,
        },
        GRAPHQL_ENDPOINT
    );
    const currentRiderResponsibilityData =
        await currentRiderResponsibility.json();
    errorCheck(currentRiderResponsibilityData);
    const { _version } =
        currentRiderResponsibilityData.data.getRiderResponsibility;
    const inputVars = {
        input: { id, _version },
    };
    const response = await request(
        {
            query: deleteRiderResponsibility,
            variables: inputVars,
        },
        GRAPHQL_ENDPOINT
    );
    const data = await response.json();
    errorCheck(data);
    console.log("Deleted rider responsibility:", data);
    return data.data.deleteRiderResponsibility;
};

const deleteResps = async (items) => {
    console.log(items);
    const filtered = items.filter((i) => !i._deleted);
    console.log(filtered);
    const result = await Promise.all(
        filtered.map(async (i) => {
            const { id, _version } = i;
            const variables = { input: { id, _version } };
            const response = await request(
                {
                    query: deletePossibleRiderResponsibilities,
                    variables,
                },
                GRAPHQL_ENDPOINT
            );
            return await response.json();
        })
    );
    for (const i of result) {
        errorCheck(i);
    }
    console.log(
        "Deleted possible rider responsibilities:",
        JSON.stringify(result)
    );
};

const getPossibleRiderResponsibilities = async (id) => {
    const items = [];
    let nextToken = null;
    do {
        console.log("Getting data...");
        const variables = {
            nextToken,
            filter: {
                _deleted: { ne: true },
                riderResponsibilityPossibleUsersId: { eq: id },
            },
        };
        const response = await request(
            { query: listPossibleRiderResponsibilities, variables },
            GRAPHQL_ENDPOINT
        );
        const body = await response.json();
        console.log(JSON.stringify(body));
        errorCheck(body);
        if (body?.data?.listPossibleRiderResponsibilities) {
            items.push(body?.data?.listPossibleRiderResponsibilities?.items);
            nextToken =
                body?.data?.listPossibleRiderResponsibilities?.nextToken;
        } else {
            nextToken = null;
        }
    } while (nextToken);
    console.log(JSON.stringify(items));
    return items.flat();
};

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const { riderResponsibilityId } = event.arguments;

    const possibleRiderResponsibilities =
        await getPossibleRiderResponsibilities(riderResponsibilityId);
    console.log(
        "possible rider responsibilities:",
        possibleRiderResponsibilities
    );
    await deleteResps(possibleRiderResponsibilities);
    return deleteRiderResp(riderResponsibilityId);
};
