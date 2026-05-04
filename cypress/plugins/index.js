/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Same signing stack used by the platelet Lambda functions.
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { SignatureV4 } = require("@aws-sdk/signature-v4");
const { HttpRequest } = require("@aws-sdk/protocol-http");
const { Sha256 } = require("@aws-crypto/sha256-js");
const { STSClient, AssumeRoleCommand } = require("@aws-sdk/client-sts");
const fetch = require("node-fetch");

const injectDevServer = require("@cypress/react/plugins/react-scripts");
const awsConfig = require(path.join(__dirname, "../../aws-exports-es5.js"));

dotenv.config();

/**
 * Read the Cypress test role ARN from cdk/cdk-out.json, which cdk deploy
 * writes automatically. Searches all stacks for an output key containing
 * "CypressTestRole" so the pipeline needs no extra config step — just run
 * `cdk deploy --outputs-file cdk-out.json` (or the equivalent deploy command)
 * before Cypress. Returns null if the file is missing or has no matching key.
 */
function getCypressTestRoleArnFromCdkOutputs() {
    const cdkOutPath = path.join(__dirname, "../../cdk/cdk-out.json");
    try {
        const cdkOut = JSON.parse(fs.readFileSync(cdkOutPath, "utf8"));
        for (const stackOutputs of Object.values(cdkOut)) {
            for (const [key, value] of Object.entries(stackOutputs)) {
                if (key.includes("CypressTestRole")) {
                    return value;
                }
            }
        }
    } catch (_) {
        // File missing or unreadable — fall through to the next source.
    }
    return null;
}

/**
 * Assume the Cypress test IAM role and return short-lived credentials.
 * The caller's own credentials (from defaultProvider) must have
 * sts:AssumeRole permission on the role ARN.
 */
async function assumeTestRole(region, roleArn) {
    const sts = new STSClient({ region, credentials: defaultProvider() });
    const { Credentials } = await sts.send(
        new AssumeRoleCommand({
            RoleArn: roleArn,
            RoleSessionName: "CypressE2ETest",
            DurationSeconds: 900,
        })
    );
    return {
        accessKeyId: Credentials.AccessKeyId,
        secretAccessKey: Credentials.SecretAccessKey,
        sessionToken: Credentials.SessionToken,
    };
}

/**
 * Execute a GraphQL request signed with AWS IAM (SigV4).
 *
 * If roleArn is provided the function first assumes that role via STS and
 * signs with the resulting short-lived credentials. Otherwise it falls back
 * to defaultProvider(), which resolves credentials from the standard AWS
 * chain (env vars, ~/.aws/credentials, SSO, etc.).
 *
 * Set awsRoleArn in cypress.env.json (or pass CYPRESS_awsRoleArn in CI) to
 * point at the CypressTestRole deployed by the CDK stack.
 */
async function executeIamGraphqlRequest({ endpoint, region, roleArn, query, variables }) {
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
    const response = await fetch(endpoint, signed);
    return response.json();
}

module.exports = (on, config) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config
    config.env.cognito_username = process.env.AWS_COGNITO_USERNAME;
    config.env.cognito_password = process.env.AWS_COGNITO_PASSWORD;
    config.env.awsConfig = awsConfig.default;

    // Resolved once at plugin load time: cypress.env.json > cdk/cdk-out.json > undefined.
    const resolvedRoleArn =
        config.env.awsRoleArn || getCypressTestRoleArnFromCdkOutputs() || undefined;

    on("task", {
        /**
         * Execute a GraphQL mutation signed with AWS IAM credentials.
         * Use this when Cognito auth lacks the permissions needed (e.g. setting
         * isBeingDeleted on a User, which only IAM callers can write).
         *
         * The role ARN is resolved automatically from cdk/cdk-out.json (written
         * by cdk deploy) so no manual configuration is required in the pipeline.
         * Override with awsRoleArn in cypress.env.json or CYPRESS_awsRoleArn if
         * needed.
         */
        iamGraphqlMutation({ query, variables }) {
            return executeIamGraphqlRequest({
                endpoint: config.env.appsyncGraphqlEndpoint,
                region: config.env.appsyncRegion,
                roleArn: resolvedRoleArn,
                query,
                variables,
            });
        },

        /**
         * Execute a GraphQL query signed with AWS IAM credentials.
         * Same behaviour as iamGraphqlMutation but named for read operations.
         */
        iamGraphqlRequest({ query, variables }) {
            return executeIamGraphqlRequest({
                endpoint: config.env.appsyncGraphqlEndpoint,
                region: config.env.appsyncRegion,
                roleArn: resolvedRoleArn,
                query,
                variables,
            });
        },
    });

    injectDevServer(on, config);
    return config;
};
