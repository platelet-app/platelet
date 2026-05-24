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

describe("User Disable/Enable End-to-End Test", () => {
    let testUserId;
    let testUserUsername;

    before(() => {
        cy.signIn("ADMIN");
    });

    after(() => {
        cy.restoreLocalStorage();
        if (testUserId) {
            cy.then(() =>
                API.graphql({
                    query: mutations.disableUser,
                    variables: { userId: testUserId },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                }).catch(() => {})
            ).then(() =>
                API.graphql({
                    query: mutations.adminDeleteUser,
                    variables: { userId: testUserId },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                }).catch((err) => {
                    cy.log(
                        "Test user cleanup failed (non-fatal):",
                        err?.message ?? err
                    );
                })
            );
        }
        cy.clearLocalStorageSnapshot();
        cy.clearLocalStorage();
    });

    beforeEach(() => {
        cy.restoreLocalStorage();
    });

    afterEach(() => {
        cy.saveLocalStorage();
    });

    it("should create a test user", () => {
        const timestamp = Date.now();

        cy.then(() =>
            API.graphql({
                query: mutations.registerUser,
                variables: {
                    name: `Test DisableEnable ${timestamp}`,
                    email: `test-disable-${timestamp}@platelet.app`,
                    tenantId: Cypress.env("tenantId"),
                    roles: ["RIDER", "USER"],
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.registerUser).to.not.be.null;
            testUserId = response.data.registerUser.id;
            testUserUsername = response.data.registerUser.username;
            expect(testUserId).to.exist;
            expect(testUserUsername).to.exist;
            cy.log("Created user with ID:", testUserId);
        });
    });

    it("should disable the test user", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.disableUser,
                variables: { userId: testUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.disableUser).to.not.be.null;
            expect(response.data.disableUser.id).to.equal(testUserId);
            expect(response.data.disableUser.disabled).to.equal(1);
            cy.log("Disabled user:", testUserId);
        });
    });

    it("should verify user is disabled in DynamoDB", () => {
        cy.then(() =>
            API.graphql({
                query: queries.getUser,
                variables: { id: testUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.getUser).to.not.be.null;
            expect(response.data.getUser.disabled).to.equal(1);
            cy.log("Verified user is disabled in DynamoDB");
        });
    });

    it("should verify user is disabled in Cognito", () => {
        cy.task("cognitoAdminGetUser", { username: testUserUsername }).then(
            (result) => {
                expect(result.exists).to.equal(true);
                expect(result.enabled).to.equal(false);
                cy.log("Verified user is disabled in Cognito");
            }
        );
    });

    it("should enable the test user", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.enableUser,
                variables: { userId: testUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.enableUser).to.not.be.null;
            expect(response.data.enableUser.id).to.equal(testUserId);
            expect(response.data.enableUser.disabled).to.not.equal(1);
            cy.log("Enabled user:", testUserId);
        });
    });

    it("should verify user is enabled in DynamoDB", () => {
        cy.then(() =>
            API.graphql({
                query: queries.getUser,
                variables: { id: testUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.getUser).to.not.be.null;
            expect(response.data.getUser.disabled).to.not.equal(1);
            cy.log("Verified user is enabled in DynamoDB");
        });
    });

    it("should verify user is enabled in Cognito", () => {
        cy.task("cognitoAdminGetUser", { username: testUserUsername }).then(
            (result) => {
                expect(result.exists).to.equal(true);
                expect(result.enabled).to.equal(true);
                cy.log("Verified user is enabled in Cognito");
            }
        );
    });
});
