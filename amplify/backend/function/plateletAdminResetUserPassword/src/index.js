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
const { getUser } = require("/opt/graphql/queries");
const { sendWelcomeEmail } = require("/opt/sendWelcomeEmail");
const aws = require("aws-sdk");

const GRAPHQL_ENDPOINT = process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT;

const CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
const cognitoClient = new CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
});

const cognitoSetUserPassword = async (username, password) => {
    const userPoolId = process.env.AUTH_PLATELET61A0AC07_USERPOOLID;
    const params = {
        Password: password,
        Permanent: false,
        Username: username,
        UserPoolId: userPoolId,
    };
    return await cognitoClient.adminSetUserPassword(params).promise();
};

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

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const { userId } = event.arguments;
    const user = await getUserDetails(userId);
    const password = Math.random().toString(36).substr(2, 8);
    await cognitoSetUserPassword(user.username, password);
    await sendWelcomeEmail(user.contact.emailAddress, user.name, password);
};
