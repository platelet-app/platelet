import {
    AmplifyAuthCognitoStackTemplate,
    AmplifyProjectInfo,
} from "@aws-amplify/cli-extensibility-helper";

export function override(
    resources: AmplifyAuthCognitoStackTemplate,
    amplifyProjectInfo: AmplifyProjectInfo
) {
    resources.userPoolClient.accessTokenValidity = 1;
    resources.userPoolClient.idTokenValidity = 1;
    resources.userPoolClientWeb.accessTokenValidity = 1;
    resources.userPoolClientWeb.idTokenValidity = 1;
    resources.userPoolClient.tokenValidityUnits = {
        ...resources.userPoolClient.tokenValidityUnits,
        accessToken: "days",
        idToken: "days",
    };
    resources.userPoolClientWeb.tokenValidityUnits = {
        ...resources.userPoolClient.tokenValidityUnits,
        accessToken: "days",
        idToken: "days",
    };
    resources.userPool.adminCreateUserConfig = {
        ...resources.userPool.adminCreateUserConfig,
        allowAdminCreateUserOnly: true,
    };
}
