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
import { aliasMutation } from "../utils/graphql-test-utils";

const Auth = require("aws-amplify").Auth;
const Amplify = require("aws-amplify").Amplify;
const DataStore = require("aws-amplify").DataStore;
const models = require("../../src/models");

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

Cypress.Commands.add("signIn", (role) => {
    let username = Cypress.env("adminusername");
    let password = Cypress.env("adminpassword");
    if (role === "RIDER") {
        username = Cypress.env("riderusername");
        password = Cypress.env("riderpassword");
    } else if (role === "COORDINATOR") {
        username = Cypress.env("coordusername");
        password = Cypress.env("coordpassword");
    }
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

        cy.then(() =>
            API.graphql({
                query: queries.getUserByCognitoId,
                variables: { cognitoId: cognitoUser.attributes.sub },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            const items = response.data.getUserByCognitoId.items;
            if (items.length > 0) {
                Cypress.env("tenantId", items[0].tenantId);
            }
        });
    });
    cy.saveLocalStorage();
});

/**
 * Sign in as any Cognito user given explicit credentials.
 * Use this when tests need to act as a non-fixture user (e.g. a freshly
 * registered test user). Signs out any current session first, then signs in
 * and persists the tokens so subsequent API calls use this identity.
 * Call cy.signIn("ADMIN") afterwards to restore the admin session.
 */
Cypress.Commands.add("signInWithCredentials", (username, password) => {
    cy.then(() => Auth.signOut().catch(() => {}));
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
    cy.intercept("POST", endpoint, (req) => {
        aliasMutation(req, "updateTask");
    });
    cy.get(`[data-cy=${status}-title-skeleton]`, { timeout: 10000 })
        .should("not.exist")
        .then(() => {
            cy.get(".MuiPaper-root")
                .should("be.visible")
                .then(() => {
                    if (
                        Cypress.$(
                            `[data-testid=tasks-kanban-column-${status}]:empty`
                        ).length === 1
                    )
                        return;

                    cy.get(`[data-testid=${status}-select-all]`).click();
                    cy.get('[aria-label="Selection Cancelled"]').click({
                        force: true,
                    });
                    cy.get("[data-testid=confirmation-ok-button]").click();
                    cy.get("[data-testid=confirmation-ok-button]").then(
                        (el) => {
                            if (el.length > 0) {
                                cy.get("[data-testid=confirmation-ok-button]")
                                    .eq(1)
                                    .click();
                            }
                        }
                    );
                    cy.get(
                        `[data-testid=tasks-kanban-column-${status}]`
                    ).should("be.empty");
                    // wait for updateTask to be called for each task
                    cy.wait(`@gqlupdateTaskMutation`, { timeout: 10000 }).then(
                        (interception) => {
                            expect(interception.response.statusCode).to.equal(
                                200
                            );
                        }
                    );
                });
        });
});

Cypress.Commands.add("populateTasks", () => {
    for (const i of _.range(1, 5)) {
        cy.get("[data-cy=create-task-button]").click();
        cy.get("[data-testid=guided-setup-notes-tab]").click();
        cy.get(
            i > 2
                ? "[data-cy=new-task-priority-MEDIUM]"
                : "[data-cy=new-task-priority-LOW]"
        ).click();
        cy.get("[data-cy=save-to-dash-button]").click();
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

const API = require("aws-amplify").API;
const { queries } = require("@platelet-app/graphql");

/**
 * Execute a GraphQL query or mutation via Cognito user pool auth.
 * Returns a Cypress chainable that resolves to the full API response.
 * GraphQL errors cause the promise to reject — use .catch() or wrap in
 * cy.then(() => promise.catch(e => e)) to inspect errors.
 */
Cypress.Commands.add("cognitoGraphqlRequest", (query, variables) => {
    return cy.then(() =>
        API.graphql({
            query,
            variables,
            authMode: "AMAZON_COGNITO_USER_POOLS",
        })
    );
});

/**
 * Execute a GraphQL mutation signed with AWS IAM credentials via cy.task.
 * Use this when the operation requires IAM permissions not available to
 * Cognito-authenticated users (e.g. setting isBeingDeleted on a User).
 *
 * Credentials are resolved from the standard AWS chain (AWS_ACCESS_KEY_ID env
 * vars, ~/.aws/credentials profiles, AWS SSO, etc.) — no cypress.env.json
 * entries required. The caller must have appsync:GraphQL permission on the API.
 *
 * Returns a Cypress chainable that resolves to the raw AppSync JSON response
 * ({ data, errors }). Errors are surfaced in the response rather than thrown.
 */
Cypress.Commands.add("iamGraphqlMutation", (query, variables) => {
    return cy.task("iamGraphqlMutation", { query, variables });
});

/**
 * Execute a GraphQL query signed with AWS IAM credentials via cy.task.
 * Same behaviour as iamGraphqlMutation but semantically for read operations.
 */
Cypress.Commands.add("iamGraphqlRequest", (query, variables) => {
    return cy.task("iamGraphqlRequest", { query, variables });
});
