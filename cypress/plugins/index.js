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

const injectDevServer = require("@cypress/react/plugins/react-scripts");
const awsConfig = require(path.join(__dirname, "../../aws-exports-es5.js"));

dotenv.config();

module.exports = (on, config) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config
    config.env.cognito_username = process.env.AWS_COGNITO_USERNAME;
    config.env.cognito_password = process.env.AWS_COGNITO_PASSWORD;
    config.env.awsConfig = awsConfig.default;
    injectDevServer(on, config);
    return config;
};
