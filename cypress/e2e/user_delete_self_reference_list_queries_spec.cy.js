const { queries, mutations } = require("@platelet-app/graphql");

const Amplify = require("aws-amplify").Amplify;
const API = require("aws-amplify").API;

const userPoolId = Cypress.env("userPoolId");
const clientId = Cypress.env("clientId");
const endpoint = Cypress.env("appsyncGraphqlEndpoint");
const region = Cypress.env("appsyncRegion");
const authType = Cypress.env("appsyncAuthenticationType");

Amplify.configure({
    aws_user_pools_id: userPoolId,
    aws_user_pools_web_client_id: clientId,
    aws_appsync_graphqlEndpoint: endpoint,
    aws_appsync_region: region,
    aws_appsync_authenticationType: authType,
});

// User deletion is asynchronous (Step Functions + backend cleanup), so allow
// an initial delay plus retry window (~160 seconds total worst-case).
const DELETION_INITIAL_WAIT_MS = 10000;
const DELETION_MAX_RETRIES = 30;
const DELETION_RETRY_INTERVAL_MS = 5000;
const DAILY_NOON_CRON_EXPRESSION = "0 12 * * *";
const assertNoGraphqlErrors = (response, operationName) => {
    const errors = response?.errors ?? [];
    expect(
        errors,
        `${operationName} should return no GraphQL errors`
    ).to.have.length(0);
};

describe("user deletion with self-referencing records", () => {
    let testUserId;
    let testUserUsername;
    let testUserPassword;

    before(() => {
        cy.signIn("ADMIN");
    });

    after(() => {
        cy.clearLocalStorageSnapshot();
        cy.clearLocalStorage();
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it("creates records across user relations, deletes the user, and lists related models without API errors", () => {
        const randomToken =
            globalThis.crypto?.randomUUID?.() ??
            `${Date.now()}-${Cypress._.uniqueId("selfref-")}`;
        const uniqueSuffix = `${Date.now()}-${randomToken}`;
        const tenantId = Cypress.env("tenantId");
        const dateCreated = new Date().toISOString().split("T")[0];

        testUserPassword = `SelfRef!${randomToken}aA`;

        cy.then(() =>
            API.graphql({
                query: mutations.registerUser,
                variables: {
                    name: `Self Ref User ${uniqueSuffix}`,
                    email: `self-ref-${uniqueSuffix}@platelet.app`,
                    tenantId,
                    roles: ["RIDER", "USER"],
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            assertNoGraphqlErrors(response, "registerUser");
            expect(response.data.registerUser).to.not.be.null;
            testUserId = response.data.registerUser.id;
            testUserUsername = response.data.registerUser.username;
            expect(testUserId).to.exist;
            expect(testUserUsername).to.exist;
        });

        cy.task("cognitoAdminSetUserPassword", {
            username: testUserUsername,
            password: testUserPassword,
        });

        cy.signInWithCredentials(testUserUsername, testUserPassword);

        cy.then(() =>
            API.graphql({
                query: mutations.createTask,
                variables: {
                    input: {
                        tenantId,
                        userCreatedTasksId: testUserId,
                        dateCreated,
                        status: "NEW",
                        timeOfCall: new Date().toISOString(),
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            assertNoGraphqlErrors(response, "createTask");
            expect(response.data.createTask).to.not.be.null;
            expect(response.data.createTask.id).to.exist;
        });

        cy.then(() =>
            API.graphql({
                query: mutations.createComment,
                variables: {
                    input: {
                        tenantId,
                        userCommentsId: testUserId,
                        body: "self-reference relation test comment",
                        visibility: "EVERYONE",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            assertNoGraphqlErrors(response, "createComment");
            expect(response.data.createComment).to.not.be.null;
            expect(response.data.createComment.id).to.exist;
        });

        cy.signIn("ADMIN");

        cy.then(() =>
            API.graphql({
                query: mutations.createLocation,
                variables: {
                    input: {
                        tenantId,
                        userCreatedLocationsId: testUserId,
                        name: `Self Ref Location ${uniqueSuffix}`,
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            assertNoGraphqlErrors(response, "createLocation");
            expect(response.data.createLocation).to.not.be.null;
            expect(response.data.createLocation.id).to.exist;
        });

        cy.then(() =>
            API.graphql({
                query: mutations.createVehicle,
                variables: {
                    input: {
                        tenantId,
                        userCreatedVehiclesId: testUserId,
                        name: `Self Ref Vehicle ${uniqueSuffix}`,
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            assertNoGraphqlErrors(response, "createVehicle");
            expect(response.data.createVehicle).to.not.be.null;
            expect(response.data.createVehicle.id).to.exist;
        });

        cy.then(() =>
            API.graphql({
                query: mutations.createScheduledTask,
                variables: {
                    input: {
                        tenantId,
                        userCreatedScheduledTasksId: testUserId,
                        cronExpression: DAILY_NOON_CRON_EXPRESSION,
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            assertNoGraphqlErrors(response, "createScheduledTask");
            expect(response.data.createScheduledTask).to.not.be.null;
            expect(response.data.createScheduledTask.id).to.exist;
        });

        cy.then(() =>
            API.graphql({
                query: mutations.disableUser,
                variables: { userId: testUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            assertNoGraphqlErrors(response, "disableUser");
            expect(response.data.disableUser.disabled).to.equal(1);
        });

        cy.then(() =>
            API.graphql({
                query: mutations.adminDeleteUser,
                variables: { userId: testUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            assertNoGraphqlErrors(response, "adminDeleteUser");
            expect(response.data.adminDeleteUser.executionArn).to.exist;
        });

        cy.wait(DELETION_INITIAL_WAIT_MS);
        cy.then(async () => {
            for (
                let attempt = 1;
                attempt <= DELETION_MAX_RETRIES;
                attempt++
            ) {
                const response = await API.graphql({
                    query: queries.getUser,
                    variables: { id: testUserId },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                });

                assertNoGraphqlErrors(response, "getUser");

                if (!response.data.getUser || response.data.getUser._deleted) {
                    return;
                }
                await Cypress.Promise.delay(DELETION_RETRY_INTERVAL_MS);
            }

            const totalWaitMs =
                DELETION_INITIAL_WAIT_MS +
                DELETION_MAX_RETRIES * DELETION_RETRY_INTERVAL_MS;
            throw new Error(
                `Timed out waiting for user deletion for userId=${testUserId}, username=${testUserUsername} after ${DELETION_MAX_RETRIES} attempts (~${totalWaitMs}ms total wait)`
            );
        });

        cy.then(() =>
            API.graphql({
                query: queries.listUsers,
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            assertNoGraphqlErrors(response, "listUsers");
            expect(response.data.listUsers).to.exist;
        });

        cy.then(() =>
            API.graphql({
                query: queries.listTasks,
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            assertNoGraphqlErrors(response, "listTasks");
            expect(response.data.listTasks).to.exist;
        });

        cy.then(() =>
            API.graphql({
                query: queries.listTasksByTenantId,
                variables: { tenantId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            assertNoGraphqlErrors(response, "listTasksByTenantId");
            expect(response.data.listTasksByTenantId).to.exist;
        });

        cy.then(() =>
            API.graphql({
                query: queries.listLocations,
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            assertNoGraphqlErrors(response, "listLocations");
            expect(response.data.listLocations).to.exist;
        });

        cy.then(() =>
            API.graphql({
                query: queries.listVehicles,
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            assertNoGraphqlErrors(response, "listVehicles");
            expect(response.data.listVehicles).to.exist;
        });

        cy.then(() =>
            API.graphql({
                query: queries.listScheduledTasks,
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            assertNoGraphqlErrors(response, "listScheduledTasks");
            expect(response.data.listScheduledTasks).to.exist;
        });

        cy.then(() =>
            API.graphql({
                query: queries.listComments,
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            assertNoGraphqlErrors(response, "listComments");
            expect(response.data.listComments).to.exist;
        });
    });
});
