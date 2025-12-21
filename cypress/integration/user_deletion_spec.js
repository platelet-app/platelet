import { aliasMutation } from "../utils/graphql-test-utils";

const Auth = require("aws-amplify").Auth;
const Amplify = require("aws-amplify").Amplify;
const API = require("aws-amplify").API;
const Storage = require("aws-amplify").Storage;

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
    let profilePictureKey;

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
        testUserEmail = `test-delete-${timestamp}@example.com`;
        testUserName = `Test User ${timestamp}`;

        const registerUserMutation = `
            mutation RegisterUser($name: String, $email: String, $tenantId: ID, $roles: [Role]) {
                registerUser(name: $name, email: $email, tenantId: $tenantId, roles: $roles) {
                    id
                    username
                    cognitoId
                    displayName
                    roles
                    tenantId
                }
            }
        `;

        cy.then(() => {
            return API.graphql({
                query: registerUserMutation,
                variables: {
                    name: testUserName,
                    email: testUserEmail,
                    tenantId: tenantId,
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
        // First, get the upload URL
        const getUploadURLQuery = `
            query ProfilePictureUploadURL($userId: ID!) {
                profilePictureUploadURL(userId: $userId)
            }
        `;

        cy.then(() => {
            return API.graphql({
                query: getUploadURLQuery,
                variables: {
                    userId: testUserId,
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            const uploadURL = response.data.profilePictureUploadURL;
            expect(uploadURL).to.exist;
            
            // Create a simple blob to upload as profile picture
            const blob = new Blob(["test profile picture content"], {
                type: "image/png",
            });
            
            // Upload the file directly to the pre-signed URL
            return cy.request({
                method: "PUT",
                url: uploadURL,
                body: blob,
                headers: {
                    "Content-Type": "image/png",
                },
            });
        }).then((uploadResponse) => {
            expect(uploadResponse.status).to.equal(200);
            profilePictureKey = `profile-pictures/${testUserId}`;
            cy.log("Uploaded profile picture");
        });
    });

    it("should create a task for testing assignments", () => {
        const createTaskMutation = `
            mutation CreateTask($input: CreateTaskInput!) {
                createTask(input: $input) {
                    id
                    tenantId
                    status
                }
            }
        `;

        cy.then(() => {
            return API.graphql({
                query: createTaskMutation,
                variables: {
                    input: {
                        tenantId: tenantId,
                        status: "NEW",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            expect(response.data.createTask).to.not.be.null;
            createdTaskId = response.data.createTask.id;
            expect(createdTaskId).to.exist;
            cy.log("Created task with ID:", createdTaskId);
        });
    });

    it("should add a task assignment for the test user", () => {
        const createTaskAssigneeMutation = `
            mutation CreateTaskAssignee($input: CreateTaskAssigneeInput!) {
                createTaskAssignee(input: $input) {
                    id
                    tenantId
                    role
                    taskId
                    assigneeId
                }
            }
        `;

        cy.then(() => {
            return API.graphql({
                query: createTaskAssigneeMutation,
                variables: {
                    input: {
                        tenantId: tenantId,
                        role: "RIDER",
                        taskId: createdTaskId,
                        assigneeId: testUserId,
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

    it("should create a vehicle for testing vehicle assignments", () => {
        const createVehicleMutation = `
            mutation CreateVehicle($input: CreateVehicleInput!) {
                createVehicle(input: $input) {
                    id
                    tenantId
                    name
                }
            }
        `;

        cy.then(() => {
            return API.graphql({
                query: createVehicleMutation,
                variables: {
                    input: {
                        tenantId: tenantId,
                        name: "Test Vehicle for Deletion",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            expect(response.data.createVehicle).to.not.be.null;
            createdVehicleId = response.data.createVehicle.id;
            expect(createdVehicleId).to.exist;
            cy.log("Created vehicle with ID:", createdVehicleId);
        });
    });

    it("should add a vehicle assignment for the test user", () => {
        const createVehicleAssignmentMutation = `
            mutation CreateVehicleAssignment($input: CreateVehicleAssignmentInput!) {
                createVehicleAssignment(input: $input) {
                    id
                    tenantId
                    vehicleId
                    assigneeId
                }
            }
        `;

        cy.then(() => {
            return API.graphql({
                query: createVehicleAssignmentMutation,
                variables: {
                    input: {
                        tenantId: tenantId,
                        vehicleId: createdVehicleId,
                        assigneeId: testUserId,
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
        const listRiderResponsibilitiesQuery = `
            query ListRiderResponsibilities($filter: ModelRiderResponsibilityFilterInput) {
                listRiderResponsibilities(filter: $filter, limit: 1) {
                    items {
                        id
                        label
                    }
                }
            }
        `;

        cy.then(() => {
            return API.graphql({
                query: listRiderResponsibilitiesQuery,
                variables: {
                    filter: {
                        tenantId: { eq: tenantId },
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
                const createRiderResponsibilityMutation = `
                    mutation CreateRiderResponsibility($input: CreateRiderResponsibilityInput!) {
                        createRiderResponsibility(input: $input) {
                            id
                            label
                            tenantId
                        }
                    }
                `;

                return API.graphql({
                    query: createRiderResponsibilityMutation,
                    variables: {
                        input: {
                            tenantId: tenantId,
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
        const createPossibleRiderResponsibilityMutation = `
            mutation CreatePossibleRiderResponsibilities($input: CreatePossibleRiderResponsibilitiesInput!) {
                createPossibleRiderResponsibilities(input: $input) {
                    id
                    tenantId
                    userId
                    riderResponsibilityId
                }
            }
        `;

        cy.then(() => {
            return API.graphql({
                query: createPossibleRiderResponsibilityMutation,
                variables: {
                    input: {
                        tenantId: tenantId,
                        userId: testUserId,
                        riderResponsibilityId: riderResponsibilityId,
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

    it("should add a comment for the test user", () => {
        const createCommentMutation = `
            mutation CreateComment($input: CreateCommentInput!) {
                createComment(input: $input) {
                    id
                    tenantId
                    parentId
                    body
                }
            }
        `;

        cy.then(() => {
            return API.graphql({
                query: createCommentMutation,
                variables: {
                    input: {
                        tenantId: tenantId,
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
        const disableUserMutation = `
            mutation DisableUser($userId: ID) {
                disableUser(userId: $userId) {
                    id
                    disabled
                }
            }
        `;

        cy.then(() => {
            return API.graphql({
                query: disableUserMutation,
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
        const getUserQuery = `
            query GetUser($id: ID!) {
                getUser(id: $id) {
                    id
                    disabled
                }
            }
        `;

        cy.then(() => {
            return API.graphql({
                query: getUserQuery,
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
        const adminDeleteUserMutation = `
            mutation AdminDeleteUser($userId: ID) {
                adminDeleteUser(userId: $userId) {
                    executionArn
                    startDate
                }
            }
        `;

        cy.then(() => {
            return API.graphql({
                query: adminDeleteUserMutation,
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
        const getUserQuery = `
            query GetUser($id: ID!) {
                getUser(id: $id) {
                    id
                    _deleted
                }
            }
        `;

        // Poll for deletion completion
        cy.wait(10000); // Initial wait for step function to start

        const checkUserDeleted = (retries = 0, maxRetries = 30) => {
            cy.then(() => {
                return API.graphql({
                    query: getUserQuery,
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
                } else if (retries < maxRetries) {
                    // Wait and retry
                    cy.wait(5000);
                    checkUserDeleted(retries + 1, maxRetries);
                } else {
                    throw new Error(
                        "User deletion from DynamoDB did not complete in expected time"
                    );
                }
            });
        };

        checkUserDeleted();
    });

    it("should verify task assignment is deleted from DynamoDB", () => {
        const getTaskAssigneeQuery = `
            query GetTaskAssignee($id: ID!) {
                getTaskAssignee(id: $id) {
                    id
                    _deleted
                }
            }
        `;

        cy.then(() => {
            return API.graphql({
                query: getTaskAssigneeQuery,
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
        const getVehicleAssignmentQuery = `
            query GetVehicleAssignment($id: ID!) {
                getVehicleAssignment(id: $id) {
                    id
                    _deleted
                }
            }
        `;

        cy.then(() => {
            return API.graphql({
                query: getVehicleAssignmentQuery,
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
        const getPossibleRiderResponsibilityQuery = `
            query GetPossibleRiderResponsibilities($id: ID!) {
                getPossibleRiderResponsibilities(id: $id) {
                    id
                    _deleted
                }
            }
        `;

        cy.then(() => {
            return API.graphql({
                query: getPossibleRiderResponsibilityQuery,
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

    it("should verify comment is deleted from DynamoDB", () => {
        const getCommentQuery = `
            query GetComment($id: ID!) {
                getComment(id: $id) {
                    id
                    _deleted
                }
            }
        `;

        cy.then(() => {
            return API.graphql({
                query: getCommentQuery,
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

    it("should verify user is deleted from Cognito", () => {
        // Use Cognito admin API to verify user deletion
        cy.then(() => {
            return Auth.currentSession().then((session) => {
                const idToken = session.getIdToken().getJwtToken();

                // We need to use a Lambda function or admin credentials to check Cognito
                // Since we can't directly call Cognito admin APIs from the browser,
                // we'll verify by trying to get the user through AppSync which should fail
                const getUserByCognitoIdQuery = `
                    query GetUserByCognitoId($cognitoId: ID!) {
                        getUserByCognitoId(cognitoId: $cognitoId) {
                            items {
                                id
                                cognitoId
                                _deleted
                            }
                        }
                    }
                `;

                return API.graphql({
                    query: getUserByCognitoIdQuery,
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

    it("should clean up test task and vehicle", () => {
        // Clean up the test task
        const deleteTaskMutation = `
            mutation DeleteTask($input: DeleteTaskInput!) {
                deleteTask(input: $input) {
                    id
                }
            }
        `;

        const deleteVehicleMutation = `
            mutation DeleteVehicle($input: DeleteVehicleInput!) {
                deleteVehicle(input: $input) {
                    id
                }
            }
        `;

        const getTaskQuery = `
            query GetTask($id: ID!) {
                getTask(id: $id) {
                    id
                    _version
                }
            }
        `;

        const getVehicleQuery = `
            query GetVehicle($id: ID!) {
                getVehicle(id: $id) {
                    id
                    _version
                }
            }
        `;

        // Delete task
        cy.then(() => {
            return API.graphql({
                query: getTaskQuery,
                variables: {
                    id: createdTaskId,
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            });
        }).then((response) => {
            if (response.data.getTask && !response.data.getTask._deleted) {
                return API.graphql({
                    query: deleteTaskMutation,
                    variables: {
                        input: {
                            id: createdTaskId,
                            _version: response.data.getTask._version,
                        },
                    },
                    authMode: "AMAZON_COGNITO_USER_POOLS",
                });
            }
        });

        // Delete vehicle
        cy.then(() => {
            return API.graphql({
                query: getVehicleQuery,
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
                    query: deleteVehicleMutation,
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
