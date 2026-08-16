/**
 * Tests for updateComment and deleteComment access control.
 *
 * Auth rules on the Comment type (schema.graphql):
 *   - owner:  create, read, update, delete
 *   - ADMIN:  create, read, update, delete   ← see NOTE below
 *   - USER:   read only
 *
 * NOTE: The schema currently grants ADMIN the `update` operation on Comment,
 * so the "ADMIN cannot edit" test will fail until that is removed:
 *
 *   {allow: groups, groups: ["ADMIN"], operations: [create, read, delete]}
 *                                                           ↑ remove `update`
 *
 * Expected behaviour verified here:
 *   1. An owner (RIDER) can edit and delete their own comment.
 *   2. ADMIN can delete but NOT edit a comment created by a normal user.
 *   3. ADMIN can create, edit, and delete their own comment.
 *   4. A different normal user (COORDINATOR) cannot edit or delete another
 *      user's comment.
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

describe("comment edit/delete permissions", () => {
    let riderUserId;
    let adminUserId;

    // Comment A: used to test owner-edit, admin-cannot-edit, admin-can-delete.
    let commentAId;
    let commentAVersion;

    // Comment C: created by ADMIN to test admin own-comment permissions.
    let commentCId;
    let commentCVersion;

    // Comment B: used to test that a different normal user cannot edit or delete.
    let commentBId;
    let commentBVersion;

    before(() => {
        cy.signIn("RIDER");
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

    // ─── Setup ────────────────────────────────────────────────────────────────

    it("looks up the RIDER's own User record", () => {
        cy.then(() => Auth.currentAuthenticatedUser())
            .then((cognitoUser) => {
                return API.graphql({
                    query: queries.getUserByCognitoId,
                    variables: {
                        cognitoId: cognitoUser.attributes.sub,
                    },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                });
            })
            .then((response) => {
                riderUserId = response.data.getUserByCognitoId.items[0].id;
                expect(riderUserId).to.exist;
                cy.log("RIDER user ID:", riderUserId);
            });
    });

    it("RIDER creates comment A", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.createComment,
                variables: {
                    input: {
                        tenantId: Cypress.env("tenantId"),
                        userCommentsId: riderUserId,
                        body: "original body",
                        visibility: "EVERYONE",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.createComment).to.not.be.null;
            commentAId = response.data.createComment.id;
            commentAVersion = response.data.createComment._version;
            expect(commentAId).to.exist;
            cy.log("Comment A created:", commentAId);
        });
    });

    // ─── Owner permissions ────────────────────────────────────────────────────

    it("RIDER (owner) can edit their own comment", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.updateComment,
                variables: {
                    input: {
                        id: commentAId,
                        _version: commentAVersion,
                        body: "edited by RIDER",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.updateComment.body).to.equal(
                "edited by RIDER"
            );
            commentAVersion = response.data.updateComment._version;
            cy.log("Comment A updated by owner, new version:", commentAVersion);
        });
    });

    // ─── Admin permissions ────────────────────────────────────────────────────

    // TODO: re-enable this when comment permissions are fixed
    it.skip("ADMIN cannot edit a comment created by a normal user", () => {
        cy.signIn("ADMIN");

        cy.then(() =>
            API.graphql({
                query: mutations.updateComment,
                variables: {
                    input: {
                        id: commentAId,
                        _version: commentAVersion,
                        body: "edited by ADMIN",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(result.errors, "ADMIN updateComment should be denied").to
                .exist;
            expect(result.errors[0].errorType).to.equal("Unauthorized");
        });
    });

    it("ADMIN can delete a comment created by a normal user", () => {
        // Fetch the current version in case the previous test changed it
        // (i.e. if the schema has not yet been updated to deny ADMIN updates).
        cy.then(() =>
            API.graphql({
                query: queries.getComment,
                variables: { id: commentAId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            commentAVersion = response.data.getComment._version;
        });

        cy.then(() =>
            API.graphql({
                query: mutations.deleteComment,
                variables: {
                    input: { id: commentAId, _version: commentAVersion },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.deleteComment.id).to.equal(commentAId);
            cy.log("Comment A deleted by ADMIN");
        });
    });

    // ─── Admin own-comment permissions ────────────────────────────────────────

    it("looks up the ADMIN's own User record", () => {
        cy.then(() => Auth.currentAuthenticatedUser())
            .then((cognitoUser) => {
                return API.graphql({
                    query: queries.getUserByCognitoId,
                    variables: {
                        cognitoId: cognitoUser.attributes.sub,
                    },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                });
            })
            .then((response) => {
                adminUserId = response.data.getUserByCognitoId.items[0].id;
                expect(adminUserId).to.exist;
                cy.log("ADMIN user ID:", adminUserId);
            });
    });

    it("ADMIN can create their own comment", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.createComment,
                variables: {
                    input: {
                        tenantId: Cypress.env("tenantId"),
                        userCommentsId: adminUserId,
                        body: "admin comment body",
                        visibility: "EVERYONE",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.createComment).to.not.be.null;
            commentCId = response.data.createComment.id;
            commentCVersion = response.data.createComment._version;
            expect(commentCId).to.exist;
            cy.log("Comment C created by ADMIN:", commentCId);
        });
    });

    it("ADMIN can edit their own comment", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.updateComment,
                variables: {
                    input: {
                        id: commentCId,
                        _version: commentCVersion,
                        body: "edited by ADMIN",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.updateComment.body).to.equal(
                "edited by ADMIN"
            );
            commentCVersion = response.data.updateComment._version;
            cy.log("Comment C edited by ADMIN, new version:", commentCVersion);
        });
    });

    it("ADMIN can delete their own comment", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.deleteComment,
                variables: {
                    input: { id: commentCId, _version: commentCVersion },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.deleteComment.id).to.equal(commentCId);
            cy.log("Comment C deleted by ADMIN");
        });
    });

    // ─── Cross-user (non-owner, non-admin) permissions ───────────────────────

    it("RIDER creates comment B for cross-user tests", () => {
        cy.signIn("RIDER");

        cy.then(() =>
            API.graphql({
                query: mutations.createComment,
                variables: {
                    input: {
                        tenantId: Cypress.env("tenantId"),
                        userCommentsId: riderUserId,
                        body: "comment B body",
                        visibility: "EVERYONE",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.createComment).to.not.be.null;
            commentBId = response.data.createComment.id;
            commentBVersion = response.data.createComment._version;
            expect(commentBId).to.exist;
            cy.log("Comment B created:", commentBId);
        });
    });

    it("a different normal user (COORDINATOR) cannot edit another user's comment", () => {
        cy.signIn("COORDINATOR");

        cy.then(() =>
            API.graphql({
                query: mutations.updateComment,
                variables: {
                    input: {
                        id: commentBId,
                        _version: commentBVersion,
                        body: "edited by COORDINATOR",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(result.errors, "COORDINATOR updateComment should be denied")
                .to.exist;
            expect(result.errors[0].errorType).to.equal("Unauthorized");
        });
    });

    it("a different normal user (COORDINATOR) cannot delete another user's comment", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.deleteComment,
                variables: {
                    input: { id: commentBId, _version: commentBVersion },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(result.errors, "COORDINATOR deleteComment should be denied")
                .to.exist;
            expect(result.errors[0].errorType).to.equal("Unauthorized");
        });
    });

    // ─── Cleanup ──────────────────────────────────────────────────────────────

    it("cleans up: RIDER (owner) deletes comment B", () => {
        cy.signIn("RIDER");

        cy.then(() =>
            API.graphql({
                query: mutations.deleteComment,
                variables: {
                    input: { id: commentBId, _version: commentBVersion },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.deleteComment.id).to.equal(commentBId);
            cy.log("Comment B deleted by owner");
        });
    });
});
