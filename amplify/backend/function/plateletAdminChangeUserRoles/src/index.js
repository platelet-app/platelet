/* Amplify Params - DO NOT EDIT
	API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	AUTH_PLATELET61A0AC07_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const aws = require("aws-sdk");

const { request, errorCheck } = require("/opt/appSyncRequest");
const { updateUser } = require("/opt/graphql/mutations");
const { getUser } = require("/opt/graphql/queries");
const _ = require("lodash");

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const userPoolId = process.env.AUTH_PLATELET61A0AC07_USERPOOLID;
const GRAPHQL_ENDPOINT = process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT;

const CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
const cognitoClient = new CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
});

async function appSyncAmendRoles(userId, roles) {
    // get version and pass it in too
    const currentUserResponse = await request(
        {
            query: getUser,
            variables: {
                id: userId,
            },
        },
        GRAPHQL_ENDPOINT
    );
    const currentUser = await currentUserResponse.json();
    errorCheck(currentUser);
    console.log("Updating user:", currentUser.data.getUser);
    const updateUserInput = {
        id: userId,
        _version: currentUser.data.getUser._version,
        roles: [],
    };
    const resultClearedResponse = await request(
        {
            query: updateUser,
            variables: { input: updateUserInput },
        },
        GRAPHQL_ENDPOINT
    );
    const resultCleared = await resultClearedResponse.json();
    errorCheck(resultCleared);
    console.log("Cleared roles:", resultCleared.data.updateUser);
    const updateUserInputActual = {
        id: userId,
        _version: resultCleared.data.updateUser._version,
        roles,
    };
    const resultResponse = await request(
        {
            query: updateUser,
            variables: { input: updateUserInputActual },
        },
        GRAPHQL_ENDPOINT
    );
    const result = await resultResponse.json();
    errorCheck(result);
    if (result?.data?.updateUser?.roles) {
        if (!_.isEqual(result.data.updateUser.roles.sort(), roles.sort())) {
            throw new Error("Roles not updated correctly on the api");
        }
    }

    console.log("Updated user:", result.data.updateUser);
    return result.data.updateUser;
}

async function cognitoAmendRoles(username, roles) {
    console.log("Amending roles for:", username, roles);
    const notRoles = ["USER", "ADMIN", "COORDINATOR", "RIDER"].filter(
        (role) => !roles.includes(role)
    );
    for (const role of roles) {
        await cognitoClient
            .adminAddUserToGroup({
                GroupName: role,
                UserPoolId: userPoolId,
                Username: username,
            })
            .promise();
    }
    for (const notRole of notRoles) {
        await cognitoClient
            .adminRemoveUserFromGroup({
                GroupName: notRole,
                UserPoolId: userPoolId,
                Username: username,
            })
            .promise();
    }
    const userRolesCheck = await getCurrentUserRolesFromCognito(username);
    if (!_.isEqual(userRolesCheck.sort(), roles.sort())) {
        throw new Error("Roles not updated correctly on cognito");
    }
}
async function getCurrentUserRolesFromCognito(username) {
    const response = await cognitoClient
        .adminListGroupsForUser({ UserPoolId: userPoolId, Username: username })
        .promise();
    console.log("User roles:", response);
    return response.Groups.map((group) => group.GroupName);
}

async function getCurrentUserData(userId) {
    console.log("Getting current user roles");
    const response = await request(
        {
            query: getUser,
            variables: {
                id: userId,
            },
        },
        GRAPHQL_ENDPOINT
    );
    const body = await response.json();
    errorCheck(body);
    return body.data.getUser;
}

async function cleanUp(data) {
    await appSyncAmendRoles(data.id, data.roles);
    await cognitoAmendRoles(data.username, data.roles);
}

exports.handler = async (event) => {
    const roles = event.arguments.roles;
    const userId = event.arguments.userId;
    const currentUserData = await getCurrentUserData(userId);
    console.log("Current user data:", currentUserData);
    try {
        const user = await appSyncAmendRoles(userId, roles);
        await cognitoAmendRoles(user.username, roles);
        return user;
    } catch (e) {
        await cleanUp(currentUserData);
        throw e;
    }
};
