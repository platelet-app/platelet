/**
 * Tests that AppSync mutations guarded by the isBeingDeleted flag on the User
 * type return a NotFoundError when the targeted user has isBeingDeleted = true,
 * and that the same mutations succeed when isBeingDeleted = false.
 *
 * Affected mutations (verified via VTL postAuth resolvers in
 * amplify/backend/api/platelet/resolvers/):
 *   - createTaskAssignee                  (postAuth.1: checks userAssignmentsId)
 *   - createVehicleAssignment             (postAuth.1: checks userVehicleAssignmentsId)
 *   - createPossibleRiderResponsibilities (postAuth.1: checks userPossibleRiderResponsibilitiesId)
 *   - createComment                       (postAuth.1: checks userCommentsId)
 *   - createTask                          (postAuth.1: checks userCreatedTasksId)
 *   - createLocation                      (postAuth.1: checks userCreatedLocationsId)
 *   - createVehicle                       (postAuth.1: checks userCreatedVehiclesId)
 *   - createScheduledTask                 (postAuth.1: checks userCreatedScheduledTasksId)
 */

const Amplify = require("aws-amplify").Amplify;
const API = require("aws-amplify").API;
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

// Placeholder UUID for relationship fields in mutations that will be rejected
// before AppSync reads those related records, or for orphaned-reference tests.
const DUMMY_ID = "00000000-0000-0000-0000-000000000000";

const graphql = (query, variables) =>
    API.graphql({ query, variables, authMode: "AMAZON_COGNITO_USER_POOLS" });

describe("isBeingDeleted access denial", () => {
    let testUserId;
    let testUserVersion;
    let testUserUsername;
    let testUserPassword;

    // IDs + versions for cleanup of records created in the success tests
    let createdCommentId, createdCommentVersion;
    let createdTaskAssigneeId, createdTaskAssigneeVersion;
    let createdVehicleAssignmentId, createdVehicleAssignmentVersion;
    let createdPossibleRiderResponsibilitiesId,
        createdPossibleRiderResponsibilitiesVersion;
    let createdTaskId, createdTaskVersion;
    let createdLocationId, createdLocationVersion;
    let createdVehicleId, createdVehicleVersion;
    let createdScheduledTaskId, createdScheduledTaskVersion;

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

    // -----------------------------------------------------------------------
    // Setup
    // -----------------------------------------------------------------------

    it("creates a test user", () => {
        const timestamp = Date.now();
        testUserPassword = `TestBeingDel${timestamp}!A`;

        cy.then(() =>
            graphql(mutations.registerUser, {
                name: `Test Being-Deleted User ${timestamp}`,
                email: `test-being-deleted-${timestamp}@platelet.app`,
                tenantId: Cypress.env("tenantId"),
                roles: ["RIDER", "USER"],
            })
        ).then((response) => {
            expect(response.data.registerUser).to.not.be.null;
            testUserId = response.data.registerUser.id;
            testUserUsername = response.data.registerUser.username;
            expect(testUserId).to.exist;
            expect(testUserUsername).to.exist;
            cy.log("Created test user:", testUserId);
        });
    });

    it("sets a permanent password for the test user", () => {
        cy.task("cognitoAdminSetUserPassword", {
            username: testUserUsername,
            password: testUserPassword,
        });
    });

    it("fetches the user version for optimistic concurrency", () => {
        cy.then(() => graphql(queries.getUser, { id: testUserId })).then(
            (response) => {
                expect(response.data.getUser).to.not.be.null;
                testUserVersion = response.data.getUser._version;
                expect(testUserVersion).to.exist;
                cy.log("User _version:", testUserVersion);
            }
        );
    });

    // -----------------------------------------------------------------------
    // Success checks — user is NOT being deleted
    // -----------------------------------------------------------------------

    it("createComment succeeds when author is not being deleted", () => {
        // postAuth.2 requires the caller to be the comment author, so sign in
        // as the test user for this mutation.
        cy.signInWithCredentials(testUserUsername, testUserPassword);
        cy.then(() =>
            graphql(mutations.createComment, {
                input: {
                    tenantId: Cypress.env("tenantId"),
                    userCommentsId: testUserId,
                    body: "pre-deletion test comment",
                    visibility: "EVERYONE",
                },
            })
        ).then((response) => {
            expect(response.errors, "createComment should not error").to.be
                .undefined;
            createdCommentId = response.data.createComment.id;
            createdCommentVersion = response.data.createComment._version;
            expect(createdCommentId).to.exist;
        });
        cy.signIn("ADMIN");
    });

    it("createTaskAssignee succeeds when assignee is not being deleted", () => {
        cy.then(() =>
            graphql(mutations.createTaskAssignee, {
                input: {
                    tenantId: Cypress.env("tenantId"),
                    role: "RIDER",
                    taskAssigneesId: DUMMY_ID,
                    userAssignmentsId: testUserId,
                },
            })
        ).then((response) => {
            expect(response.errors, "createTaskAssignee should not error").to.be
                .undefined;
            createdTaskAssigneeId = response.data.createTaskAssignee.id;
            createdTaskAssigneeVersion =
                response.data.createTaskAssignee._version;
            expect(createdTaskAssigneeId).to.exist;
        });
    });

    it("createVehicleAssignment succeeds when assignee is not being deleted", () => {
        cy.then(() =>
            graphql(mutations.createVehicleAssignment, {
                input: {
                    tenantId: Cypress.env("tenantId"),
                    userVehicleAssignmentsId: testUserId,
                    vehicleAssignmentsId: DUMMY_ID,
                },
            })
        ).then((response) => {
            expect(
                response.errors,
                "createVehicleAssignment should not error"
            ).to.be.undefined;
            createdVehicleAssignmentId =
                response.data.createVehicleAssignment.id;
            createdVehicleAssignmentVersion =
                response.data.createVehicleAssignment._version;
            expect(createdVehicleAssignmentId).to.exist;
        });
    });

    it("createPossibleRiderResponsibilities succeeds when user is not being deleted", () => {
        cy.then(() =>
            graphql(mutations.createPossibleRiderResponsibilities, {
                input: {
                    tenantId: Cypress.env("tenantId"),
                    userPossibleRiderResponsibilitiesId: testUserId,
                    riderResponsibilityPossibleUsersId: DUMMY_ID,
                },
            })
        ).then((response) => {
            expect(
                response.errors,
                "createPossibleRiderResponsibilities should not error"
            ).to.be.undefined;
            createdPossibleRiderResponsibilitiesId =
                response.data.createPossibleRiderResponsibilities.id;
            createdPossibleRiderResponsibilitiesVersion =
                response.data.createPossibleRiderResponsibilities._version;
            expect(createdPossibleRiderResponsibilitiesId).to.exist;
        });
    });

    it("createTask succeeds when createdBy user is not being deleted", () => {
        cy.then(() =>
            graphql(mutations.createTask, {
                input: {
                    tenantId: Cypress.env("tenantId"),
                    dateCreated: new Date().toISOString().split("T")[0],
                    status: "NEW",
                    userCreatedTasksId: testUserId,
                },
            })
        ).then((response) => {
            expect(response.errors, "createTask should not error").to.be
                .undefined;
            createdTaskId = response.data.createTask.id;
            createdTaskVersion = response.data.createTask._version;
            expect(createdTaskId).to.exist;
        });
    });

    it("createLocation succeeds when createdBy user is not being deleted", () => {
        cy.then(() =>
            graphql(mutations.createLocation, {
                input: {
                    tenantId: Cypress.env("tenantId"),
                    userCreatedLocationsId: testUserId,
                },
            })
        ).then((response) => {
            expect(response.errors, "createLocation should not error").to.be
                .undefined;
            createdLocationId = response.data.createLocation.id;
            createdLocationVersion = response.data.createLocation._version;
            expect(createdLocationId).to.exist;
        });
    });

    it("createVehicle succeeds when createdBy user is not being deleted", () => {
        cy.then(() =>
            graphql(mutations.createVehicle, {
                input: {
                    tenantId: Cypress.env("tenantId"),
                    name: "Test Vehicle (being-deleted spec)",
                    userCreatedVehiclesId: testUserId,
                },
            })
        ).then((response) => {
            expect(response.errors, "createVehicle should not error").to.be
                .undefined;
            createdVehicleId = response.data.createVehicle.id;
            createdVehicleVersion = response.data.createVehicle._version;
            expect(createdVehicleId).to.exist;
        });
    });

    it("createScheduledTask succeeds when createdBy user is not being deleted", () => {
        cy.then(() =>
            graphql(mutations.createScheduledTask, {
                input: {
                    tenantId: Cypress.env("tenantId"),
                    cronExpression: "0 12 * * *",
                    userCreatedScheduledTasksId: testUserId,
                },
            })
        ).then((response) => {
            expect(response.errors, "createScheduledTask should not error").to
                .be.undefined;
            createdScheduledTaskId = response.data.createScheduledTask.id;
            createdScheduledTaskVersion =
                response.data.createScheduledTask._version;
            expect(createdScheduledTaskId).to.exist;
        });
    });

    // -----------------------------------------------------------------------
    // Mark user as being deleted
    // -----------------------------------------------------------------------

    it("sets isBeingDeleted = true via IAM credentials", () => {
        cy.iamGraphqlMutation(mutations.updateUser, {
            input: {
                id: testUserId,
                _version: testUserVersion,
                isBeingDeleted: true,
            },
        }).then((response) => {
            expect(
                response.errors,
                "IAM updateUser should not return errors"
            ).to.be.undefined;
            expect(response.data.updateUser.isBeingDeleted).to.equal(true);
            testUserVersion = response.data.updateUser._version;
            cy.log("User marked as isBeingDeleted, new _version:", testUserVersion);
        });
    });

    // -----------------------------------------------------------------------
    // Denial checks — user IS being deleted
    // -----------------------------------------------------------------------

    it("denies createTaskAssignee when the assignee user isBeingDeleted", () => {
        cy.then(() =>
            graphql(mutations.createTaskAssignee, {
                input: {
                    tenantId: Cypress.env("tenantId"),
                    role: "RIDER",
                    taskAssigneesId: DUMMY_ID,
                    userAssignmentsId: testUserId,
                },
            }).catch((err) => err)
        ).then((result) => {
            expect(
                result.errors,
                "createTaskAssignee should return errors"
            ).to.exist;
            expect(result.errors[0].errorType).to.equal("NotFoundError");
            expect(result.errors[0].message).to.equal(
                "The user cannot be found"
            );
        });
    });

    it("denies createVehicleAssignment when the assignee user isBeingDeleted", () => {
        cy.then(() =>
            graphql(mutations.createVehicleAssignment, {
                input: {
                    tenantId: Cypress.env("tenantId"),
                    userVehicleAssignmentsId: testUserId,
                    vehicleAssignmentsId: DUMMY_ID,
                },
            }).catch((err) => err)
        ).then((result) => {
            expect(
                result.errors,
                "createVehicleAssignment should return errors"
            ).to.exist;
            expect(result.errors[0].errorType).to.equal("NotFoundError");
            expect(result.errors[0].message).to.equal(
                "The user cannot be found"
            );
        });
    });

    it("denies createComment when the author user isBeingDeleted", () => {
        cy.then(() =>
            graphql(mutations.createComment, {
                input: {
                    tenantId: Cypress.env("tenantId"),
                    userCommentsId: testUserId,
                    body: "test comment",
                    visibility: "EVERYONE",
                },
            }).catch((err) => err)
        ).then((result) => {
            expect(result.errors, "createComment should return errors").to
                .exist;
            expect(result.errors[0].errorType).to.equal("NotFoundError");
            expect(result.errors[0].message).to.equal(
                "The user cannot be found"
            );
        });
    });

    it("denies createPossibleRiderResponsibilities when the user isBeingDeleted", () => {
        cy.then(() =>
            graphql(mutations.createPossibleRiderResponsibilities, {
                input: {
                    tenantId: Cypress.env("tenantId"),
                    userPossibleRiderResponsibilitiesId: testUserId,
                    riderResponsibilityPossibleUsersId: DUMMY_ID,
                },
            }).catch((err) => err)
        ).then((result) => {
            expect(
                result.errors,
                "createPossibleRiderResponsibilities should return errors"
            ).to.exist;
            expect(result.errors[0].errorType).to.equal("NotFoundError");
            expect(result.errors[0].message).to.equal(
                "The user cannot be found"
            );
        });
    });

    it("denies createTask when the createdBy user isBeingDeleted", () => {
        cy.then(() =>
            graphql(mutations.createTask, {
                input: {
                    tenantId: Cypress.env("tenantId"),
                    dateCreated: new Date().toISOString().split("T")[0],
                    status: "NEW",
                    userCreatedTasksId: testUserId,
                },
            }).catch((err) => err)
        ).then((result) => {
            expect(result.errors, "createTask should return errors").to.exist;
            expect(result.errors[0].errorType).to.equal("NotFoundError");
            expect(result.errors[0].message).to.equal(
                "The user cannot be found"
            );
        });
    });

    it("denies createLocation when the createdBy user isBeingDeleted", () => {
        cy.then(() =>
            graphql(mutations.createLocation, {
                input: {
                    tenantId: Cypress.env("tenantId"),
                    userCreatedLocationsId: testUserId,
                },
            }).catch((err) => err)
        ).then((result) => {
            expect(
                result.errors,
                "createLocation should return errors"
            ).to.exist;
            expect(result.errors[0].errorType).to.equal("NotFoundError");
            expect(result.errors[0].message).to.equal(
                "The user cannot be found"
            );
        });
    });

    it("denies createVehicle when the createdBy user isBeingDeleted", () => {
        cy.then(() =>
            graphql(mutations.createVehicle, {
                input: {
                    tenantId: Cypress.env("tenantId"),
                    name: "Test Vehicle (denied)",
                    userCreatedVehiclesId: testUserId,
                },
            }).catch((err) => err)
        ).then((result) => {
            expect(
                result.errors,
                "createVehicle should return errors"
            ).to.exist;
            expect(result.errors[0].errorType).to.equal("NotFoundError");
            expect(result.errors[0].message).to.equal(
                "The user cannot be found"
            );
        });
    });

    it("denies createScheduledTask when the createdBy user isBeingDeleted", () => {
        cy.then(() =>
            graphql(mutations.createScheduledTask, {
                input: {
                    tenantId: Cypress.env("tenantId"),
                    cronExpression: "0 12 * * *",
                    userCreatedScheduledTasksId: testUserId,
                },
            }).catch((err) => err)
        ).then((result) => {
            expect(
                result.errors,
                "createScheduledTask should return errors"
            ).to.exist;
            expect(result.errors[0].errorType).to.equal("NotFoundError");
            expect(result.errors[0].message).to.equal(
                "The user cannot be found"
            );
        });
    });

    // -----------------------------------------------------------------------
    // Cleanup
    // -----------------------------------------------------------------------

    it("cleans up: resets isBeingDeleted, deletes created records, disables and deletes the test user", () => {
        cy.iamGraphqlMutation(mutations.updateUser, {
            input: {
                id: testUserId,
                _version: testUserVersion,
                isBeingDeleted: false,
            },
        }).then((response) => {
            expect(response.errors).to.be.undefined;
            cy.log("Reset isBeingDeleted to false");
        });

        // Records that support delete via Cognito auth
        cy.then(() =>
            graphql(mutations.deleteComment, {
                input: { id: createdCommentId, _version: createdCommentVersion },
            }).catch(() => {})
        );
        cy.then(() =>
            graphql(mutations.deleteTaskAssignee, {
                input: {
                    id: createdTaskAssigneeId,
                    _version: createdTaskAssigneeVersion,
                },
            }).catch(() => {})
        );
        cy.then(() =>
            graphql(mutations.deleteVehicleAssignment, {
                input: {
                    id: createdVehicleAssignmentId,
                    _version: createdVehicleAssignmentVersion,
                },
            }).catch(() => {})
        );
        cy.then(() =>
            graphql(mutations.deletePossibleRiderResponsibilities, {
                input: {
                    id: createdPossibleRiderResponsibilitiesId,
                    _version: createdPossibleRiderResponsibilitiesVersion,
                },
            }).catch(() => {})
        );
        cy.then(() =>
            graphql(mutations.deleteLocation, {
                input: {
                    id: createdLocationId,
                    _version: createdLocationVersion,
                },
            }).catch(() => {})
        );
        cy.then(() =>
            graphql(mutations.deleteScheduledTask, {
                input: {
                    id: createdScheduledTaskId,
                    _version: createdScheduledTaskVersion,
                },
            }).catch(() => {})
        );

        // Task and Vehicle have no delete auth rule — cancel/disable them instead
        cy.then(() =>
            graphql(mutations.updateTask, {
                input: {
                    id: createdTaskId,
                    _version: createdTaskVersion,
                    status: "CANCELLED",
                    archived: 1,
                },
            }).catch(() => {})
        );
        cy.then(() =>
            graphql(mutations.updateVehicle, {
                input: {
                    id: createdVehicleId,
                    _version: createdVehicleVersion,
                    disabled: 1,
                },
            }).catch(() => {})
        );

        cy.then(() =>
            graphql(mutations.disableUser, { userId: testUserId })
        ).then((response) => {
            expect(response.data.disableUser.disabled).to.equal(1);
            cy.log("User disabled");
        });

        cy.then(() =>
            graphql(mutations.adminDeleteUser, { userId: testUserId })
        ).then((response) => {
            expect(response.data.adminDeleteUser.executionArn).to.exist;
            cy.log(
                "User deletion started:",
                response.data.adminDeleteUser.executionArn
            );
        });
    });
});
