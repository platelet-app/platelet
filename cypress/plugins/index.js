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
const dotenv = require("dotenv");

// Same signing stack used by the platelet Lambda functions.
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { SignatureV4 } = require("@aws-sdk/signature-v4");
const { HttpRequest } = require("@aws-sdk/protocol-http");
const { Sha256 } = require("@aws-crypto/sha256-js");
const fetch = require("node-fetch");

const injectDevServer = require("@cypress/react/plugins/react-scripts");
const awsConfig = require(path.join(__dirname, "../../aws-exports-es5.js"));

dotenv.config();

/**
 * Execute a GraphQL request signed with AWS IAM (SigV4).
 *
 * Uses defaultProvider() so credentials are resolved from the standard AWS
 * credential chain: AWS_ACCESS_KEY_ID env vars, ~/.aws/credentials profiles,
 * SSO, instance metadata, etc. — the same way the platelet Lambda functions
 * authenticate. No credentials need to be stored in cypress.env.json.
 */
async function executeIamGraphqlRequest({ endpoint, region, query, variables }) {
    const parsedUrl = new URL(endpoint);
    const body = JSON.stringify({ query, variables });

    const signer = new SignatureV4({
        credentials: defaultProvider(),
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

    on("task", {
        /**
         * Execute a GraphQL mutation signed with AWS IAM credentials.
         * Use this when Cognito auth lacks the permissions needed (e.g. setting
         * isBeingDeleted on a User, which only IAM callers can write).
         *
         * Credentials are resolved automatically from the standard AWS chain
         * (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY env vars, ~/.aws/credentials,
         * AWS SSO, etc.). The caller must have appsync:GraphQL permission on the API.
         */
        iamGraphqlMutation({ query, variables }) {
            return executeIamGraphqlRequest({
                endpoint: config.env.appsyncGraphqlEndpoint,
                region: config.env.appsyncRegion,
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
                query,
                variables,
            });
        },
    });

    injectDevServer(on, config);
    return config;
};
