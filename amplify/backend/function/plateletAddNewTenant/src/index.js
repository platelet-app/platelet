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
const updateUser = require("./updateUser").updateUser;
const createTenant = require("./createTenant").createTenant;
const listTenants = require("./listTenants").listTenants;

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
                        Welcome to https://${process.env.PLATELET_DOMAIN_NAME}, ${recipientName}!
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
                    Data: `Welcome to https://${process.env.PLATELET_DOMAIN_NAME}, ${recipientName}!
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

async function generateReferenceIdentifier(tenantName) {
    if (!tenantName) {
        throw new Error(`tenantName is required`);
    }
    // strip all non-alphanumeric characters
    tenantName = tenantName.replace(/[^a-zA-Z0-9]/g, "");
    if (tenantName.length < 4) {
        throw new Error(
            `tenantName must be at least 4 characters without whitespace`
        );
    }
    let attempt = 0;
    const appSyncClient = new AWSAppSyncClient(appSyncConfig);
    const listTenantsResult = await appSyncClient.query({
        query: listTenants,
    });
    const tenantReferenceIdentifiers =
        listTenantsResult.data.listTenants.items.map(
            (tenant) => tenant.referenceIdentifier
        );
    console.log("Tenant reference identifiers:", tenantReferenceIdentifiers);
    // get first 4 characters of tenant name
    let first4Characters = tenantName.substring(0, 4);
    while (
        attempt < tenantName.length - 3 &&
        tenantReferenceIdentifiers
            .map((n) => n.toLowerCase())
            .includes(first4Characters.toLowerCase())
    ) {
        // replace the last character of the first 4 characters with the next letter in the tenant name
        first4Characters =
            first4Characters.substring(0, 3) +
            String.fromCharCode(tenantName.charCodeAt(3) + attempt);
        attempt++;
    }
    if (
        tenantReferenceIdentifiers
            .map((n) => n.toLowerCase())
            .includes(first4Characters.toLowerCase())
    ) {
        // generate 4 random letters
        first4Characters = first4Characters + uuid.v4().substring(0, 4);
    }
    if (
        tenantReferenceIdentifiers
            .map((n) => n.toLowerCase())
            .includes(first4Characters.toLowerCase())
    ) {
        throw new Error(`Could not generate a unique reference identifier`);
    }
}

async function addTenant(tenant) {
    const referenceIdentifier = generateReferenceIdentifier(tenant.name);
    const appSyncClient = new AWSAppSyncClient(appSyncConfig);
    const createdTenant = await appSyncClient.mutate({
        mutation: createTenant,
        variables: { input: { ...tenant, referenceIdentifier } },
    });
    return createdTenant.data.createTenant;
}

async function addUserToCognito(user) {
    const userPoolId = process.env.AUTH_PLATELET61A0AC07_USERPOOLID;
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
                    Value: user.emailAddress,
                },
                {
                    Name: "email_verified",
                    Value: "true",
                },
            ],
            TemporaryPassword: generatedPassword,
            UserPoolId: userPoolId,
            Username: user.username,
            MessageAction: "SUPPRESS",
        })
        .promise();

    if (!cognitoResp.User) {
        throw new Error(
            `Failure to create new user with email ${user.emailAddress}`
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
        throw new Error(`missing cognitoId attribute for newly created user`);
    }

    return {
        password: generatedPassword,
        sub: subFind.Value,
        username: user.username,
    };
}

async function setUserRoles(username) {
    console.log("Amending roles for:", username);
    const CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
    const cognitoClient = new CognitoIdentityServiceProvider({
        apiVersion: "2016-04-19",
    });
    const userPoolId = process.env.AUTH_PLATELET61A0AC07_USERPOOLID;
    for (const role of ["USER", "ADMIN"]) {
        await cognitoClient
            .adminAddUserToGroup({
                GroupName: role,
                UserPoolId: userPoolId,
                Username: username,
            })
            .promise();
    }
}

async function createNewAdminUser(newUser) {
    const tenantId = uuid.v4();

    const appSyncClient = new AWSAppSyncClient(appSyncConfig);
    let { name, displayName, emailAddress, username } = newUser;
    const createUserInput = {
        tenantId: tenantId,
        disabled: 0,
        cognitoId: uuid.v4(),
        username,
        name,
        displayName,
        roles: ["USER", "ADMIN"],
        contact: { emailAddress },
    };

    const createdUser = await appSyncClient.mutate({
        mutation: createUser,
        variables: { input: createUserInput },
    });

    return createdUser.data.createUser;
}

async function updateUserTenantAndCognito(user, tenantId, cognitoId) {
    if (!user || !user._version || !user.id || !tenantId || !cognitoId) {
        throw new Error(`user, _version, tenantId, and cognitoId are required`);
    }
    const appSyncClient = new AWSAppSyncClient(appSyncConfig);
    const userPoolId = process.env.AUTH_PLATELET61A0AC07_USERPOOLID;
    const CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
    const cognitoClient = new CognitoIdentityServiceProvider({
        apiVersion: "2016-04-19",
    });

    const cognitoResp = await cognitoClient
        .adminUpdateUserAttributes({
            UserAttributes: [
                {
                    Name: "email",
                    Value: user.contact ? user.contact.emailAddress : null,
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
            Username: user.username,
        })
        .promise();

    const updateUserInput = {
        id: user.id,
        tenantId: tenantId,
        cognitoId: cognitoId,
        _version: user._version,
    };

    return appSyncClient.mutate({
        mutation: updateUser,
        variables: { input: updateUserInput },
    });
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
        emailAddress: event.arguments.emailAddress,
        roles: ["USER", "ADMIN"],
        username: uuid.v4(),
    };
    const tenant = {
        name: event.arguments.tenantName,
    };
    const newUser = await createNewAdminUser(user);
    const newTenant = await addTenant({ ...tenant, tenantAdminId: newUser.id });
    const cognitoUser = await addUserToCognito(user, newTenant.id);
    const admin = await updateUserTenantAndCognito(
        newUser,
        newTenant.id,
        cognitoUser.sub
    );
    await setUserRoles(user.username);
    console.log("Tenant result:", newTenant);
    console.log("User result:", newUser);
    await sendWelcomeEmail(
        event.arguments.emailAddress,
        event.arguments.name,
        cognitoUser.password
    );
    console.log("Successfully sent welcome email");
    return { ...newTenant, admin };
};
