/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	PLATELET_ARCHIVE_DAYS
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { updateLocation } = require("/opt/graphql/mutations");
const _ = require("lodash");

const { locationsByArchivedStatus } = require("/opt/graphql/queries");

const { request, errorCheck } = require("/opt/appSyncRequest");

const GRAPHQL_ENDPOINT = process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT;
const DAYS_OLD = process.env.PLATELET_ARCHIVE_DAYS;

const getUnArchivedTasksByStatus = async () => {
    const items = [];
    let nextToken = null;

    do {
        const variables = {
            archived: 1,
            nextToken,
        };
        const response = await request(
            { query: locationsByArchivedStatus, variables },
            GRAPHQL_ENDPOINT
        );
        const body = await response.json();
        errorCheck(body);
        if (body?.data?.locationsByArchivedStatus?.items) {
            items.push(...body.data.locationsByArchivedStatus?.items);
            nextToken = body.data.locationsByArchivedStatus?.nextToken;
        } else {
            nextToken = null;
        }
    } while (nextToken);

    return items.flat();
};

const stripLocation = async (location) => {
    const variables = {
        input: {
            id: location.id,
            line1: null,
            line2: null,
            line3: null,
            contact: null,
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

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const locations = await getUnArchivedTasksByStatus();
    console.log(`Found ${locations.length} locations`);
    const now = new Date();
    const cutoff = new Date(now.setDate(now.getDate() - DAYS_OLD));
    console.log(`CUTOFF: ${cutoff}`);
    const filtered = locations.filter(
        (location) => new Date(location.createdAt) < cutoff
    );
    console.log(`ARCHIVED LOCATIONS: ${JSON.stringify(filtered)}`);
    const chunked = _.chunk(filtered, 10);
    console.log("Chunked into: ", chunked.length, " chunks");
    const results = [];
    for (const chunk of chunked) {
        await Promise.all(
            chunk.map(async (location) => {
                const result = await stripLocation(location);
                results.push(result);
            })
        );
    }
    console.log("RESULTS: ", results);
    return results;
};
