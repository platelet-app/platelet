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
                id: string | null;
                username: string;
                password: string;
            }
            let fixtureUsers: {
                admin: FixtureUser;
                coord: FixtureUser;
                rider: FixtureUser;
            } | null = null;

            on("after:run", async () => {
                if (!fixtureUsers) return;
                const endpoint = config.env.appsyncGraphqlEndpoint as string;
                const region = config.env.appsyncRegion as string;
                for (const user of [
                    fixtureUsers.admin,
                    fixtureUsers.coord,
                    fixtureUsers.rider,
                ]) {
                    if (!user.id) continue;
                    try {
                        await executeIamGraphqlRequest({
                            endpoint,
                            region,
                            roleArn: resolvedRoleArn,
                            query: gqlMutations.disableUser,
                            variables: { userId: user.id },
                        });
                        await executeIamGraphqlRequest({
                            endpoint,
                            region,
                            roleArn: resolvedRoleArn,
                            query: gqlMutations.adminDeleteUser,
                            variables: { userId: user.id },
                        });
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
                        return {
                            exists: true,
                            enabled: result.Enabled ?? true,
                        };
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

                async createFixtureUsers() {
                    if (fixtureUsers) return fixtureUsers;

                    const region = config.env.appsyncRegion as string;
                    const endpoint = config.env
                        .appsyncGraphqlEndpoint as string;
                    const userPoolId = config.env.userPoolId as string;
                    const timestamp = Date.now();

                    let tenantId = config.env.tenantId as string | undefined;
                    if (!tenantId) {
                        const tenantsResp = await executeIamGraphqlRequest({
                            endpoint,
                            region,
                            roleArn: resolvedRoleArn,
                            query: gqlQueries.listTenants,
                            variables: {},
                        });
                        const tenants = (
                            (tenantsResp.data?.listTenants as any)
                                ?.items as any[]
                        )?.filter((t: any) => !t._deleted);
                        if (!tenants?.length) {
                            throw new Error(
                                "createFixtureUsers: no tenants found via IAM listTenants"
                            );
                        }
                        if (tenants.length > 1) {
                            throw new Error(
                                `createFixtureUsers: multiple tenants found — set tenantId in Cypress env to disambiguate`
                            );
                        }
                        tenantId = tenants[0].id;
                    }

                    const adminPassword = `AdminTest${timestamp}!A`;
                    const coordPassword = `CoordTest${timestamp}!A`;
                    const riderPassword = `RiderTest${timestamp}!A`;

                    const [adminResp, coordResp, riderResp] = await Promise.all(
                        [
                            executeIamGraphqlRequest({
                                endpoint,
                                region,
                                roleArn: resolvedRoleArn,
                                query: gqlMutations.registerUser,
                                variables: {
                                    name: `Test Admin ${timestamp}`,
                                    email: `test-admin-${timestamp}@platelet.app`,
                                    tenantId,
                                    roles: ["ADMIN", "USER"],
                                },
                            }),
                            executeIamGraphqlRequest({
                                endpoint,
                                region,
                                roleArn: resolvedRoleArn,
                                query: gqlMutations.registerUser,
                                variables: {
                                    name: `Test Coordinator ${timestamp}`,
                                    email: `test-coord-${timestamp}@platelet.app`,
                                    tenantId,
                                    roles: ["COORDINATOR", "USER"],
                                },
                            }),
                            executeIamGraphqlRequest({
                                endpoint,
                                region,
                                roleArn: resolvedRoleArn,
                                query: gqlMutations.registerUser,
                                variables: {
                                    name: `Test Rider ${timestamp}`,
                                    email: `test-rider-${timestamp}@platelet.app`,
                                    tenantId,
                                    roles: ["RIDER", "USER"],
                                },
                            }),
                        ]
                    );

                    const admin = adminResp.data?.registerUser as
                        | { id: string; username: string }
                        | undefined;
                    const coord = coordResp.data?.registerUser as
                        | { id: string; username: string }
                        | undefined;
                    const rider = riderResp.data?.registerUser as
                        | { id: string; username: string }
                        | undefined;

                    if (!admin?.id || !coord?.id || !rider?.id) {
                        throw new Error(
                            `Fixture user creation failed:\n` +
                                `admin: ${JSON.stringify(adminResp.errors)}\n` +
                                `coord: ${JSON.stringify(coordResp.errors)}\n` +
                                `rider: ${JSON.stringify(riderResp.errors)}`
                        );
                    }

                    await Promise.all([
                        adminSetUserPassword({
                            username: admin.username,
                            password: adminPassword,
                            userPoolId,
                            region,
                            roleArn: resolvedRoleArn,
                        }),
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
                        admin: {
                            id: admin.id,
                            username: admin.username,
                            password: adminPassword,
                        },
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
                        `[Cypress] Created fixture users — admin: ${admin.id}, coord: ${coord.id}, rider: ${rider.id}`
                    );
                    return fixtureUsers;
                },

                getFixtureUsers() {
                    if (fixtureUsers) return fixtureUsers;
                    // Fallback to env vars so cypress open works with pre-existing accounts.
                    const au = config.env.adminusername as string | undefined;
                    const ap = config.env.adminpassword as string | undefined;
                    const cu = config.env.coordusername as string | undefined;
                    const cp = config.env.coordpassword as string | undefined;
                    const ru = config.env.riderusername as string | undefined;
                    const rp = config.env.riderpassword as string | undefined;
                    if (au && ap && cu && cp && ru && rp) {
                        return {
                            admin: { id: null, username: au, password: ap },
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
