# Setting up

The easiest way to install Platelet is to connect a branch on GitHub to Amplify through the AWS console.

## Cognito

You might want to adjust token expiry times. By default token refresh expires after 30 minutes. This means that when users are somewhere with a poor connection, they might be logged out when opening the app.

Under the App integration tab:

Choose a client under App clients and analytics.

Click Edit for App client information.

Adjust Access token expiration and ID token expiration.

## Function parameters

Edit these functions and replace the email address and URL you need:

Edit the file `backend/function/plateletSendEmail/opt/sendWelcomeEmail.js` and edit:

```
const PLATELET_DOMAIN_NAME = "dispatch.platelet.app";
const PLATELET_WELCOME_EMAIL = "noreply@platelet.app";
```

With the correct values.

`PLATELET_DOMAIN_NAME` should be the URL (without "https://") where the app is hosted. This will be used to point users to the URL in registration emails.

TODO: Move these values to SSM.

## AWS SES

You will need to apply to AWS for unrestricted sending of emails.

## CI/CD processes

### Environments

Secrets and environment variables should be added to branches individually using the Environments feature on GitHub.

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
