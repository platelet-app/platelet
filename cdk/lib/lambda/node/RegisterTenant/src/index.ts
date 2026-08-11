import type { LambdaEvent } from "./interfaces.js";
import type { CreateTenantMutation, Tenant } from "@platelet-app/types";
import * as uuid from "uuid";
import {
    request,
    errorCheck,
    generateSecurePassword,
    sendTenantWelcomeEmail,
} from "@platelet-app/lambda";
import { mutations, queries } from "@platelet-app/graphql";
import type { User } from "@platelet-app/types";
import {
    AdminAddUserToGroupCommand,
    AdminCreateUserCommand,
    AdminDeleteUserCommand,
    AdminUpdateUserAttributesCommand,
    CognitoIdentityProviderClient,
    DeliveryMediumType,
    MessageActionType,
} from "@aws-sdk/client-cognito-identity-provider";

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || "";
const USER_POOL_ID = process.env.USER_POOL_ID;
const REGION = process.env.REGION;

const config = { region: REGION || "" };
const cognitoClient = new CognitoIdentityProviderClient(config);

const generateReferenceIdentifier = (tenantName: string) => {
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
};

const addUserToCognito = async (user: User) => {
    const generatedPassword = generateSecurePassword();
    const params = {
        DesiredDeliveryMediums: [DeliveryMediumType.EMAIL],
        ForceAliasCreation: false,
        UserAttributes: [
            {
                Name: "email",
                Value: user.contact?.emailAddress || "",
            },
            {
                Name: "email_verified",
                Value: "true",
            },
        ],
        TemporaryPassword: generatedPassword,
        UserPoolId: USER_POOL_ID,
        Username: user.username,
        MessageAction: MessageActionType.SUPPRESS,
    };

    const command = new AdminCreateUserCommand(params);

    const cognitoResp = await cognitoClient.send(command);

    console.log("Cognito response:", cognitoResp?.User?.Attributes);

    if (!cognitoResp.User) {
        throw new Error(
            `Failure to create new user with email ${user?.contact?.emailAddress}`
        );
    }
    const subFind = cognitoResp?.User?.Attributes?.find(
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
        sub: cognitoId,
        username: user.username,
    };
};

const setUserRoles = async (username: string) => {
    console.log("Amending roles for:", username);
    for (const role of ["USER", "ADMIN", "COORDINATOR"]) {
        const params = {
            GroupName: role,
            UserPoolId: USER_POOL_ID,
            Username: username,
        };
        const command = new AdminAddUserToGroupCommand(params);
        await cognitoClient.send(command);
    }
};

const createNewAdminUser = async (newUser: {
    name: string;
    displayName: string;
    emailAddress: string;
    username: string;
}) => {
    const tenantId = uuid.v4();

    let { name, displayName, emailAddress, username } = newUser;
    const createUserInput = {
        tenantId: tenantId,
        disabled: 0,
        isPrimaryAdmin: 1,
        cognitoId: uuid.v4(),
        username,
        name,
        displayName,
        roles: ["USER", "ADMIN", "COORDINATOR"],
        contact: { emailAddress },
    };

    const createdUserResponse = await request(
        {
            query: mutations.createUser,
            variables: { input: createUserInput },
        },
        GRAPHQL_ENDPOINT
    );
    const result = await createdUserResponse.json();
    errorCheck(result);
    return result.data.createUser;
};

async function updateUserTenantAndCognito(
    user?: User,
    tenantId?: string,
    cognitoId?: string
) {
    if (!user || !user._version || !user.id || !tenantId || !cognitoId) {
        throw new Error(`user, _version, tenantId, and cognitoId are required`);
    }
    const params = {
        UserAttributes: [
            {
                Name: "email",
                Value: user?.contact?.emailAddress || "",
            },
            {
                Name: "email_verified",
                Value: "true",
            },
        ],
        UserPoolId: USER_POOL_ID,
        Username: user.username,
    };
    const command = new AdminUpdateUserAttributesCommand(params);
    await cognitoClient.send(command);

    const updateUserInput = {
        id: user.id,
        tenantId: tenantId,
        cognitoId: cognitoId,
        _version: user._version,
    };

    const userResult = await request(
        {
            query: mutations.updateUser,
            variables: { input: updateUserInput },
        },
        GRAPHQL_ENDPOINT
    );
    const result = await userResult.json();
    errorCheck(result);
    return result.data.updateUser;
}

const cleanUp = async (
    user: User,
    tenant: Tenant,
    cognitoUser?: { username: string }
) => {
    console.log("Cleaning up user and tenant");
    if (cognitoUser) {
        console.log("Deleting cognito user:", cognitoUser.username);
        const params = {
            UserPoolId: USER_POOL_ID,
            Username: user.username,
        };
        const command = new AdminDeleteUserCommand(params);
        await cognitoClient.send(command);
    }
    if (user) {
        console.log("Deleting user:", user.id);
        const existingUser = await request(
            {
                query: queries.getUser,
                variables: { id: user.id },
            },

            GRAPHQL_ENDPOINT
        );
        const result = await existingUser.json();
        if (result?.data?.getUser) {
            const { id, _version } = result.data.getUser;
            console.log("User id:", id, "version:", _version);
            await request(
                {
                    query: mutations.deleteUser,
                    variables: {
                        input: {
                            id,
                            _version,
                        },
                    },
                },
                GRAPHQL_ENDPOINT
            );
        } else {
            console.warn("User to clean up was not found");
        }
    }
    if (tenant) {
        console.log("Deleting tenant:", tenant.id);
        const existingTenant = await request(
            {
                query: queries.getTenant,
                variables: { id: tenant.id },
            },

            GRAPHQL_ENDPOINT
        );
        const result = await existingTenant.json();
        if (result?.data?.getTenant) {
            const { id, _version } = result.data.getTenant;
            console.log("Tenant id:", id, "version:", _version);
            await request(
                {
                    query: mutations.deleteTenant,
                    variables: {
                        input: {
                            id,
                            _version,
                        },
                    },
                },
                GRAPHQL_ENDPOINT
            );
        } else {
            console.warn("Tenant to clean up was not found");
        }
    }
};

const addTenant = async (tenant: { name: string; tenantAdminId: string }) => {
    const referenceIdentifier = generateReferenceIdentifier(tenant.name);
    const createdTenantResult = await request(
        {
            query: mutations.createTenant,
            variables: { input: { ...tenant, referenceIdentifier } },
        },
        GRAPHQL_ENDPOINT
    );
    const createdTenant = await createdTenantResult.json();
    errorCheck(createdTenant);
    return createdTenant?.data?.createTenant;
};

export const handler = async (
    event: LambdaEvent
): Promise<CreateTenantMutation> => {
    console.log("register tenant", event);
    if (!GRAPHQL_ENDPOINT) {
        throw new Error("Missing env variables");
    }
    const user = {
        name: event.name,
        displayName: event.name,
        emailAddress: event.emailAddress,
        roles: ["USER", "ADMIN", "COORDINATOR"],
        username: uuid.v4(),
    };
    const tenant = {
        name: event.tenantName,
    };
    let newUser, newTenant, cognitoUser;
    try {
        newUser = await createNewAdminUser(user);
        newTenant = await addTenant({
            ...tenant,
            tenantAdminId: newUser.id,
        });
        cognitoUser = await addUserToCognito(newUser);
        const admin = await updateUserTenantAndCognito(
            newUser,
            newTenant.id,
            cognitoUser.sub
        );
        await setUserRoles(user.username);
        console.log("Tenant result:", newTenant);
        console.log("User result:", newUser);
        await sendTenantWelcomeEmail(
            event.emailAddress,
            event.name,
            cognitoUser.password
        );
        console.log("Successfully sent welcome email");
        return { ...newTenant, admin };
    } catch (e) {
        console.error("Error:", e);
        await cleanUp(newUser, newTenant, cognitoUser);
        throw e;
    }
};
