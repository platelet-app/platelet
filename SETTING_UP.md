# Setting up

The easiest way to install Platelet is to connect a branch on GitHub to Amplify through the AWS console.

## Cognito

Under the Sign-up experience tab:

- Add a custom attribute: `tenantId`

- Disable Self-service sign-up

You might also want to adjust token expiry times. By default token refresh expires after 30 minutes. This means that when users are somewhere with a poor connection, they might be logged out when opening the app.

Under the App integration tab:

Choose a client under App clients and analytics.

Click Edit for App client information.

Adjust Access token expiration and ID token expiration.

## Function parameters

Edit the file `amplify/backend/function/plateletSendUserFeedback/parameters.json` and replace the example email address with an email address to receive feedback to.

Edit the files:

`amplify/backend/function/plateletAddNewTenant/parameters.json`

`amplify/backend/function/plateletAdminAddNewUser/parameters.json`

`amplify/backend/function/plateletAdminResetUserPassword/parameters.json`

With an email address to send registration emails from.

`plateletDomainName` should be the URL (without "https://") where the app is hosted. This will be used to point users to the URL in registration emails.

## AWS SES

You will need to apply to AWS for unrestricted sending of emails.

## CI/CD processes

### Environments

Secrets and environment variables should be added to branches individually using the Environments feature on GitHub.

### GitHub Workflow files

#### .github/workflows/updated_tenant_api.yml

On push to a `production/**` branch, this workflow will wait for the remote Amplify build to complete before updating the tenant API with new configuration data.

##### Steps:

- Wait for Amplify to finish remote build (can be disabled on manual invocation)
- Install Amplify CLI and pull project
- Make a request to update the tenant API

If an entry doesn't exist in the tenant API, it will create a new one, otherwise it'll update the existing one.

##### Environment secrets

`AWS_ACCESS_KEY_ID`

Access key ID from AWS. This key should have full access to the tenant API GraphQL endpoint.

Attach this policy to the account to give access:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "appsync:GraphQL"
            ],
            "Resource": [
                "<your API ARN>/*"
            ]
        }
    ]
}
```

In your tenant API edit the file `amplify/backend/api/platelettenantapi/custom-roles.json` and add:

```
{
  "adminRoleNames": [
    "<your-user-arn>"
  ]
}
```

using the ARN of the user with the above policy attached.

You can find the API ARN in AWS AppSync console. Select your API and click Settings on the sidebar.

The account will also need access to these actions:

```
[
    "amplify:GetJob",
    "amplify:ListJobs",
    "amplify:GetBackendEnvironment",
    "amplify:GetApp",
    "cloudformation:DescribeStacks",
    "cloudformation:ListStackResources"
]
```

`AWS_SECRET_ACCESS_KEY`

Secret access key for the access key ID.

`AMPLIFY_ENV_NAME`

The environment name for your production Amplify deployment.

`AMPLIFY_APP_ID`

The app ID for your production Amplify deployment.

You can find both of these pieces of information on the Amplify console. Select your deployment from the list.
Click the `Backend environments` tab. Under your environment, click Edit backend and copy the values from there.

`AWS_REGION`

The AWS region your Amplify app is hosted in.

`API_URL`

The GraphQL URL for the tenant API.

##### Environment variables

`TENANT_NAME`

The name of the tenant as you want it to appear on the list of tenants to the user.

##### Manual invocation

This workflow can be invoked manually from the GitHub repository.

The configuration options are:

`Wait for Amplify build`: on manual invocation if set to `true`, the workflow will check and wait for the Amplify build to finish. Otherwise it will continue regardless.

If the Amplify build failed, then the workflow will still fail.

## Client side environment variables

`REACT_APP_TENANT_GRAPHQL_ENDPOINT`

A GraphQL endpoint for pulling tenant configuration data from. This endpoint populates the list when opening the app for the first time.

If it is undefined, the client will instead use config data from aws-exports.js

`REACT_APP_TENANT_GRAPHQL_KEY`

An API key for the tenant GraphQL endpoint with read only access.

### For web only

`REACT_APP_GOOGLE_MAPS_API_KEY`

An API key provided from the GCP console with access to the Google Maps API. Currently this is only used for searching locations when adding a new one to the system.

`REACT_APP_OFFLINE_ONLY`

When set to `true` the app will not attempt to connect to any AWS Amplify deployment and will work offline only.

`REACT_APP_POPULATE_FAKE_DATA`

When set to `true` the app will populate itself with some fake data. Best used with REACT_APP_OFFLINE_ONLY.

Note: you should clear site data before connecting to an AWS amplify deployment, to save fake data from being synchronised to the server.

`REACT_APP_DEMO_MODE`

When set to `true` the app will clear saved data on each page reload. Good for a demonstration of the app combined with REACT_APP_POPULATE_FAKE_DATA.

`REACT_APP_THROW_ERRORS`

Set this to `true` if Redux should throw errors instead of handling them and showing a notification. This can be helpful when developing.

`REACT_APP_DEMO_PROFILE_PICTURES_BUCKET_NAME`

The name of the bucket that should contain profile pictures for demo mode.

It should contain two directories:

`profilePictures`

`profilePictureThumbnails`

with files {001...0XX}.jpg and {001...0XX}\_thumbnail.jpg respectively.

`REACT_APP_DEMO_PROFILE_PICTURES_BUCKET_REGION`

The region for the demo profile pictures bucket.
