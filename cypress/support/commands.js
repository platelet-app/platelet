// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const Auth = require("aws-amplify").Auth;
const DataStore = require("aws-amplify").DataStore;
const models = require("../../src/models");
import "cypress-localstorage-commands";
import _ from "lodash";

const username = Cypress.env("username");
const password = Cypress.env("password");
const userPoolId = Cypress.env("userPoolId");
const clientId = Cypress.env("clientId");
const tenantId = Cypress.env("tenantId");

const awsconfig = {
    aws_user_pools_id: userPoolId,
    aws_user_pools_web_client_id: clientId,
};

Auth.configure(awsconfig);

Cypress.Commands.add("signIn", () => {
    cy.then(() => Auth.signIn(username, password)).then((cognitoUser) => {
        const idToken = cognitoUser.signInUserSession.idToken.jwtToken;
        const accessToken = cognitoUser.signInUserSession.accessToken.jwtToken;

        const makeKey = (name) =>
            `CognitoIdentityServiceProvider.${cognitoUser.pool.clientId}.${cognitoUser.username}.${name}`;

        cy.setLocalStorage(makeKey("accessToken"), accessToken);
        cy.setLocalStorage(makeKey("idToken"), idToken);
        cy.setLocalStorage(
            `CognitoIdentityServiceProvider.${cognitoUser.pool.clientId}.LastAuthUser`,
            cognitoUser.username
        );
    });
    cy.saveLocalStorage();
});

Cypress.Commands.add("clearTasks", () => {
    DataStore.query(models.TaskAssignee).then((tasks) => {
        console.log(tasks);
        tasks.forEach((task) => {
            DataStore.delete(models.Task, task.id);
        });
    });
    DataStore.query(models.Task).then((tasks) => {
        console.log(tasks);
        tasks.forEach((task) => {
            DataStore.delete(models.Task, task.id);
        });
    });
});

Cypress.Commands.add("populateTasks", () => {
    const promises = _.range(10).map((i) => {
        return DataStore.save(
            new models.Task({ tenantId, priority: i % 2 ? "HIGH" : "LOW" })
        );
    });
});

Cypress.Commands.add("clearDataStore", () => {
    indexedDB.deleteDatabase("amplify-datastore");
});
