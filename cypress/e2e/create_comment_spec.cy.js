/**
 * Tests for createComment access control:
 *
 *   1. A user CAN create a comment attributed to themselves.
 *   2. A user CANNOT create a comment attributed to a different user
 *      (postAuth resolver compares userCommentsId.cognitoId vs caller sub).
 *
 * The author-mismatch check lives in:
 *   amplify/backend/api/platelet/resolvers/Mutation.createComment.postAuth.2.res.vtl
 */

const Amplify = require("aws-amplify").Amplify;
const API = require("aws-amplify").API;
const Auth = require("aws-amplify").Auth;
const { mutations, queries } = require("@platelet-app/graphql");

const userPoolId = Cypress.env("userPoolId");
const clientId = Cypress.env("clientId");
const endpoint = Cypress.env("appsyncGraphqlEndpoint");
const region = Cypress.env("appsyncRegion");

Amplify.configure({
    aws_user_pools_id: userPoolId,
    aws_user_pools_web_client_id: clientId,
    aws_appsync_graphqlEndpoint: endpoint,
    aws_appsync_region: region,
    aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
});

describe("createComment access control", () => {
    let otherUserId;
    let createdCommentId;
    let createdCommentVersion;

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

    it("creates a second test user to use as the mismatched author", () => {
        const timestamp = Date.now();

        cy.then(() =>
            API.graphql({
                query: mutations.registerUser,
                variables: {
                    name: `Test Comment Author User ${timestamp}`,
                    email: `test-comment-author-${timestamp}@platelet.app`,
                    tenantId: Cypress.env("tenantId"),
                    roles: ["RIDER", "USER"],
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.registerUser).to.not.be.null;
            otherUserId = response.data.registerUser.id;
            expect(otherUserId).to.exist;
            cy.log("Created other user:", otherUserId);
        });
    });

    it("allows createComment when userCommentsId belongs to the caller", () => {
        cy.then(() => Auth.currentAuthenticatedUser())
            .then((cognitoUser) => {
                const cognitoId = cognitoUser.attributes.sub;
                return API.graphql({
                    query: queries.getUserByCognitoId,
                    variables: {
                        cognitoId,
                    },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                });
            })
            .then((response) => {
                const adminUserId =
                    response.data.getUserByCognitoId.items[0].id;
                expect(adminUserId).to.exist;
                return API.graphql({
                    query: mutations.createComment,
                    variables: {
                        input: {
                            tenantId: Cypress.env("tenantId"),
                            userCommentsId: adminUserId,
                            body: "valid comment from admin user",
                            visibility: "EVERYONE",
                        },
                    },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                });
            })
            .then((response) => {
                expect(response.data.createComment).to.not.be.null;
                createdCommentId = response.data.createComment.id;
                createdCommentVersion = response.data.createComment._version;
                expect(createdCommentId).to.exist;
                cy.log("Created comment:", createdCommentId);
            });
    });

    it("denies createComment when userCommentsId belongs to a different user than the caller", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.createComment,
                variables: {
                    input: {
                        tenantId: Cypress.env("tenantId"),
                        userCommentsId: otherUserId,
                        body: "comment created by the wrong user",
                        visibility: "EVERYONE",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(result.errors, "createComment should return errors").to
                .exist;
            const error = result.errors[0];
            expect(error.errorType).to.equal("NotAuthorizedError");
            expect(error.message).to.equal(
                "You cannot create a comment for someone else."
            );
        });
    });

    it("cleans up: deletes the test comment and the other user", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.deleteComment,
                variables: { input: { id: createdCommentId, _version: createdCommentVersion } },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.deleteComment.id).to.equal(createdCommentId);
            cy.log("Comment deleted");
        });

        cy.then(() =>
            API.graphql({
                query: mutations.disableUser,
                variables: { userId: otherUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.disableUser.disabled).to.equal(1);
            cy.log("Other user disabled");
        });

        cy.then(() =>
            API.graphql({
                query: mutations.adminDeleteUser,
                variables: { userId: otherUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.adminDeleteUser.executionArn).to.exist;
            cy.log(
                "Other user deletion started:",
                response.data.adminDeleteUser.executionArn
            );
        });
    });
});
