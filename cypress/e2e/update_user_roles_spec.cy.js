const { mutations, queries } = require("@platelet-app/graphql");

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

describe("updateUserRoles", () => {
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
                }).catch((err) => {
                    cy.log("disable cleanup failed (non-fatal):", err?.message ?? err);
                })
            ).then(() =>
                API.graphql({
                    query: mutations.adminDeleteUser,
                    variables: { userId: testUserId },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                }).catch((err) => {
                    cy.log("delete cleanup failed (non-fatal):", err?.message ?? err);
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

    it("should create a test user with RIDER role", () => {
        const timestamp = Date.now();
        const email = `test-roles-${timestamp}@platelet.app`;
        const name = `Test Roles User ${timestamp}`;

        cy.then(() =>
            API.graphql({
                query: mutations.registerUser,
                variables: {
                    name,
                    email,
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
            expect(response.data.registerUser.roles).to.include("RIDER");
            expect(response.data.registerUser.roles).to.include("USER");
            cy.log("Created user:", testUserId, "username:", testUserUsername);
        });
    });

    it("should update the user's roles to COORDINATOR and USER", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.updateUserRoles,
                variables: {
                    userId: testUserId,
                    roles: ["COORDINATOR", "USER"],
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            const updated = response.data.updateUserRoles;
            expect(updated).to.not.be.null;
            expect(updated.id).to.equal(testUserId);
            expect(updated.roles).to.include("COORDINATOR");
            expect(updated.roles).to.include("USER");
            expect(updated.roles).to.not.include("RIDER");
            cy.log("updateUserRoles response roles:", updated.roles);
        });
    });

    it("should confirm the updated roles via getUser query", () => {
        cy.then(() =>
            API.graphql({
                query: queries.getUser,
                variables: { id: testUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            const user = response.data.getUser;
            expect(user).to.not.be.null;
            expect(user.roles).to.include("COORDINATOR");
            expect(user.roles).to.include("USER");
            expect(user.roles).to.not.include("RIDER");
            cy.log("getUser confirmed roles:", user.roles);
        });
    });

    it("should confirm the user is in the COORDINATOR Cognito group", () => {
        cy.task("cognitoAdminListGroupsForUser", {
            username: testUserUsername,
        }).then((groups) => {
            cy.log("Cognito groups:", groups);
            expect(groups).to.include("COORDINATOR");
        });
    });

    it("should confirm the user is NOT in the RIDER Cognito group", () => {
        cy.task("cognitoAdminListGroupsForUser", {
            username: testUserUsername,
        }).then((groups) => {
            expect(groups).to.not.include("RIDER");
        });
    });

    it("RIDER should not be able to update user roles", () => {
        cy.signIn("RIDER");

        cy.then(() =>
            API.graphql({
                query: mutations.updateUserRoles,
                variables: {
                    userId: testUserId,
                    roles: ["RIDER", "USER"],
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(result.errors, "RIDER updateUserRoles should be denied").to
                .exist;
            expect(result.errors[0].errorType).to.equal("Unauthorized");
        });

        cy.signIn("ADMIN");
    });

    it("COORDINATOR should not be able to update user roles", () => {
        cy.signIn("COORDINATOR");

        cy.then(() =>
            API.graphql({
                query: mutations.updateUserRoles,
                variables: {
                    userId: testUserId,
                    roles: ["RIDER", "USER"],
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(result.errors, "COORDINATOR updateUserRoles should be denied")
                .to.exist;
            expect(result.errors[0].errorType).to.equal("Unauthorized");
        });

        cy.signIn("ADMIN");
    });
});
