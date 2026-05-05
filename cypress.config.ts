import { defineConfig } from "cypress";
import * as path from "path";
import * as fs from "fs";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { Sha256 } from "@aws-crypto/sha256-js";
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import fetch from "node-fetch";

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

export default defineConfig({
    allowCypressEnv: true,
    video: false,
    e2e: {
        setupNodeEvents(on, config) {
            const resolvedRoleArn =
                (config.env.awsRoleArn as string | undefined) ||
                getCypressTestRoleArnFromCdkOutputs() ||
                undefined;

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
            });

            return config;
        },
    },
});
