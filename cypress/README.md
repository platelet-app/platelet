# Cypress End-to-End Tests

This directory contains Cypress end-to-end tests for the Platelet application.

## Running Tests

### Prerequisites

Before running Cypress tests, ensure you have:

1. Node.js and npm installed
2. All dependencies installed: `npm install`
3. A running instance of the application (or configured to point to a test environment)
4. Proper environment variables configured

### Environment Variables

Create a `cypress.env.json` file in the root directory with the following variables:

```json
{
  "userPoolId": "your-cognito-user-pool-id",
  "clientId": "your-cognito-client-id",
  "tenantId": "your-tenant-id",
  "appsyncGraphqlEndpoint": "your-appsync-endpoint",
  "appsyncRegion": "your-aws-region",
  "appsyncAuthenticationType": "AMAZON_COGNITO_USER_POOLS",
  "adminusername": "admin-test-user",
  "adminpassword": "admin-test-password",
  "riderusername": "rider-test-user",
  "riderpassword": "rider-test-password",
  "coordusername": "coordinator-test-user",
  "coordpassword": "coordinator-test-password"
}
```

**Note:** Never commit `cypress.env.json` to version control as it contains sensitive credentials.

### Running Tests

#### Open Cypress Test Runner (Interactive Mode)

```bash
npx cypress open
```

This will open the Cypress Test Runner UI where you can select and run individual tests.

#### Run All Tests (Headless Mode)

```bash
npx cypress run
```

#### Run Specific Test File

```bash
npx cypress run --spec "cypress/integration/user_deletion_spec.js"
```

#### Run Tests with Browser Visible

```bash
npx cypress run --headed --browser chrome
```

## Test Files

### `integration/user_deletion_spec.js`

Comprehensive end-to-end test for the user deletion workflow. This test:

1. Creates a test user using the `registerUser` mutation
2. Uploads a profile picture for the user
3. Creates associated data:
   - Comments
   - Task assignments
   - Vehicle assignments
   - Possible rider responsibilities
4. Disables the user (required before deletion)
5. Deletes the user using `adminDeleteUser` mutation
6. Verifies complete deletion from DynamoDB:
   - User record
   - All associated comments
   - All task assignments
   - All vehicle assignments
   - All possible rider responsibilities
7. Verifies deletion from Cognito

**Important:** This test requires admin-level credentials and will create and delete real data in your test environment.

### `integration/dashboard_spec.js`

Tests for dashboard functionality including task creation, role views, and filtering.

### `integration/assignees_spec.js`

Tests for assigning and unassigning users to tasks.

### `integration/actions_spec.js`

Tests for various user actions within the application.

## Writing New Tests

When writing new Cypress tests:

1. Place test files in the `cypress/integration/` directory
2. Use descriptive test names that explain what is being tested
3. Follow the existing patterns for authentication and data setup
4. Use `cy.signIn()` or `cy.loginByCognitoApi()` for authentication
5. Clean up any test data created during the test
6. Use the GraphQL utilities in `cypress/utils/graphql-test-utils.js` for aliasing queries and mutations

## Custom Commands

Custom Cypress commands are defined in `cypress/support/commands.js`:

- `cy.signIn(role)` - Sign in as a specific role (ADMIN, RIDER, COORDINATOR)
- `cy.clearTasks(status)` - Clear all tasks with a specific status
- `cy.populateTasks()` - Create multiple test tasks
- `cy.clearDataStore()` - Clear the local DataStore
- `cy.addSingleTask()` - Add a single test task

## Troubleshooting

### Tests Fail to Connect

If tests fail to connect to AWS services:

1. Verify all environment variables in `cypress.env.json` are correct
2. Check that the AWS services (Cognito, AppSync) are accessible
3. Ensure the test user credentials are valid

### Tests Timeout

If tests timeout:

1. Increase timeout values in `cypress.json` or individual tests
2. Check network connectivity to AWS services
3. Verify the application is running and accessible

### Authentication Errors

If authentication fails:

1. Verify Cognito user pool credentials
2. Check that test users exist and have proper permissions
3. Ensure the Cognito client is configured correctly

## CI/CD Integration

These tests can be integrated into CI/CD pipelines:

```bash
# Example GitHub Actions workflow step
- name: Run Cypress Tests
  run: |
    npm install
    npx cypress run --config video=false
  env:
    CYPRESS_userPoolId: ${{ secrets.CYPRESS_USER_POOL_ID }}
    CYPRESS_clientId: ${{ secrets.CYPRESS_CLIENT_ID }}
    # ... other environment variables
```

Environment variables can be prefixed with `CYPRESS_` to be automatically picked up by Cypress.
