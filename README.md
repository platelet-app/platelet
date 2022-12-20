![platelet logo](platelet.png "Platelet")

Platelet is an offline first, cloud backed, dispatch software project for couriers and coordinators. It is being developed for Blood Bikers in the UK, but can be used for any delivery tracking.

[Demo](https://demo.platelet.app)

[Homepage](https://platelet.app)

[Discord](https://discord.gg/tWhCM98ckB)

## Screenshots

![dashboard-dark](https://user-images.githubusercontent.com/32309223/200189562-b859fe2f-5345-4d49-8ebc-de48c04ff43d.png)

![dialog-dark-new](https://user-images.githubusercontent.com/32309223/200189567-5ad321ea-a422-4517-8e77-9477a8c3a68e.png)

![mobile-dark](https://user-images.githubusercontent.com/32309223/200189570-9002e4c0-2133-4d9d-8ae7-d92c260b328d.png)

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
