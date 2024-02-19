/* Amplify Params - DO NOT EDIT
	API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	AUTH_PLATELET61A0AC07_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const aws = require("aws-sdk");
const uuid = require("uuid");

const { createUser, deleteUser } = require("/opt/graphql/mutations");
const { listUsers } = require("/opt/graphql/queries");
const { request, errorCheck } = require("/opt/appSyncRequest");
const { sendWelcomeEmail } = require("/opt/sendWelcomeEmail");

const GRAPHQL_ENDPOINT = process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT;

const getAllUsers = async (tenantId) => {
    const items = [];
    let nextToken = null;
    do {
        const variables = {
            nextToken,
            filter: { tenantId: { eq: tenantId } },
        };
        const response = await request(
            { query: listUsers, variables },
            GRAPHQL_ENDPOINT
        );
        const body = await response.json();
        if (body.data.listUsers) {
            items.push(...body.data.listUsers.items);
            nextToken = body.data.listUsers.nextToken;
        } else {
            nextToken = null;
        }
    } while (nextToken);
    return items.flat();
};

async function addNewUser(newUser, tenantId, cognitoId) {
    let displayName = newUser.name;
    const userCheck = await getAllUsers(tenantId);
    let counter = 0;
    while (true) {
        const current =
            counter === 0 ? newUser.name : `${newUser.name}-${counter}`;
        if (userCheck.map((u) => u.displayName).includes(current)) {
            if (counter > 100) {
                throw new Error(
                    "Unable to generate unique display name for new user. Limit reached."
                );
            }
            counter++;
        } else {
            displayName = current;
            break;
        }
    }
    console.log(`Final display name: ${displayName}`);
    const createUserInput = {
        tenantId: tenantId,
        cognitoId,
        name: newUser.name,
        disabled: 0,
        username: newUser.username,
        displayName,
        roles:
            newUser.roles && newUser.roles.includes("USER")
                ? newUser.roles
                : ["USER"],
        contact: { emailAddress: newUser.email },
    };

    console.log(`Creating user ${createUserInput.username}`);

    const createdUserResponse = await request(
        {
            query: createUser,
            variables: { input: createUserInput },
        },
        GRAPHQL_ENDPOINT
    );
    const result = await createdUserResponse.json();
    errorCheck(result);
    return result.data.createUser;
}

async function createNewCognitoUser(newUser, tenantId) {
    const userPoolId = process.env.AUTH_PLATELET61A0AC07_USERPOOLID;
    const CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
    const cognitoClient = new CognitoIdentityServiceProvider({
        apiVersion: "2016-04-19",
    });

    const generatedPassword = Math.random().toString(36).substr(2, 8);

    const cognitoResp = await cognitoClient
        .adminCreateUser({
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
            ],
            TemporaryPassword: generatedPassword,
            UserPoolId: userPoolId,
            Username: newUser.username,
            MessageAction: "SUPPRESS",
        })
        .promise();

    try {
        const roles =
            newUser.roles && newUser.roles.includes("USER")
                ? newUser.roles
                : ["USER"];

        for (const role of roles) {
            await cognitoClient
                .adminAddUserToGroup({
                    GroupName: role,
                    UserPoolId: userPoolId,
                    Username: newUser.username,
                })
                .promise();
        }

        if (!cognitoResp.User) {
            throw new Error(
                `Failure to create new user with email ${newUser.email}`
            );
        }
        const subFind = cognitoResp.User.Attributes.find(
            (attr) => attr.Name === "sub"
        );
        if (!subFind) {
            throw new Error(`missing sub attribute for newly created user`);
        }
        const cognitoId = subFind.Value;
        if (!cognitoId) {
            throw new Error(
                `missing cognitoId attribute for newly created user`
            );
        }
        return {
            response: cognitoResp,
            cognitoId,
            password: generatedPassword,
        };
    } catch (e) {
        console.log(`Error adding user to group:`, e);
        await cleanUpCognito(newUser.username);
        throw e;
    }
}

async function cleanUpCognito(username) {
    if (username) {
        console.log(`Cleaning up from cognito`);
        const CognitoIdentityServiceProvider =
            aws.CognitoIdentityServiceProvider;
        const cognitoClient = new CognitoIdentityServiceProvider({
            apiVersion: "2016-04-19",
        });
        await cognitoClient
            .adminDisableUser({
                UserPoolId: process.env.AUTH_PLATELET61A0AC07_USERPOOLID,
                Username: username,
            })
            .promise();
        return cognitoClient
            .adminDeleteUser({
                UserPoolId: process.env.AUTH_PLATELET61A0AC07_USERPOOLID,
                Username: username,
            })
            .promise();
    }
}

async function cleanUpGraphQL(user) {
    if (user) {
        console.log(`Cleaning up user`, user);
        return await request(
            {
                query: deleteUser,
                variables: {
                    input: {
                        id: user.id,
                        _version: user._version || 1,
                    },
                },
            },
            GRAPHQL_ENDPOINT
        );
    }
}

exports.handler = async (event) => {
    console.log("Arguments:", event.arguments);
    const tenantId = event.arguments.tenantId;
    const user = {
        name: event.arguments.name,
        username: event.arguments.username || uuid.v4(),
        email: event.arguments.email,
        roles: event.arguments.roles || ["USER"],
    };
    let newUser;
    let password;
    let cognitoId;
    const newCognitoUser = await createNewCognitoUser(user, tenantId);
    password = newCognitoUser.password;
    cognitoId = newCognitoUser.cognitoId;
    try {
        newUser = await addNewUser(user, tenantId, cognitoId);
        console.log("User result:", newUser);
        await sendWelcomeEmail(
            event.arguments.email,
            event.arguments.name,
            password
        );
    } catch (e) {
        await cleanUpCognito(user.username);
        await cleanUpGraphQL(newUser);
        throw e;
    }
    console.log("Successfully sent welcome email");
    return newUser;
};
