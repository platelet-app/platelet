/**
 * Tests that AppSync mutations guarded by the isBeingDeleted flag on the User
 * type return a NotFoundError when the targeted user has isBeingDeleted = true.
 *
 * Affected mutations (verified via VTL postAuth resolvers in
 * amplify/backend/api/platelet/resolvers/):
 *   - createTaskAssignee          (postAuth.1: checks userAssignmentsId)
 *   - createVehicleAssignment     (postAuth.1: checks userVehicleAssignmentsId)
 *   - createPossibleRiderResponsibilities (postAuth.1: checks userPossibleRiderResponsibilitiesId)
 *
 * The isBeingDeleted flag cannot be set via Cognito auth because the User model
 * only grants Cognito users read access. It must be set via IAM credentials,
 * which requires awsAccessKeyId and awsSecretAccessKey in cypress.env.json.
 */

const Amplify = require("aws-amplify").Amplify;
const API = require("aws-amplify").API;

const userPoolId = Cypress.env("userPoolId");
const clientId = Cypress.env("clientId");
const tenantId = Cypress.env("tenantId");
const endpoint = Cypress.env("appsyncGraphqlEndpoint");
const region = Cypress.env("appsyncRegion");

Amplify.configure({
    aws_user_pools_id: userPoolId,
    aws_user_pools_web_client_id: clientId,
    aws_appsync_graphqlEndpoint: endpoint,
    aws_appsync_region: region,
    aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
});

// Minimal inline mutations — only request the fields we actually need.

const registerUserMutation = /* GraphQL */ `
    mutation RegisterUser($name: String, $email: String, $tenantId: ID, $roles: [Role]) {
        registerUser(name: $name, email: $email, tenantId: $tenantId, roles: $roles) {
            id
            cognitoId
        }
    }
`;

const getUserQuery = /* GraphQL */ `
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            _version
            isBeingDeleted
        }
    }
`;

const updateUserMutation = /* GraphQL */ `
    mutation UpdateUser($input: UpdateUserInput!) {
        updateUser(input: $input) {
            id
            _version
            isBeingDeleted
        }
    }
`;

const createTaskAssigneeMutation = /* GraphQL */ `
    mutation CreateTaskAssignee($input: CreateTaskAssigneeInput!) {
        createTaskAssignee(input: $input) {
            id
        }
    }
`;

const createVehicleAssignmentMutation = /* GraphQL */ `
    mutation CreateVehicleAssignment($input: CreateVehicleAssignmentInput!) {
        createVehicleAssignment(input: $input) {
            id
        }
    }
`;

const createCommentMutation = /* GraphQL */ `
    mutation CreateComment($input: CreateCommentInput!) {
        createComment(input: $input) {
            id
        }
    }
`;

const createPossibleRiderResponsibilitiesMutation = /* GraphQL */ `
    mutation CreatePossibleRiderResponsibilities($input: CreatePossibleRiderResponsibilitiesInput!) {
        createPossibleRiderResponsibilities(input: $input) {
            id
        }
    }
`;

const disableUserMutation = /* GraphQL */ `
    mutation DisableUser($userId: ID) {
        disableUser(userId: $userId) {
            id
            disabled
        }
    }
`;

const adminDeleteUserMutation = /* GraphQL */ `
    mutation AdminDeleteUser($userId: ID) {
        adminDeleteUser(userId: $userId) {
            executionArn
        }
    }
`;

// Placeholder UUID used for relationship fields in mutations that will be
// rejected before AppSync ever reads those related records.
const DUMMY_ID = "00000000-0000-0000-0000-000000000000";

describe("isBeingDeleted access denial", () => {
    let testUserId;
    let testUserVersion;

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

    it("creates a test user", () => {
        const timestamp = Date.now();

        cy.then(() =>
            API.graphql({
                query: registerUserMutation,
                variables: {
                    name: `Test Being-Deleted User ${timestamp}`,
                    email: `test-being-deleted-${timestamp}@platelet.app`,
                    tenantId,
                    roles: ["RIDER", "USER"],
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.registerUser).to.not.be.null;
            testUserId = response.data.registerUser.id;
            expect(testUserId).to.exist;
            cy.log("Created test user:", testUserId);
        });
    });

    it("fetches the user version for optimistic concurrency", () => {
        cy.then(() =>
            API.graphql({
                query: getUserQuery,
                variables: { id: testUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.getUser).to.not.be.null;
            testUserVersion = response.data.getUser._version;
            expect(testUserVersion).to.exist;
            cy.log("User _version:", testUserVersion);
        });
    });

    it("sets isBeingDeleted = true via IAM credentials", () => {
        cy.iamGraphqlMutation(updateUserMutation, {
            input: {
                id: testUserId,
                _version: testUserVersion,
                isBeingDeleted: true,
            },
        }).then((response) => {
            expect(response.errors, "IAM updateUser should not return errors").to.be.undefined;
            expect(response.data.updateUser.isBeingDeleted).to.equal(true);
            testUserVersion = response.data.updateUser._version;
            cy.log("User marked as isBeingDeleted, new _version:", testUserVersion);
        });
    });

    it("denies createTaskAssignee when the assignee user isBeingDeleted", () => {
        cy.then(() =>
            API.graphql({
                query: createTaskAssigneeMutation,
                variables: {
                    input: {
                        tenantId,
                        role: "RIDER",
                        taskAssigneesId: DUMMY_ID,
                        userAssignmentsId: testUserId,
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(result.errors, "createTaskAssignee should return errors").to.exist;
            const error = result.errors[0];
            expect(error.errorType).to.equal("NotFoundError");
            expect(error.message).to.equal("The user cannot be found");
        });
    });

    it("denies createVehicleAssignment when the assignee user isBeingDeleted", () => {
        cy.then(() =>
            API.graphql({
                query: createVehicleAssignmentMutation,
                variables: {
                    input: {
                        tenantId,
                        userVehicleAssignmentsId: testUserId,
                        vehicleAssignmentsId: DUMMY_ID,
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(result.errors, "createVehicleAssignment should return errors").to.exist;
            const error = result.errors[0];
            expect(error.errorType).to.equal("NotFoundError");
            expect(error.message).to.equal("The user cannot be found");
        });
    });

    it("denies createComment when the author user isBeingDeleted", () => {
        cy.then(() =>
            API.graphql({
                query: createCommentMutation,
                variables: {
                    input: {
                        tenantId,
                        userCommentsId: testUserId,
                        body: "test comment",
                        visibility: "EVERYONE",
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(result.errors, "createComment should return errors").to.exist;
            const error = result.errors[0];
            expect(error.errorType).to.equal("NotFoundError");
            expect(error.message).to.equal("The user cannot be found");
        });
    });

    it("denies createPossibleRiderResponsibilities when the user isBeingDeleted", () => {
        cy.then(() =>
            API.graphql({
                query: createPossibleRiderResponsibilitiesMutation,
                variables: {
                    input: {
                        tenantId,
                        userPossibleRiderResponsibilitiesId: testUserId,
                        riderResponsibilityPossibleUsersId: DUMMY_ID,
                    },
                },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            }).catch((err) => err)
        ).then((result) => {
            expect(result.errors, "createPossibleRiderResponsibilities should return errors").to.exist;
            const error = result.errors[0];
            expect(error.errorType).to.equal("NotFoundError");
            expect(error.message).to.equal("The user cannot be found");
        });
    });

    it("cleans up: resets isBeingDeleted, disables, and deletes the test user", () => {
        // Reset the flag so the standard delete flow can proceed
        cy.iamGraphqlMutation(updateUserMutation, {
            input: {
                id: testUserId,
                _version: testUserVersion,
                isBeingDeleted: false,
            },
        }).then((response) => {
            expect(response.errors).to.be.undefined;
            cy.log("Reset isBeingDeleted to false");
        });

        // Disable is required before adminDeleteUser
        cy.then(() =>
            API.graphql({
                query: disableUserMutation,
                variables: { userId: testUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.disableUser.disabled).to.equal(1);
            cy.log("User disabled");
        });

        // Kick off async deletion — no need to wait for the step function
        cy.then(() =>
            API.graphql({
                query: adminDeleteUserMutation,
                variables: { userId: testUserId },
                authMode: "AMAZON_COGNITO_USER_POOLS",
            })
        ).then((response) => {
            expect(response.data.adminDeleteUser.executionArn).to.exist;
            cy.log("User deletion started:", response.data.adminDeleteUser.executionArn);
        });
    });
});
