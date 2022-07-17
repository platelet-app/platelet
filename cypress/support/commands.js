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
import { syncExpression } from "aws-amplify";
import "cypress-localstorage-commands";
import _ from "lodash";
import "@testing-library/cypress/add-commands";
import "./auth-provider-commands/cognito";

const Auth = require("aws-amplify").Auth;
const Amplify = require("aws-amplify").Amplify;
const DataStore = require("aws-amplify").DataStore;
const models = require("../../src/models");

const username = Cypress.env("username");
const password = Cypress.env("password");
const userPoolId = Cypress.env("userPoolId");
const clientId = Cypress.env("clientId");
const tenantId = Cypress.env("tenantId");
const endpoint = Cypress.env("appsyncGraphqlEndpoint");
const region = Cypress.env("appsyncRegion");
const authType = Cypress.env("appsyncAuthenticationType");

const awsconfig = {
    aws_user_pools_id: userPoolId,
    aws_user_pools_web_client_id: clientId,
    aws_appsync_graphqlEndpoint: endpoint,
    aws_appsync_region: region,
    aws_appsync_authenticationType: authType,
};

Amplify.configure(awsconfig);

const modelsToSync = [];
for (const model of Object.values(models)) {
    if (
        [
            "Task",
            "User",
            "TaskAssignee",
            "RiderResponsibility",
            "Comment",
            "Location",
            "Vehicle",
            "Deliverable",
            "DeliverableType",
        ].includes(model.name)
    ) {
        modelsToSync.push(model);
    }
}

const COMMAND_DELAY = Cypress.env("COMMAND_DELAY") || 0;
if (COMMAND_DELAY > 0) {
    for (const command of [
        "visit",
        "click",
        "trigger",
        "type",
        "clear",
        "reload",
        "contains",
    ]) {
        Cypress.Commands.overwrite(command, (originalFn, ...args) => {
            const origVal = originalFn(...args);

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(origVal);
                }, COMMAND_DELAY);
            });
        });
    }
}

DataStore.configure({
    syncExpressions: [
        ...modelsToSync.map((model) =>
            syncExpression(model, (m) => m.tenantId("eq", tenantId))
        ),
        syncExpression(models.Tenant, (m) => m.id("eq", tenantId)),
    ],
});

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

Cypress.Commands.add("clearTasks", (status) => {
    // iterate through all tasks and mark them cancelled
    cy.visit("/");
    cy.get(`[data-cy=${status}-title-skeleton]`, { timeout: 10000 })
        .should("not.exist")
        .then(() => {
            cy.get(".MuiPaper-root")
                .should("be.visible")
                .then(() => {
                    if (
                        Cypress.$(
                            `[data-cy=tasks-kanban-column-${status}]:empty`
                        ).length === 1
                    )
                        return;
                    cy.get(`[data-cy=tasks-kanban-column-${status}]`)
                        .children()
                        .each((el) => {
                            cy.get(el).click();
                            cy.get(
                                "[data-cy=task-timeCancelled-button"
                            ).click();
                            cy.get("[data-cy=confirmation-ok-button").click();
                            cy.get("[data-cy=task-status-close").click();
                        });
                });
        });
});

Cypress.Commands.add("populateTasks", () => {
    for (const i of _.range(1, 5)) {
        cy.get("[data-cy=create-task-button").click();
        cy.get(
            i > 2
                ? "[data-cy=new-task-priority-MEDIUM"
                : "[data-cy=new-task-priority-LOW"
        ).click();
        cy.get("[data-cy=save-to-dash-button").click();
    }
});

Cypress.Commands.add("clearDataStore", () => {
    indexedDB.deleteDatabase("amplify-datastore");
});

Cypress.Commands.add("addSingleTask", () => {
    cy.get("[data-cy=NEW-title-skeleton]", { timeout: 10000 }).should(
        "not.exist"
    );
    cy.get(".MuiPaper-root").should("be.visible");
    cy.get("[data-cy=create-task-button]").click();
    cy.get("[data-cy=save-to-dash-button]").click();
});
