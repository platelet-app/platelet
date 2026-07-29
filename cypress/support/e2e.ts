import "./commands";

// Before each spec, ensure the shared ADMIN, RIDER and COORDINATOR fixture users
// exist. The createFixtureUsers task caches on first call and returns immediately
// for subsequent specs in the same run. Users are created via the CDK cypress IAM
// role so no pre-existing admin credentials are required in the Cypress env.
before(() => {
    cy.task("getFixtureUsers").then((users) => {
        if (users) return; // already created — skip
        cy.task("createFixtureUsers");
    });
});
