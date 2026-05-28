/**
 * Tests for User model field-level access control.
 *
 * Auth rules on the User type (schema.graphql):
 *
 *   contact / displayName / name / dateOfBirth / profilePicture:
 *     - ADMIN:  read, update
 *     - owner (cognitoId): read, update
 *     - private: read only
 *
 *   riderResponsibility:
 *     - ADMIN, COORDINATOR: read, update, delete
 *     - owner (cognitoId): read, update, delete
 *     - private: read only
 *
 *   roles: read only for everyone — updates must go through the
 *          updateUserRoles Lambda mutation, never directly.
 *
 * Expected behaviour verified here:
 *   1. COORDINATOR can update riderResponsibility on another user's record.
 *   2. COORDINATOR cannot update ADMIN/owner-only fields (displayName, name,
 *      dateOfBirth) on another user's record.
 *   3. RIDER (owner) can update all their own editable fields.
 *   4. RIDER (non-owner, non-coordinator) cannot update another user's
 *      riderResponsibility.
 *   5. ADMIN can update riderResponsibility, displayName, and dateOfBirth on
 *      any user's record.
 *   6. No one can directly update roles via updateUser.
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

describe("User model field-level permissions", () => {
    let riderUserId;
    let riderUserVersion;
    let coordinatorUserId;
    let coordinatorUserVersion;

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

    it("looks up the RIDER's User record", () => {
        cy.then(() => Auth.currentAuthenticatedUser())
            .then((cognitoUser) =>
                API.graphql({
                    query: queries.getUserByCognitoId,
                    variables: { cognitoId: cognitoUser.attributes.sub },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                })
            )
            .then((response) => {
                const user = response.data.getUserByCognitoId.items[0];
                riderUserId = user.id;
                riderUserVersion = user._version;
                expect(riderUserId).to.exist;
                cy.log("RIDER user ID:", riderUserId);
            });
    });

    it("looks up the COORDINATOR's User record", () => {
        cy.signIn("COORDINATOR");

        cy.then(() => Auth.currentAuthenticatedUser())
            .then((cognitoUser) =>
                API.graphql({
                    query: queries.getUserByCognitoId,
                    variables: { cognitoId: cognitoUser.attributes.sub },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                })
            )
            .then((response) => {
                const user = response.data.getUserByCognitoId.items[0];
                coordinatorUserId = user.id;
                coordinatorUserVersion = user._version;
                expect(coordinatorUserId).to.exist;
                cy.log("COORDINATOR user ID:", coordinatorUserId);
            });
    });

    // ─── COORDINATOR permissions ───────────────────────────────────────────────

    it("COORDINATOR can update riderResponsibility on another user's record", () => {
        cy.then(() =>
            API.graphql({
                query: queries.getUser,
                variables: { id: riderUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            riderUserVersion = response.data.getUser._version;
        });

        cy.then(() =>
            API.graphql({
                query: mutations.updateUser,
                variables: {
                    input: {
                        id: riderUserId,
                        _version: riderUserVersion,
                        riderResponsibility: "coordinator-assigned",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.updateUser.riderResponsibility).to.equal(
                "coordinator-assigned"
            );
            riderUserVersion = response.data.updateUser._version;
            cy.log("COORDINATOR updated riderResponsibility on RIDER record");
        });
    });

    it("COORDINATOR cannot update displayName on another user's record", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.updateUser,
                variables: {
                    input: {
                        id: riderUserId,
                        _version: riderUserVersion,
                        displayName: "hacked display name",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(
                result.errors,
                "COORDINATOR updateUser displayName should be denied"
            ).to.exist;
            expect(result.errors[0].errorType).to.equal("Unauthorized");
        });
    });

    it("COORDINATOR cannot update name on another user's record", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.updateUser,
                variables: {
                    input: {
                        id: riderUserId,
                        _version: riderUserVersion,
                        name: "hacked name",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(
                result.errors,
                "COORDINATOR updateUser name should be denied"
            ).to.exist;
            expect(result.errors[0].errorType).to.equal("Unauthorized");
        });
    });

    it("COORDINATOR cannot update dateOfBirth on another user's record", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.updateUser,
                variables: {
                    input: {
                        id: riderUserId,
                        _version: riderUserVersion,
                        dateOfBirth: "2000-01-01",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(
                result.errors,
                "COORDINATOR updateUser dateOfBirth should be denied"
            ).to.exist;
            expect(result.errors[0].errorType).to.equal("Unauthorized");
        });
    });

    // ─── RIDER (owner) permissions ────────────────────────────────────────────

    it("RIDER (owner) can update their own riderResponsibility", () => {
        cy.signIn("RIDER");

        cy.then(() =>
            API.graphql({
                query: queries.getUser,
                variables: { id: riderUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            riderUserVersion = response.data.getUser._version;
        });

        cy.then(() =>
            API.graphql({
                query: mutations.updateUser,
                variables: {
                    input: {
                        id: riderUserId,
                        _version: riderUserVersion,
                        riderResponsibility: "self-assigned",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.updateUser.riderResponsibility).to.equal(
                "self-assigned"
            );
            riderUserVersion = response.data.updateUser._version;
        });
    });

    it("RIDER (owner) can update their own displayName", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.updateUser,
                variables: {
                    input: {
                        id: riderUserId,
                        _version: riderUserVersion,
                        displayName: "Owner Updated Name",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.updateUser.displayName).to.equal(
                "Owner Updated Name"
            );
            riderUserVersion = response.data.updateUser._version;
        });
    });

    it("RIDER (owner) can update their own name", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.updateUser,
                variables: {
                    input: {
                        id: riderUserId,
                        _version: riderUserVersion,
                        name: "Owner Updated Name",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.updateUser.name).to.equal("Owner Updated Name");
            riderUserVersion = response.data.updateUser._version;
        });
    });

    it("RIDER (owner) can update their own dateOfBirth", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.updateUser,
                variables: {
                    input: {
                        id: riderUserId,
                        _version: riderUserVersion,
                        dateOfBirth: "1990-06-15",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.updateUser.dateOfBirth).to.equal("1990-06-15");
            riderUserVersion = response.data.updateUser._version;
        });
    });

    // ─── RIDER (non-owner) cannot update another user ─────────────────────────

    it("RIDER cannot update riderResponsibility on another user's record", () => {
        cy.then(() =>
            API.graphql({
                query: queries.getUser,
                variables: { id: coordinatorUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            coordinatorUserVersion = response.data.getUser._version;
        });

        cy.then(() =>
            API.graphql({
                query: mutations.updateUser,
                variables: {
                    input: {
                        id: coordinatorUserId,
                        _version: coordinatorUserVersion,
                        riderResponsibility: "hacked",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(
                result.errors,
                "RIDER updateUser on non-owned record should be denied"
            ).to.exist;
            expect(result.errors[0].errorType).to.equal("Unauthorized");
        });
    });

    // ─── roles cannot be updated directly by anyone ───────────────────────────

    it("RIDER (owner) cannot directly update their own roles", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.updateUser,
                variables: {
                    input: {
                        id: riderUserId,
                        _version: riderUserVersion,
                        roles: ["ADMIN"],
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(
                result.errors,
                "owner updateUser roles should be denied"
            ).to.exist;
            expect(result.errors[0].errorType).to.equal("Unauthorized");
        });
    });

    it("COORDINATOR cannot directly update roles on another user's record", () => {
        cy.signIn("COORDINATOR");

        cy.then(() =>
            API.graphql({
                query: mutations.updateUser,
                variables: {
                    input: {
                        id: riderUserId,
                        _version: riderUserVersion,
                        roles: ["ADMIN"],
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(
                result.errors,
                "COORDINATOR updateUser roles should be denied"
            ).to.exist;
            expect(result.errors[0].errorType).to.equal("Unauthorized");
        });
    });

    it("ADMIN cannot directly update roles on another user's record", () => {
        cy.signIn("ADMIN");

        cy.then(() =>
            API.graphql({
                query: queries.getUser,
                variables: { id: riderUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            riderUserVersion = response.data.getUser._version;
        });

        cy.then(() =>
            API.graphql({
                query: mutations.updateUser,
                variables: {
                    input: {
                        id: riderUserId,
                        _version: riderUserVersion,
                        roles: ["ADMIN"],
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(
                result.errors,
                "ADMIN updateUser roles should be denied"
            ).to.exist;
            expect(result.errors[0].errorType).to.equal("Unauthorized");
        });
    });

    // ─── ADMIN permissions ────────────────────────────────────────────────────

    it("ADMIN can update riderResponsibility on another user's record", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.updateUser,
                variables: {
                    input: {
                        id: riderUserId,
                        _version: riderUserVersion,
                        riderResponsibility: "admin-assigned",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.updateUser.riderResponsibility).to.equal(
                "admin-assigned"
            );
            riderUserVersion = response.data.updateUser._version;
        });
    });

    it("ADMIN can update displayName on another user's record", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.updateUser,
                variables: {
                    input: {
                        id: riderUserId,
                        _version: riderUserVersion,
                        displayName: "Admin Set Name",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.updateUser.displayName).to.equal(
                "Admin Set Name"
            );
            riderUserVersion = response.data.updateUser._version;
        });
    });

    it("ADMIN can update dateOfBirth on another user's record", () => {
        cy.then(() =>
            API.graphql({
                query: mutations.updateUser,
                variables: {
                    input: {
                        id: riderUserId,
                        _version: riderUserVersion,
                        dateOfBirth: "1985-03-20",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.updateUser.dateOfBirth).to.equal("1985-03-20");
            riderUserVersion = response.data.updateUser._version;
        });
    });
});
