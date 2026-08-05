import { randomBytes, randomUUID } from "crypto";
import { request, errorCheck } from "@platelet-app/lambda";
import {
    AdminAddUserToGroupCommand,
    AdminCreateUserCommand,
    AdminDeleteUserCommand,
    AdminSetUserPasswordCommand,
    CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import type {
    LambdaEvent,
    LambdaReturn,
    TenantRecord,
    UserRecord,
} from "./interfaces.js";
import {
    createTenant,
    createUser,
    deleteTenant,
    deleteUser,
    getTenant,
    getUser,
    listTenants,
    updateUser,
} from "./queries.js";

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const USER_POOL_ID = process.env.USER_POOL_ID;
const REGION = process.env.REGION;

const userRoles = ["USER", "ADMIN", "COORDINATOR"];

const cognitoClient = new CognitoIdentityProviderClient({});
const ssmClient = new SSMClient({});

const generatePassword = () => {
    // base64url gives alphanumeric characters plus - and _, which satisfies
    // the user pool password policy (minimum length only)
    return randomBytes(12).toString("base64url");
};

export function generateReferenceIdentifier(tenantName: string) {
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
    return tenantName.substring(0, 4);
}

const getParam = async (paramName: string) => {
    const command = new GetParameterCommand({ Name: paramName });
    const response = await ssmClient.send(command);
    return response.Parameter?.Value;
};

const getSSMParams = async () => {
    const fromEmailParameterName = `/platelet-supporting-cdk/${process.env.ENV}/FromEmail`;
    const domainParameterName = `/platelet-supporting-cdk/${process.env.ENV}/DomainName`;
    const fromEmail = await getParam(fromEmailParameterName);
    const domainName = await getParam(domainParameterName);
    if (!fromEmail) {
        throw new Error(`Missing SSM parameter: ${fromEmailParameterName}`);
    }
    if (!domainName) {
        throw new Error(`Missing SSM parameter: ${domainParameterName}`);
    }
    return { fromEmail, domainName };
};

const sendTenantWelcomeEmail = async (
    emailAddress: string,
    recipientName: string,
    password: string
) => {
    const { fromEmail, domainName } = await getSSMParams();
    const sesClient = new SESClient({ region: REGION || "eu-west-1" });
    const command = new SendEmailCommand({
        Destination: {
            ToAddresses: [emailAddress],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `
                    <p>
                        Welcome to https://${domainName}, ${recipientName}!
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
                        <b>This temporary password will expire in one week.</b>
                    </p>
                    <p>
                        Thank you.
                    </p>
                    `,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: `Welcome to https://${domainName}, ${recipientName}!
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
        Source: fromEmail,
        ReplyToAddresses: [fromEmail],
        ReturnPath: fromEmail,
    });
    return await sesClient.send(command);
};

const findExistingTenant = async (
    endpoint: string
): Promise<TenantRecord | null> => {
    const response = await request(
        { query: listTenants, variables: { limit: 100 } },
        endpoint
    );
    const body = await response.json();
    errorCheck(body);
    const items: TenantRecord[] = body?.data?.listTenants?.items || [];
    return items.find((tenant) => !tenant._deleted) || null;
};

const createAdminUser = async (
    user: {
        name: string;
        displayName: string;
        emailAddress: string;
        username: string;
    },
    endpoint: string
): Promise<UserRecord> => {
    const createUserInput = {
        // placeholder ids that are replaced once the tenant and the cognito
        // user exist
        tenantId: randomUUID(),
        cognitoId: randomUUID(),
        disabled: 0,
        isPrimaryAdmin: 1,
        username: user.username,
        name: user.name,
        displayName: user.displayName,
        roles: userRoles,
        contact: { emailAddress: user.emailAddress },
    };
    const response = await request(
        { query: createUser, variables: { input: createUserInput } },
        endpoint
    );
    const body = await response.json();
    errorCheck(body);
    return body.data.createUser;
};

const createTenantRecord = async (
    tenant: { name: string; tenantAdminId: string },
    endpoint: string
): Promise<TenantRecord> => {
    const referenceIdentifier = generateReferenceIdentifier(tenant.name);
    const response = await request(
        {
            query: createTenant,
            variables: { input: { ...tenant, referenceIdentifier } },
        },
        endpoint
    );
    const body = await response.json();
    errorCheck(body);
    return body.data.createTenant;
};

const createCognitoUser = async (
    username: string,
    emailAddress: string,
    temporaryPassword: string,
    userPoolId: string
) => {
    const response = await cognitoClient.send(
        new AdminCreateUserCommand({
            DesiredDeliveryMediums: ["EMAIL"],
            ForceAliasCreation: false,
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
            TemporaryPassword: temporaryPassword,
            UserPoolId: userPoolId,
            Username: username,
            MessageAction: "SUPPRESS",
        })
    );
    if (!response.User) {
        throw new Error(
            `Failure to create new user with email ${emailAddress}`
        );
    }
    const subFind = response.User.Attributes?.find(
        (attr) => attr.Name === "sub"
    );
    if (!subFind?.Value) {
        throw new Error(`missing sub attribute for newly created user`);
    }
    return { sub: subFind.Value, username };
};

const setPermanentPassword = async (
    username: string,
    password: string,
    userPoolId: string
) => {
    await cognitoClient.send(
        new AdminSetUserPasswordCommand({
            UserPoolId: userPoolId,
            Username: username,
            Password: password,
            Permanent: true,
        })
    );
};

const addUserToGroups = async (username: string, userPoolId: string) => {
    for (const role of userRoles) {
        await cognitoClient.send(
            new AdminAddUserToGroupCommand({
                GroupName: role,
                UserPoolId: userPoolId,
                Username: username,
            })
        );
    }
};

const updateUserTenantAndCognito = async (
    user: UserRecord,
    tenantId: string,
    cognitoId: string,
    endpoint: string
): Promise<UserRecord> => {
    if (!user || !user._version || !user.id || !tenantId || !cognitoId) {
        throw new Error(`user, _version, tenantId, and cognitoId are required`);
    }
    const updateUserInput = {
        id: user.id,
        tenantId,
        cognitoId,
        _version: user._version,
    };
    const response = await request(
        { query: updateUser, variables: { input: updateUserInput } },
        endpoint
    );
    const body = await response.json();
    errorCheck(body);
    return body.data.updateUser;
};

const cleanUp = async (
    user: UserRecord | undefined,
    tenant: TenantRecord | undefined,
    cognitoUsername: string | undefined,
    userPoolId: string,
    endpoint: string
) => {
    console.log("Cleaning up user and tenant");
    if (cognitoUsername) {
        console.log("Deleting cognito user:", cognitoUsername);
        await cognitoClient.send(
            new AdminDeleteUserCommand({
                UserPoolId: userPoolId,
                Username: cognitoUsername,
            })
        );
    }
    if (user) {
        console.log("Deleting user:", user.id);
        const response = await request(
            { query: getUser, variables: { id: user.id } },
            endpoint
        );
        const body = await response.json();
        if (body?.data?.getUser) {
            const { id, _version } = body.data.getUser;
            await request(
                { query: deleteUser, variables: { input: { id, _version } } },
                endpoint
            );
        } else {
            console.warn("User to clean up was not found");
        }
    }
    if (tenant) {
        console.log("Deleting tenant:", tenant.id);
        const response = await request(
            { query: getTenant, variables: { id: tenant.id } },
            endpoint
        );
        const body = await response.json();
        if (body?.data?.getTenant) {
            const { id, _version } = body.data.getTenant;
            await request(
                { query: deleteTenant, variables: { input: { id, _version } } },
                endpoint
            );
        } else {
            console.warn("Tenant to clean up was not found");
        }
    }
};

export const handler = async (event: LambdaEvent): Promise<LambdaReturn> => {
    console.log("provision tenant", { ...event, mode: event.mode });
    const { mode, tenantName, adminName, adminEmailAddress } = event;
    if (!GRAPHQL_ENDPOINT || !USER_POOL_ID) {
        throw new Error("Missing env variables");
    }
    if (!["bootstrap", "preview"].includes(mode)) {
        throw new Error(`mode must be "bootstrap" or "preview"`);
    }
    if (!tenantName || !adminName || !adminEmailAddress) {
        throw new Error(
            "tenantName, adminName, and adminEmailAddress are required"
        );
    }

    const existingTenant = await findExistingTenant(GRAPHQL_ENDPOINT);
    if (existingTenant) {
        console.log("A tenant already exists:", existingTenant.id);
        if (mode === "preview" && existingTenant.admin) {
            // refresh the password so the credentials posted for each preview
            // deployment stay valid
            const password = generatePassword();
            await setPermanentPassword(
                existingTenant.admin.username,
                password,
                USER_POOL_ID
            );
            return {
                status: "already-provisioned",
                tenantId: existingTenant.id,
                loginEmailAddress:
                    existingTenant.admin.contact?.emailAddress || undefined,
                password,
            };
        }
        return { status: "already-provisioned", tenantId: existingTenant.id };
    }

    const username = randomUUID();
    const password = generatePassword();
    let newUser: UserRecord | undefined;
    let newTenant: TenantRecord | undefined;
    let cognitoUser: { sub: string; username: string } | undefined;
    try {
        newUser = await createAdminUser(
            {
                name: adminName,
                displayName: adminName,
                emailAddress: adminEmailAddress,
                username,
            },
            GRAPHQL_ENDPOINT
        );
        newTenant = await createTenantRecord(
            { name: tenantName, tenantAdminId: newUser.id },
            GRAPHQL_ENDPOINT
        );
        cognitoUser = await createCognitoUser(
            username,
            adminEmailAddress,
            password,
            USER_POOL_ID
        );
        await updateUserTenantAndCognito(
            newUser,
            newTenant.id,
            cognitoUser.sub,
            GRAPHQL_ENDPOINT
        );
        await addUserToGroups(username, USER_POOL_ID);
        if (mode === "preview") {
            await setPermanentPassword(username, password, USER_POOL_ID);
            console.log("Tenant result:", newTenant.id);
            return {
                status: "created",
                tenantId: newTenant.id,
                loginEmailAddress: adminEmailAddress,
                password,
            };
        }
        await sendTenantWelcomeEmail(adminEmailAddress, adminName, password);
        console.log("Successfully sent welcome email");
        console.log("Tenant result:", newTenant.id);
        return { status: "created", tenantId: newTenant.id };
    } catch (e) {
        console.error("Error:", e);
        await cleanUp(
            newUser,
            newTenant,
            cognitoUser?.username,
            USER_POOL_ID,
            GRAPHQL_ENDPOINT
        );
        throw e;
    }
};
