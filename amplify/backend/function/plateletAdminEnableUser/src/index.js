/* Amplify Params - DO NOT EDIT
	API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	AUTH_PLATELET61A0AC07_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { request, errorCheck } = require("/opt/appSyncRequest");
const { updateUser } = require("/opt/graphql/mutations");
const { getUser } = require("/opt/graphql/queries");
const aws = require("aws-sdk");

const GRAPHQL_ENDPOINT = process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT;

const CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
const cognitoClient = new CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
});

const getUserDetails = async (userId) => {
    const variables = { id: userId };
    const response = await request(
        { query: getUser, variables },
        GRAPHQL_ENDPOINT
    );
    const data = await response.json();
    errorCheck(data);
    return data.data.getUser;
};

const enableUserAppSync = async (user) => {
    const { id, _version } = user;
    const variables = { input: { id, _version, disabled: 0 } };
    const response = await request(
        { query: updateUser, variables },
        GRAPHQL_ENDPOINT
    );
    const data = await response.json();
    errorCheck(data);
    return data.data.updateUser;
};

const enableUserCognito = async (username) => {
    const params = {
        UserPoolId: process.env.AUTH_PLATELET61A0AC07_USERPOOLID,
        Username: username,
    };
    const response = await cognitoClient.adminEnableUser(params).promise();
    return response;
};

const cleanUpCogito = async (username) => {
    const params = {
        UserPoolId: process.env.AUTH_PLATELET61A0AC07_USERPOOLID,
        Username: username,
    };
    const response = await cognitoClient.adminDisableUser(params).promise();
    return response;
};

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const { userId } = event.arguments;
    const user = await getUserDetails(userId);
    if (user.disabled === 0) {
        throw new Error("User is already enabled");
    }
    const { username } = user;
    const cognitoResponse = await enableUserCognito(username);
    try {
        const appSyncResponse = await enableUserAppSync(user);
        console.log(`COGNITO RESPONSE: ${JSON.stringify(cognitoResponse)}`);
        console.log(`APPSYNC RESPONSE: ${JSON.stringify(appSyncResponse)}`);
        return appSyncResponse;
    } catch (error) {
        await cleanUpCogito(username);
        throw error;
    }
};
