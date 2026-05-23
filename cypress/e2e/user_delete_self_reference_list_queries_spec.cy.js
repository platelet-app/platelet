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

    it("creates a user, creates a self-referencing task, deletes the user, and lists related models without API errors", () => {
        const uniqueSuffix = `${Date.now()}-${Cypress._.random(100000, 999999)}`;
        const tenantId = Cypress.env("tenantId");
        const dateCreated = new Date().toISOString().split("T")[0];

        testUserPassword = `SelfRef${Date.now()}!A`;

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
            expect(response.errors, "registerUser should not return errors").to.be
                .undefined;
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
            expect(response.errors, "createTask should not return errors").to.be
                .undefined;
            expect(response.data.createTask).to.not.be.null;
            expect(response.data.createTask.id).to.exist;
        });

        cy.signIn("ADMIN");

        cy.then(() =>
            API.graphql({
                query: mutations.disableUser,
                variables: { userId: testUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.errors, "disableUser should not return errors").to.be
                .undefined;
            expect(response.data.disableUser.disabled).to.equal(1);
        });

        cy.then(() =>
            API.graphql({
                query: mutations.adminDeleteUser,
                variables: { userId: testUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(
                response.errors,
                "adminDeleteUser should not return errors"
            ).to.be.undefined;
            expect(response.data.adminDeleteUser.executionArn).to.exist;
        });

        cy.wait(DELETION_INITIAL_WAIT_MS);
        cy.then(async () => {
            for (
                let attemptNumber = 1;
                attemptNumber <= DELETION_MAX_RETRIES;
                attemptNumber++
            ) {
                const response = await API.graphql({
                    query: queries.getUser,
                    variables: { id: testUserId },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                });

                expect(response.errors, "getUser should not return errors").to.be
                    .undefined;

                if (!response.data.getUser || response.data.getUser._deleted) {
                    return;
                }
                await Cypress.Promise.delay(DELETION_RETRY_INTERVAL_MS);
            }

            const totalWaitMs =
                DELETION_INITIAL_WAIT_MS +
                DELETION_MAX_RETRIES * DELETION_RETRY_INTERVAL_MS;
            throw new Error(
                `Timed out waiting for user deletion after ${DELETION_MAX_RETRIES} attempts (up to ~${totalWaitMs}ms total wait)`
            );
        });

        cy.then(() =>
            API.graphql({
                query: queries.listUsers,
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.errors, "listUsers should not return errors").to.be
                .undefined;
            expect(response.data.listUsers).to.exist;
        });

        cy.then(() =>
            API.graphql({
                query: queries.listTasks,
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.errors, "listTasks should not return errors").to.be
                .undefined;
            expect(response.data.listTasks).to.exist;
        });

        cy.then(() =>
            API.graphql({
                query: queries.listTasksByTenantId,
                variables: { tenantId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(
                response.errors,
                "listTasksByTenantId should not return errors"
            ).to.be.undefined;
            expect(response.data.listTasksByTenantId).to.exist;
        });
    });
});
