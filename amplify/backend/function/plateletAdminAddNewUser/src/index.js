/* Amplify Params - DO NOT EDIT
	API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	AUTH_PLATELET61A0AC07_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

require("isomorphic-fetch");
const aws = require("aws-sdk");
const AWS = require("aws-sdk/global");
const AUTH_TYPE = require("aws-appsync").AUTH_TYPE;
const AWSAppSyncClient = require("aws-appsync").default;
const uuid = require("uuid");
const createUser = require("./createUser").createUser;
const listUsers = require("./listUsers").listUsers;

async function inviteNewUserToTeam(newUser, tenantId) {
    const config = {
        url: process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT,
        region: process.env.REGION,
        auth: {
            type: AUTH_TYPE.AWS_IAM,
            credentials: AWS.config.credentials,
        },
        disableOffline: true,
    };
    const userPoolId = process.env.AUTH_PLATELET61A0AC07_USERPOOLID;

    const appSyncClient = new AWSAppSyncClient(config);
    const CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
    const cognitoClient = new CognitoIdentityServiceProvider({
        apiVersion: "2016-04-19",
    });

    const cognitoResp = await cognitoClient
        .adminCreateUser({
            DesiredDeliveryMediums: ["EMAIL"],
            ForceAliasCreation: false,
            UserAttributes: [
                {
                    Name: "email",
                    Value: newUser.email,
                },
                {
                    Name: "email_verified",
                    Value: "true",
                },
                {
                    Name: "custom:tenantId",
                    Value: tenantId,
                },
            ],
            UserPoolId: userPoolId,
            Username: uuid.v4(),
        })
        .promise();

    if (!cognitoResp.User) {
        throw new Error(
            `Failure to create new user with email ${newUser.email}`
        );
    }
    let displayName = newUser.name;
    const listUsersResp = await appSyncClient.query({
        query: listUsers,
        variables: { tenantId },
    });
    const userCheck = listUsersResp.data.listUsers.items;
    let counter = 0;
    while (true) {
        const current =
            counter === 0 ? newUser.name : `${newUser.name}-${counter}`;
        if (userCheck.map((u) => u.displayName).includes(current)) {
            counter++;
        } else {
            displayName = current;
            break;
        }
    }
    console.log(`Final display name: ${displayName}`);
    const subFind = cognitoResp.User.Attributes.find(
        (attr) => attr.Name === "sub"
    );
    if (!subFind) {
        throw new Error(`missing sub attribute for newly created user`);
    }
    const cognitoId = subFind.Value;
    if (!cognitoId) {
        throw new Error(`missing cognitoId attribute for newly created user`);
    }
    const createUserInput = {
        tenantId: tenantId,
        active: 1,
        cognitoId,
        name: newUser.name,
        displayName,
        roles:
            newUser.roles && newUser.roles.includes("USER")
                ? newUser.roles
                : ["USER"],
        contact: { emailAddress: newUser.email },
    };

    const createdUser = await appSyncClient.mutate({
        mutation: createUser,
        variables: { input: createUserInput },
    });

    return createdUser.data.createUser;
}

exports.handler = async (event) => {
    console.log("Arguments:", event.arguments);
    const tenantId = event.arguments.tenantId;
    const user = {
        name: event.arguments.name,
        email: event.arguments.email,
        roles: event.arguments.roles || ["USER"],
    };
    const result = await inviteNewUserToTeam(user, tenantId);
    console.log("User result:", result);
    const response = {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        //  headers: {
        //      "Access-Control-Allow-Origin": "*",
        //      "Access-Control-Allow-Headers": "*"
        //  },
        body: JSON.stringify({ message: "user created", id: result.id }),
    };
    return response;
};
