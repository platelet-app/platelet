import "./commands";

const Auth = require("aws-amplify").Auth;

// Before each spec, ensure the shared RIDER and COORDINATOR fixture users exist.
// The createFixtureUsers task caches on first call and returns immediately for
// subsequent specs in the same run, so the Auth.signIn here only hits the network once.
before(() => {
    cy.task("getFixtureUsers").then((users) => {
        if (users) return; // already created — skip the sign-in round-trip

        cy.then(() =>
            Auth.signIn(
                Cypress.env("adminusername"),
                Cypress.env("adminpassword")
            )
        )
            .then((cognitoUser: any) => {
                const adminToken =
                    cognitoUser.signInUserSession.idToken.jwtToken;
                const refreshToken =
                    cognitoUser.signInUserSession.refreshToken.token;
                return cy.task("createFixtureUsers", {
                    adminToken,
                    refreshToken,
                });
            })
            .then(() => Auth.signOut().catch(() => {}));
    });
});
