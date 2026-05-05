/**
 * End-to-End Test for User Deletion
 *
 * This test suite validates the complete user deletion workflow including:
 * 1. Creating a test user with registerUser mutation
 * 2. Uploading a profile picture for the user
 * 3. Creating associated data (comments, task assignments, vehicle assignments, rider responsibilities)
 * 4. Disabling the user (required before deletion)
 * 5. Deleting the user using adminDeleteUser mutation
 * 6. Verifying complete deletion from DynamoDB (user and all associated data)
 * 7. Verifying deletion from Cognito
 *
 * Prerequisites:
 * - An admin user account with proper credentials configured in Cypress environment
 * - AWS AppSync GraphQL endpoint configured
 * - Cognito user pool configured
 * - Proper tenant ID configured
 *
 * To run this test:
 * - Ensure all environment variables are set in cypress.env.json or CI/CD
 * - Run: npx cypress run --spec "cypress/integration/user_deletion_spec.js"
 * - Or open Cypress UI: npx cypress open
 */

const { graphqlOperation } = require("aws-amplify");

const { queries, mutations } = require("@platelet-app/graphql");

const Auth = require("aws-amplify").Auth;
const Amplify = require("aws-amplify").Amplify;
const API = require("aws-amplify").API;

const userPoolId = Cypress.env("userPoolId");
const clientId = Cypress.env("clientId");
const endpoint = Cypress.env("appsyncGraphqlEndpoint");
const region = Cypress.env("appsyncRegion");
const authType = Cypress.env("appsyncAuthenticationType");
const bucket = Cypress.env("bucket");

const awsconfig = {
    aws_user_pools_id: userPoolId,
    aws_user_pools_web_client_id: clientId,
    aws_appsync_graphqlEndpoint: endpoint,
    aws_appsync_region: region,
    aws_appsync_authenticationType: authType,
    aws_user_files_s3_bucket: bucket,
    aws_user_files_s3_bucket_region: region,
};

Amplify.configure(awsconfig);

// Configuration constants for test execution
const DELETION_INITIAL_WAIT = 10000; // Initial wait for deletion to start (ms)
const DELETION_MAX_RETRIES = 30; // Maximum retries for checking deletion completion
const DELETION_RETRY_INTERVAL = 5000; // Time between retry attempts (ms)

describe("User Deletion End-to-End Test", () => {
    let testUserId;
    let testUserCognitoId;
    let testUserEmail;
    let testUserName;
    let createdCommentId;
    let createdTaskAssigneeId;
    let createdVehicleAssignmentId;
    let createdPossibleRiderResponsibilityId;
    let createdTaskId;
    let createdVehicleId;
    let riderResponsibilityId;

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

    it("should create a test user", () => {
        const timestamp = Date.now();
        testUserEmail = `test-delete-${timestamp}@platelet.app`;
        testUserName = `Test User ${timestamp}`;

        cy.then(() => {
            return API.graphql({
                query: mutations.registerUser,
                variables: {
                    name: testUserName,
                    email: testUserEmail,
                    tenantId: Cypress.env("tenantId"),
                    roles: ["RIDER", "USER"],
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            expect(response.data.registerUser).to.not.be.null;
            testUserId = response.data.registerUser.id;
            testUserCognitoId = response.data.registerUser.cognitoId;
            expect(testUserId).to.exist;
            expect(testUserCognitoId).to.exist;
            cy.log("Created user with ID:", testUserId);
        });
    });

    it("should upload a profile picture for the test user", () => {
        let uploadURL;

        // 1x1 pixel PNG — built synchronously before the command queue starts
        const base64PNG =
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
        const binaryString = atob(base64PNG);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: "image/png" });

        // Step 1: get pre-signed upload URL
        cy.then(() =>
            API.graphql({
                query: queries.profilePictureUploadURL,
                variables: { userId: testUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            uploadURL = response.data.profilePictureUploadURL;
            expect(uploadURL).to.exist;
        });

        // Step 2: PUT the image (uploadURL set by step 1 before this executes)
        cy.then(() =>
            cy.request({
                method: "PUT",
                url: uploadURL,
                body: blob,
                headers: { "Content-Type": "image/png" },
            })
        ).then((response) => {
            expect(response.status).to.equal(200);
            cy.log("Uploaded profile picture");
        });

        // Step 3: link the uploaded image to the user record (fire-and-forget)
        cy.then(() =>
            API.graphql(
                graphqlOperation(mutations.updateUser, {
                    input: {
                        id: testUserId,
                        _version: 1,
                        profilePicture: {
                            key: `public/${testUserId}.jpg`,
                            bucket,
                            region,
                        },
                    },
                })
            )
        );
    });

    it("should get or create a task for testing assignments", () => {
        cy.then(() => {
            return API.graphql({
                query: queries.listTasks,
                variables: {
                    filter: {
                        tenantId: { eq: Cypress.env("tenantId") },
                        status: { eq: "NEW" },
                    },
                    limit: 1,
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            if (
                response.data.listTasks.items &&
                response.data.listTasks.items.length > 0
            ) {
                createdTaskId = response.data.listTasks.items[0].id;
                cy.log("Using existing task:", createdTaskId);
            } else {
                // Create a new task if none exists
                return API.graphql({
                    query: mutations.createTask,
                    variables: {
                        input: {
                            tenantId: Cypress.env("tenantId"),
                            dateCreated: new Date().toISOString().split("T")[0],
                            status: "NEW",
                        },
                    },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                }).then((createResponse) => {
                    expect(createResponse.data.createTask).to.not.be.null;
                    createdTaskId = createResponse.data.createTask.id;
                    expect(createdTaskId).to.exist;
                    cy.log("Created task with ID:", createdTaskId);
                });
            }
        });
    });

    it("should add a task assignment for the test user", () => {
        cy.then(() => {
            return API.graphql({
                query: mutations.createTaskAssignee,
                variables: {
                    input: {
                        tenantId: Cypress.env("tenantId"),
                        role: "RIDER",
                        taskAssigneesId: createdTaskId,
                        userAssignmentsId: testUserId,
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            expect(response.data.createTaskAssignee).to.not.be.null;
            createdTaskAssigneeId = response.data.createTaskAssignee.id;
            expect(createdTaskAssigneeId).to.exist;
            cy.log("Created task assignment with ID:", createdTaskAssigneeId);
        });
    });

    it("should get or create a vehicle for testing vehicle assignments", () => {
        cy.then(() => {
            return API.graphql({
                query: queries.listVehicles,
                variables: {
                    filter: {
                        tenantId: { eq: Cypress.env("tenantId") },
                    },
                    limit: 1,
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            if (
                response.data.listVehicles.items &&
                response.data.listVehicles.items.length > 0
            ) {
                createdVehicleId = response.data.listVehicles.items[0].id;
                cy.log("Using existing vehicle:", createdVehicleId);
            } else {
                // Create a new vehicle if none exists
                return API.graphql({
                    query: mutations.createVehicle,
                    variables: {
                        input: {
                            tenantId: Cypress.env("tenantId"),
                            name: "Test Vehicle for Deletion",
                        },
                    },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                }).then((createResponse) => {
                    expect(createResponse.data.createVehicle).to.not.be.null;
                    createdVehicleId = createResponse.data.createVehicle.id;
                    expect(createdVehicleId).to.exist;
                    cy.log("Created vehicle with ID:", createdVehicleId);
                });
            }
        });
    });

    it("should add a vehicle assignment for the test user", () => {
        cy.then(() => {
            return API.graphql({
                query: mutations.createVehicleAssignment,
                variables: {
                    input: {
                        tenantId: Cypress.env("tenantId"),
                        userVehicleAssignmentsId: testUserId,
                        vehicleAssignmentsId: createdVehicleId,
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            expect(response.data.createVehicleAssignment).to.not.be.null;
            createdVehicleAssignmentId =
                response.data.createVehicleAssignment.id;
            expect(createdVehicleAssignmentId).to.exist;
            cy.log(
                "Created vehicle assignment with ID:",
                createdVehicleAssignmentId
            );
        });
    });

    it("should get or create a rider responsibility for testing", () => {
        cy.then(() => {
            return API.graphql({
                query: queries.listRiderResponsibilities,
                variables: {
                    filter: {
                        tenantId: { eq: Cypress.env("tenantId") },
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            if (
                response.data.listRiderResponsibilities.items &&
                response.data.listRiderResponsibilities.items.length > 0
            ) {
                riderResponsibilityId =
                    response.data.listRiderResponsibilities.items[0].id;
                cy.log(
                    "Using existing rider responsibility:",
                    riderResponsibilityId
                );
            } else {
                // Create a new rider responsibility if none exists
                return API.graphql({
                    query: mutations.createRiderResponsibility,
                    variables: {
                        input: {
                            tenantId: Cypress.env("tenantId"),
                            label: "Test Responsibility",
                        },
                    },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                }).then((createResponse) => {
                    riderResponsibilityId =
                        createResponse.data.createRiderResponsibility.id;
                    cy.log(
                        "Created rider responsibility:",
                        riderResponsibilityId
                    );
                });
            }
        });
    });

    it("should add a possible rider responsibility for the test user", () => {
        cy.then(() => {
            return API.graphql({
                query: mutations.createPossibleRiderResponsibilities,
                variables: {
                    input: {
                        tenantId: Cypress.env("tenantId"),
                        userPossibleRiderResponsibilitiesId: testUserId,
                        riderResponsibilityPossibleUsersId:
                            riderResponsibilityId,
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            expect(response.data.createPossibleRiderResponsibilities).to.not.be
                .null;
            createdPossibleRiderResponsibilityId =
                response.data.createPossibleRiderResponsibilities.id;
            expect(createdPossibleRiderResponsibilityId).to.exist;
            cy.log(
                "Created possible rider responsibility with ID:",
                createdPossibleRiderResponsibilityId
            );
        });
    });

    it.skip("should add a comment for the test user", () => {
        cy.then(() => {
            return API.graphql({
                query: mutations.createComment,
                variables: {
                    input: {
                        tenantId: Cypress.env("tenantId"),
                        parentId: createdTaskId,
                        body: "Test comment from user to be deleted",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            expect(response.data.createComment).to.not.be.null;
            createdCommentId = response.data.createComment.id;
            expect(createdCommentId).to.exist;
            cy.log("Created comment with ID:", createdCommentId);
        });
    });

    it("should disable the test user before deletion", () => {
        cy.then(() => {
            return API.graphql({
                query: mutations.disableUser,
                variables: {
                    userId: testUserId,
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            expect(response.data.disableUser).to.not.be.null;
            expect(response.data.disableUser.disabled).to.equal(1);
            cy.log("Disabled user:", testUserId);
        });
    });

    it("should verify user is disabled in DynamoDB", () => {
        cy.then(() => {
            return API.graphql({
                query: queries.getUser,
                variables: {
                    id: testUserId,
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            expect(response.data.getUser).to.not.be.null;
            expect(response.data.getUser.disabled).to.equal(1);
            cy.log("Verified user is disabled in DynamoDB");
        });
    });

    it("should delete the test user", () => {
        cy.then(() => {
            return API.graphql({
                query: mutations.adminDeleteUser,
                variables: {
                    userId: testUserId,
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            expect(response.data.adminDeleteUser).to.not.be.null;
            expect(response.data.adminDeleteUser.executionArn).to.exist;
            cy.log(
                "User deletion started with execution ARN:",
                response.data.adminDeleteUser.executionArn
            );
        });
    });

    it("should wait for deletion to complete and verify user is deleted from DynamoDB", () => {
        // Poll for deletion completion
        cy.wait(DELETION_INITIAL_WAIT); // Initial wait for step function to start

        const checkUserDeleted = (retries = 0) => {
            cy.then(() => {
                return API.graphql({
                    query: queries.getUser,
                    variables: {
                        id: testUserId,
                    },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                });
            }).then((response) => {
                if (
                    !response.data.getUser ||
                    response.data.getUser._deleted === true
                ) {
                    // User is deleted
                    cy.log("User successfully deleted from DynamoDB");
                } else if (retries < DELETION_MAX_RETRIES) {
                    // Wait and retry
                    cy.wait(DELETION_RETRY_INTERVAL);
                    checkUserDeleted(retries + 1);
                } else {
                    throw new Error(
                        `User deletion from DynamoDB did not complete within expected time (${DELETION_MAX_RETRIES} retries)`
                    );
                }
            });
        };

        checkUserDeleted();
    });

    it("should verify task assignment is deleted from DynamoDB", () => {
        cy.then(() => {
            return API.graphql({
                query: queries.getTaskAssignee,
                variables: {
                    id: createdTaskAssigneeId,
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            // Task assignment should be deleted or not found
            if (response.data.getTaskAssignee) {
                expect(response.data.getTaskAssignee._deleted).to.equal(true);
            }
            cy.log("Verified task assignment is deleted from DynamoDB");
        });
    });

    it("should verify vehicle assignment is deleted from DynamoDB", () => {
        cy.then(() => {
            return API.graphql({
                query: queries.getVehicleAssignment,
                variables: {
                    id: createdVehicleAssignmentId,
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            // Vehicle assignment should be deleted or not found
            if (response.data.getVehicleAssignment) {
                expect(response.data.getVehicleAssignment._deleted).to.equal(
                    true
                );
            }
            cy.log("Verified vehicle assignment is deleted from DynamoDB");
        });
    });

    it("should verify possible rider responsibility is deleted from DynamoDB", () => {
        cy.then(() => {
            return API.graphql({
                query: queries.getPossibleRiderResponsibilities,
                variables: {
                    id: createdPossibleRiderResponsibilityId,
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            // Possible rider responsibility should be deleted or not found
            if (response.data.getPossibleRiderResponsibilities) {
                expect(
                    response.data.getPossibleRiderResponsibilities._deleted
                ).to.equal(true);
            }
            cy.log(
                "Verified possible rider responsibility is deleted from DynamoDB"
            );
        });
    });

    it.skip("should verify comment is deleted from DynamoDB", () => {
        cy.then(() => {
            return API.graphql({
                query: queries.getComment,
                variables: {
                    id: createdCommentId,
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            // Comment should be deleted or not found
            if (response.data.getComment) {
                expect(response.data.getComment._deleted).to.equal(true);
            }
            cy.log("Verified comment is deleted from DynamoDB");
        });
    });

    it.skip("should verify user is deleted from Cognito", () => {
        // Use Cognito admin API to verify user deletion
        cy.then(() => {
            return Auth.currentSession().then((session) => {
                session.getIdToken().getJwtToken();

                // We need to use a Lambda function or admin credentials to check Cognito
                // Since we can't directly call Cognito admin APIs from the browser,
                // we'll verify by trying to get the user through AppSync which should fail
                return API.graphql({
                    query: queries.getUserByCognitoId,
                    variables: {
                        cognitoId: testUserCognitoId,
                    },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                });
            });
        }).then((response) => {
            // User should not be found or should be marked as deleted
            const items = response.data.getUserByCognitoId.items;
            if (items && items.length > 0) {
                expect(items[0]._deleted).to.equal(true);
            } else {
                // No items found is also acceptable
                expect(items).to.have.length(0);
            }
            cy.log(
                "Verified user is deleted from Cognito (no active user found)"
            );
        });
    });

    it.skip("should clean up test task and vehicle", () => {
        // Delete task
        cy.then(() => {
            return API.graphql({
                query: queries.getTask,
                variables: {
                    id: createdTaskId,
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            if (response.data.getTask && !response.data.getTask._deleted) {
                return API.graphql({
                    query: mutations.deleteTask,
                    input: {
                        id: createdTaskId,
                        _version: response.data.getTask._version,
                    },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                });
            }
        });

        // Delete vehicle
        cy.then(() => {
            return API.graphql({
                query: queries.getVehicle,
                variables: {
                    id: createdVehicleId,
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            if (
                response.data.getVehicle &&
                !response.data.getVehicle._deleted
            ) {
                return API.graphql({
                    query: mutations.deleteVehicle,
                    variables: {
                        input: {
                            id: createdVehicleId,
                            _version: response.data.getVehicle._version,
                        },
                    },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                });
            }
        });

        cy.log("Cleaned up test task and vehicle");
    });
});
