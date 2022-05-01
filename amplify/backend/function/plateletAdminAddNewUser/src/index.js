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
const deleteUser = require("./deleteUser").deleteUser;
const listUsers = require("./listUsers").listUsers;

async function sendWelcomeEmail(emailAddress, recipientName, password) {
    const ses = new aws.SES({
        apiVersion: "2010-12-01",
        region: process.env.REGION,
    });
    const params = {
        Destination: {
            ToAddresses: [emailAddress],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `
                    <p>
                        Welcome to https://${process.env.PLATELET_DOMAIN_NAME}, ${recipientName}!
                    </p>
                    <p>
                        An admin has created your account for you with a temporary password.
                    </p>
                    <p>
                        <b>Username:</b> ${emailAddress}
                    </p>
                    <p>
                        <b>Password:</b> ${password}
                    </p>
                    <p>
                        Thank you.
                    </p>
                    `,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: `Welcome to https://${process.env.PLATELET_DOMAIN_NAME}, ${recipientName}!
                    An admin has created your account for you. A temporary password has been generated for you.
                    Username: ${emailAddress}
                    Password: ${password}
                    Thank you.`,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Welcome to Platelet!",
            },
        },
        Source: process.env.PLATELET_WELCOME_EMAIL,
        ReplyToAddresses: [process.env.PLATELET_WELCOME_EMAIL],
        ReturnPath: process.env.PLATELET_WELCOME_EMAIL,
    };

    return await ses.sendEmail(params).promise();
}

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
                {
                    Name: "custom:tenantId",
                    Value: tenantId,
                },
            ],
            TemporaryPassword: generatedPassword,
            UserPoolId: userPoolId,
            Username: newUser.username,
            MessageAction: "SUPPRESS",
        })
        .promise();

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

    const createdUser = await appSyncClient.mutate({
        mutation: createUser,
        variables: { input: createUserInput },
    });

    return {
        newUser: createdUser.data.createUser,
        password: generatedPassword,
    };
}

async function cleanUp(user) {
    if (user) {
        console.log(`Cleaning up user`, user);
        const config = {
            url: process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT,
            region: process.env.REGION,
            auth: {
                type: AUTH_TYPE.AWS_IAM,
                credentials: AWS.config.credentials,
            },
            disableOffline: true,
        };
        const appSyncClient = new AWSAppSyncClient(config);
        await appSyncClient.mutate({
            mutation: deleteUser,
            variables: {
                input: {
                    id: user.id,
                    _version: user._version || 1,
                },
            },
        });
        console.log(`Cleaning up from cognito`);
        const CognitoIdentityServiceProvider =
            aws.CognitoIdentityServiceProvider;
        const cognitoClient = new CognitoIdentityServiceProvider({
            apiVersion: "2016-04-19",
        });
        await cognitoClient
            .adminDisableUser({
                UserPoolId: process.env.AUTH_PLATELET61A0AC07_USERPOOLID,
                Username: user.username,
            })
            .promise();
        return cognitoClient
            .adminDeleteUser({
                UserPoolId: process.env.AUTH_PLATELET61A0AC07_USERPOOLID,
                Username: user.username,
            })
            .promise();
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
    let newUser = null;
    let password = null;
    try {
        const result = await inviteNewUserToTeam(user, tenantId);
        newUser = result.newUser;
        password = result.password;
        console.log("User result:", newUser);
        await sendWelcomeEmail(
            event.arguments.email,
            event.arguments.name,
            password
        );
        console.log("Successfully sent welcome email");
        return newUser;
    } catch (e) {
        console.log(e);
        await cleanUp(newUser);
        throw e;
    }
};
