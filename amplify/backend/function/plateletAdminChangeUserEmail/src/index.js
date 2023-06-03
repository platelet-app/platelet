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

const changeEmailAddressCognito = async (username, emailAddress) => {
    const params = {
        UserPoolId: process.env.AUTH_PLATELET61A0AC07_USERPOOLID,
        Username: username,
        UserAttributes: [
            {
                Name: "email",
                Value: emailAddress,
            },
            {
                Name: "email_verified",
                Value: "true",
            },
        ],
    };
    const response = await cognitoClient
        .adminUpdateUserAttributes(params)
        .promise();
    return response;
};

const changeEmailAddressAppsync = async (user, emailAddress) => {
    const { id, _version } = user;
    const variables = {
        input: { id, _version, contact: { emailAddress } },
    };
    const response = await request(
        { query: updateUser, variables },
        GRAPHQL_ENDPOINT
    );
    const data = await response.json();
    errorCheck(data);
    return data.data.updateUser;
};

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const { userId, emailAddress } = event.arguments;
    const user = await getUserDetails(userId);
    const originalEmailAddress = user.contact.emailAddress;
    const { username } = user;
    const cognitoResponse = await changeEmailAddressCognito(
        username,
        emailAddress
    );
    console.log(`COGNITO RESPONSE: ${JSON.stringify(cognitoResponse)}`);
    try {
        const appsyncResponse = await changeEmailAddressAppsync(
            user,
            emailAddress
        );
        console.log(`APPSYNC RESPONSE: ${JSON.stringify(appsyncResponse)}`);
        return appsyncResponse;
    } catch (error) {
        await changeEmailAddressCognito(username, originalEmailAddress);
        throw error;
    }
};
