import { defineConfig } from "cypress";
import * as path from "path";
import * as fs from "fs";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { Sha256 } from "@aws-crypto/sha256-js";
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import {
    CognitoIdentityProviderClient,
    AdminSetUserPasswordCommand,
    AdminGetUserCommand,
    AdminListGroupsForUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import fetch from "node-fetch";
import {
    mutations as gqlMutations,
    queries as gqlQueries,
} from "@platelet-app/graphql";

function getCypressTestRoleArnFromCdkOutputs(): string | null {
    const cdkOutPath = path.join(__dirname, "cdk/cdk-out.json");
    try {
        const cdkOut = JSON.parse(fs.readFileSync(cdkOutPath, "utf8"));
        for (const stackOutputs of Object.values(cdkOut) as Record<
            string,
            string
        >[]) {
            for (const [key, value] of Object.entries(stackOutputs)) {
                if (key.includes("CypressTestRole")) {
                    return value;
                }
            }
        }
    } catch (_) {}
    return null;
}

async function assumeTestRole(region: string, roleArn: string) {
    const sts = new STSClient({ region, credentials: defaultProvider() });
    const { Credentials } = await sts.send(
        new AssumeRoleCommand({
            RoleArn: roleArn,
            RoleSessionName: "CypressE2ETest",
            DurationSeconds: 900,
        })
    );
    return {
        accessKeyId: Credentials!.AccessKeyId!,
        secretAccessKey: Credentials!.SecretAccessKey!,
        sessionToken: Credentials!.SessionToken,
    };
}

async function executeIamGraphqlRequest({
    endpoint,
    region,
    roleArn,
    query,
    variables,
}: {
    endpoint: string;
    region: string;
    roleArn?: string;
    query: string;
    variables: unknown;
}) {
    const parsedUrl = new URL(endpoint);
    const body = JSON.stringify({ query, variables });

    const credentials = roleArn
        ? await assumeTestRole(region, roleArn)
        : defaultProvider();

    const signer = new SignatureV4({
        credentials,
        region,
        service: "appsync",
        sha256: Sha256,
    });

    const requestToSign = new HttpRequest({
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            host: parsedUrl.host,
        },
        hostname: parsedUrl.host,
        body,
        path: parsedUrl.pathname,
    });

    const signed = await signer.sign(requestToSign);
    const response = await fetch(
        endpoint,
        signed as Parameters<typeof fetch>[1]
    );
    return response.json();
}

async function adminSetUserPassword({
    username,
    password,
    userPoolId,
    region,
    roleArn,
}: {
    username: string;
    password: string;
    userPoolId: string;
    region: string;
    roleArn?: string;
}): Promise<void> {
    const credentials = roleArn
        ? await assumeTestRole(region, roleArn)
        : defaultProvider();
    const client = new CognitoIdentityProviderClient({ region, credentials });
    await client.send(
        new AdminSetUserPasswordCommand({
            UserPoolId: userPoolId,
            Username: username,
            Password: password,
            Permanent: true,
        })
    );
}

function jwtSub(token: string): string {
    const payload = token.split(".")[1];
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")).sub;
}

async function executeCognitoGraphqlRequest(
    endpoint: string,
    idToken: string,
    query: string,
    variables: unknown
): Promise<{ data?: Record<string, unknown>; errors?: unknown[] }> {
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: idToken,
        },
        body: JSON.stringify({ query, variables }),
    });
    return response.json() as Promise<{
        data?: Record<string, unknown>;
        errors?: unknown[];
    }>;
}

export default defineConfig({
    allowCypressEnv: true,
    video: false,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    e2e: {
        setupNodeEvents(on, config) {
            const resolvedRoleArn =
                (config.env.awsRoleArn as string | undefined) ||
                getCypressTestRoleArnFromCdkOutputs() ||
                undefined;

            interface FixtureUser {
                id: string;
                username: string;
                password: string;
            }
            let fixtureUsers: {
                coord: FixtureUser;
                rider: FixtureUser;
            } | null = null;
            let storedAdminToken: string | null = null;

            on("after:run", async () => {
                if (!fixtureUsers || !storedAdminToken) return;
                const endpoint = config.env.appsyncGraphqlEndpoint as string;
                for (const user of [fixtureUsers.coord, fixtureUsers.rider]) {
                    try {
                        await executeCognitoGraphqlRequest(
                            endpoint,
                            storedAdminToken,
                            gqlMutations.disableUser,
                            { userId: user.id }
                        );
                        await executeCognitoGraphqlRequest(
                            endpoint,
                            storedAdminToken,
                            gqlMutations.adminDeleteUser,
                            { userId: user.id }
                        );
                        console.log(
                            `[Cypress] Cleaned up fixture user ${user.id}`
                        );
                    } catch (err) {
                        console.error(
                            `[Cypress] Failed to clean up fixture user ${user.id}:`,
                            err
                        );
                    }
                }
                fixtureUsers = null;
                storedAdminToken = null;
            });

            on("task", {
                iamGraphqlMutation({
                    query,
                    variables,
                }: {
                    query: string;
                    variables: unknown;
                }) {
                    return executeIamGraphqlRequest({
                        endpoint: config.env.appsyncGraphqlEndpoint as string,
                        region: config.env.appsyncRegion as string,
                        roleArn: resolvedRoleArn,
                        query,
                        variables,
                    });
                },

                iamGraphqlRequest({
                    query,
                    variables,
                }: {
                    query: string;
                    variables: unknown;
                }) {
                    return executeIamGraphqlRequest({
                        endpoint: config.env.appsyncGraphqlEndpoint as string,
                        region: config.env.appsyncRegion as string,
                        roleArn: resolvedRoleArn,
                        query,
                        variables,
                    });
                },

                cognitoAdminSetUserPassword({
                    username,
                    password,
                }: {
                    username: string;
                    password: string;
                }) {
                    return adminSetUserPassword({
                        username,
                        password,
                        userPoolId: config.env.userPoolId as string,
                        region: config.env.appsyncRegion as string,
                        roleArn: resolvedRoleArn,
                    }).then(() => null);
                },

                async cognitoAdminGetUser({ username }: { username: string }) {
                    const region = config.env.appsyncRegion as string;
                    const userPoolId = config.env.userPoolId as string;
                    const credentials = resolvedRoleArn
                        ? await assumeTestRole(region, resolvedRoleArn)
                        : defaultProvider();
                    const client = new CognitoIdentityProviderClient({
                        region,
                        credentials,
                    });
                    try {
                        const result = await client.send(
                            new AdminGetUserCommand({
                                UserPoolId: userPoolId,
                                Username: username,
                            })
                        );
                        return { exists: true, enabled: result.Enabled ?? true };
                    } catch (err: any) {
                        if (err.name === "UserNotFoundException") {
                            return { exists: false };
                        }
                        throw err;
                    }
                },

                async cognitoAdminListGroupsForUser({
                    username,
                }: {
                    username: string;
                }) {
                    const region = config.env.appsyncRegion as string;
                    const userPoolId = config.env.userPoolId as string;
                    const credentials = resolvedRoleArn
                        ? await assumeTestRole(region, resolvedRoleArn)
                        : defaultProvider();
                    const client = new CognitoIdentityProviderClient({
                        region,
                        credentials,
                    });
                    const result = await client.send(
                        new AdminListGroupsForUserCommand({
                            UserPoolId: userPoolId,
                            Username: username,
                        })
                    );
                    return (result.Groups ?? []).map((g) => g.GroupName);
                },

                async createFixtureUsers({
                    adminToken,
                }: {
                    adminToken: string;
                }) {
                    storedAdminToken = adminToken;
                    if (fixtureUsers) return fixtureUsers;

                    const region = config.env.appsyncRegion as string;
                    const endpoint = config.env
                        .appsyncGraphqlEndpoint as string;
                    const userPoolId = config.env.userPoolId as string;
                    const timestamp = Date.now();

                    let tenantId = config.env.tenantId as string | undefined;
                    if (!tenantId) {
                        const cognitoId = jwtSub(adminToken);
                        const selfResp = await executeCognitoGraphqlRequest(
                            endpoint,
                            adminToken,
                            gqlQueries.getUserByCognitoId,
                            { cognitoId }
                        );
                        const items = (
                            selfResp.data?.getUserByCognitoId as any
                        )?.items;
                        tenantId = items?.[0]?.tenantId;
                        if (!tenantId) {
                            throw new Error(
                                `createFixtureUsers: could not resolve tenantId from admin user record. errors: ${JSON.stringify(selfResp.errors)}`
                            );
                        }
                    }

                    const coordPassword = `CoordTest${timestamp}!A`;
                    const riderPassword = `RiderTest${timestamp}!A`;

                    const [coordResp, riderResp] = await Promise.all([
                        executeCognitoGraphqlRequest(
                            endpoint,
                            adminToken,
                            gqlMutations.registerUser,
                            {
                                name: `Test Coordinator ${timestamp}`,
                                email: `test-coord-${timestamp}@platelet.app`,
                                tenantId,
                                roles: ["COORDINATOR", "USER"],
                            }
                        ),
                        executeCognitoGraphqlRequest(
                            endpoint,
                            adminToken,
                            gqlMutations.registerUser,
                            {
                                name: `Test Rider ${timestamp}`,
                                email: `test-rider-${timestamp}@platelet.app`,
                                tenantId,
                                roles: ["RIDER", "USER"],
                            }
                        ),
                    ]);

                    const coord = coordResp.data?.registerUser as
                        | (FixtureUser & { username: string })
                        | undefined;
                    const rider = riderResp.data?.registerUser as
                        | (FixtureUser & { username: string })
                        | undefined;

                    if (!coord?.id || !rider?.id) {
                        throw new Error(
                            `Fixture user creation failed:\n` +
                                `coord: ${JSON.stringify(coordResp.errors)}\n` +
                                `rider: ${JSON.stringify(riderResp.errors)}`
                        );
                    }

                    await Promise.all([
                        adminSetUserPassword({
                            username: coord.username,
                            password: coordPassword,
                            userPoolId,
                            region,
                            roleArn: resolvedRoleArn,
                        }),
                        adminSetUserPassword({
                            username: rider.username,
                            password: riderPassword,
                            userPoolId,
                            region,
                            roleArn: resolvedRoleArn,
                        }),
                    ]);

                    fixtureUsers = {
                        coord: {
                            id: coord.id,
                            username: coord.username,
                            password: coordPassword,
                        },
                        rider: {
                            id: rider.id,
                            username: rider.username,
                            password: riderPassword,
                        },
                    };

                    console.log(
                        `[Cypress] Created fixture users — coord: ${coord.id}, rider: ${rider.id}`
                    );
                    return fixtureUsers;
                },

                getFixtureUsers() {
                    if (fixtureUsers) return fixtureUsers;
                    // Fallback to env vars so cypress open works with pre-existing accounts.
                    const cu = config.env.coordusername as string | undefined;
                    const cp = config.env.coordpassword as string | undefined;
                    const ru = config.env.riderusername as string | undefined;
                    const rp = config.env.riderpassword as string | undefined;
                    if (cu && cp && ru && rp) {
                        return {
                            coord: { id: null, username: cu, password: cp },
                            rider: { id: null, username: ru, password: rp },
                        };
                    }
                    return null;
                },
            });

            return config;
        },
    },
});
