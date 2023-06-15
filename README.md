![platelet logo](platelet.png "Platelet")

Platelet is an offline first, cloud backed, dispatch software project for couriers and coordinators. It is being developed for Blood Bikers in the UK, but can be used for any delivery tracking.

[Demo](https://demo.platelet.app)

[Homepage](https://platelet.app)

[Discord](https://discord.gg/tWhCM98ckB)

## Screenshots

![dashboard-light](https://github.com/platelet-app/platelet/assets/32309223/c82ff979-723e-4df9-bb3e-729607d07a2d)

![dialog-light](https://github.com/platelet-app/platelet/assets/32309223/d2fd8ac3-08c0-4fff-80af-e914a67f6780)

![mobile-light](https://github.com/platelet-app/platelet/assets/32309223/dfdb0eec-7095-49b5-8339-a47e9ab5b8d0)

Some of Platelet's goals are:

- Provide a robust service for recording assignment details, synchronized across all devices

- Let volunteers coordinate cross country relays over a wide network of groups

- Focus on ease of use and a smooth user experience

- Provide more detailed tracking information for deliveries

- Allow direct requests for deliveries by external users

- Provide reports and statistics

It can be deployed to AWS using Amplify or can be used fully offline with no online synchronization.

If you're interested in developing on Platelet please take a look at [CONTRIBUTING](CONTRIBUTING.md).

## Setting up

The easiest way to install Platelet is to connect a branch on GitHub to Amplify through the AWS console.

### Cognito

Under the Sign-up experience tab:

- Add a custom attribute: `tenantId`

- Disable Self-service sign-up

You might also want to adjust token expiry times. By default token refresh expires after 30 minutes. This means that when users are somewhere with a poor connection, they might be logged out when opening the app.

Under the App integration tab:

Choose a client under App clients and analytics.

Click Edit for App client information.

Adjust Access token expiration and ID token expiration.

### Function parameters

Edit the file `amplify/backend/function/plateletSendUserFeedback/parameters.json` and replace the example email address with an email address to receive feedback to.

Edit the files:

`amplify/backend/function/plateletAddNewTenant/parameters.json`

`amplify/backend/function/plateletAdminAddNewUser/parameters.json`

With an email address to send registration emails from.

`plateletDomainName` should be the URL (without "https://") where the app is hosted. This will be used to point users to the URL in registration emails.

### AWS SES

You will need to apply to AWS for unrestricted sending of emails.
