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

require("isomorphic-fetch");
const aws = require("aws-sdk");
const AWS = require("aws-sdk/global");
const AUTH_TYPE = require("aws-appsync").AUTH_TYPE;
const AWSAppSyncClient = require("aws-appsync").default;
const uuid = require("uuid");
const createUser = require("./createUser").createUser;
const createTenant = require("./createTenant").createTenant;

const appSyncConfig = {
    url: process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT,
    region: process.env.REGION,
    auth: {
        type: AUTH_TYPE.AWS_IAM,
        credentials: AWS.config.credentials,
    },
    disableOffline: true,
};

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
                        Welcome to ${process.env.PLATELET_DOMAIN_NAME}, ${recipientName}!
                    </p>
                    <p>
                        Your account has been created. You can now start adding users to your team.
                    </p>
                    <p>
                        You will be asked to change your password on first log in.
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
                    Data: `Welcome to ${process.env.PLATELET_DOMAIN_NAME}, ${recipientName}!
                    Your account has been created. You can now start adding users to your team.
                    You will be asked to change your password on first log in.
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

async function addTenant(tenant) {
    const appSyncClient = new AWSAppSyncClient(appSyncConfig);
    const createdTenant = await appSyncClient.mutate({
        mutation: createTenant,
        variables: { input: tenant },
    });
    return createdTenant.data.createTenant;
}

async function createNewTenant(newUser, tenantId) {
    const userPoolId = process.env.AUTH_PLATELET61A0AC07_USERPOOLID;

    const appSyncClient = new AWSAppSyncClient(appSyncConfig);
    const CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
    const cognitoClient = new CognitoIdentityServiceProvider({
        apiVersion: "2016-04-19",
    });

    const generatedPassword = Math.random().toString(36).substr(2, 8);

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
            TemporaryPassword: generatedPassword,
            UserPoolId: userPoolId,
            Username: uuid.v4(),
            MessageAction: "SUPPRESS",
        })
        .promise();

    if (!cognitoResp.User) {
        throw new Error(
            `Failure to create new user with email ${newUser.email}`
        );
    }
    let { name, displayName } = newUser;
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
        name,
        displayName,
        roles: ["USER", "ADMIN", "COORDINATOR", "RIDER"],
        contact: { emailAddress: newUser.email },
    };

    const createdUser = await appSyncClient.mutate({
        mutation: createUser,
        variables: { input: createUserInput },
    });

    return {
        newUser: createdUser.data.createUser,
        password: generatedPassword,
    };
}

exports.handler = async (event) => {
    console.log("Arguments:", event.arguments);
    console.log(
        process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT,
        process.env.API_PLATELET_GRAPHQLAPIIDOUTPUT,
        process.env.AUTH_PLATELET61A0AC07_USERPOOLID,
        process.env.ENV,
        process.env.REGION
    );
    const user = {
        name: event.arguments.name,
        displayName: event.arguments.name,
        email: event.arguments.email,
        roles: ["USER", "ADMIN"],
    };
    const tenant = {
        referenceIdentifier: event.arguments.referenceIdentifier,
        name: event.arguments.tenantName,
    };
    const newTenant = await addTenant(tenant);
    console.log("Tenant result:", newTenant);
    const { newUser, password } = await createNewTenant(user, newTenant.id);
    console.log("User result:", newUser);
    await sendWelcomeEmail(
        event.arguments.email,
        event.arguments.name,
        password
    );
    console.log("Successfully sent welcome email");
    return newUser;
};
