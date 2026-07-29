## Configuring the AWS command line

Installing the AWS CLI is dependent on your operating system.

Once installed, you can set up SSO with the platelet.app Google workspace.

`aws configure sso`

Follow the step by step instructions. When it asks for the start URL use:

`https://platelet.awsapps.com/start`

If you want to make it the default profile write "default" for the profile name.

To use SSO with Amplify, you need to edit `~/.aws/config` and add the following line under your new profile:

`credential_process = aws configure export-credentials --profile <my-sso-profile>`

If you named the profile "default" then it would be:

`credential_process = aws configure export-credentials --profile default`

## Provisioning a backend

Amplify Gen 1 no longer allows initialising an Amplify app using the Amplify CLI with `amplify init`. If you do not have any Amplify app deployed, you must connect it to a branch on GitHub (or a preferred git host) using the AWS console.

During setup, once the branch is connected under App settings, expand `Advanced settings` and click `Add new` under `Live package updates`. Select `Node.js version` and set it to 20. This is because the `canvas` package used in the front-end fails to build on later node versions.

The app will now automatically build and a backend provisioned.

## Pulling the backend to your local project

Once the build has completed, you can pull it to your local project to work on:

`amplify pull --appId <app-id> --envName <env-name>`

Find the App ID and environment name on the app overview. The environment name is typically generated in the form of a person's name (e.g. evanne).

## Creating a new environment

If you want to create a new environment that is separate to the git connected environment, you can use:

`amplify env add`

Then:

`amplify push`

to push it to AWS. It will remain under the same Amplify app, but create a new backend.

If you see an error about node module sharp failing to build, make sure you have the `vips` library installed on your system.

`brew install vips`

or the equivalent for your Linux package manager.

`amplify push -y` can also be used to push without confirmation.

## Using node 20 locally

The easiest way to be able to switch node versions is with `nvm`.

Install using `brew install nvm` on Mac or your package manager if on Linux.

Then:

`nvm install 20`
`nvm use 20`

## Front-end

In the project directory run:

`npm install`

Build packages in the project:

`npm run build:packages`

Then use:

`npm start`

to start working on the front-end. Navigate to `http://localhost:3000` if it does not open automatically. You will be connected to your pulled backend, or the new one you created.

## Creating a primary admin user

TODO: This process should be streamlined either with a GitHub action or using the supporting CDK. These instructions are subject to change.

Before you can log in, you must create a primary admin user.

run `amplify console` to directly open details about your backend.

Select the `Authentication` tab check the name of the user pool. Click `View in Cognito` and select the pool from the list.

Under `User management` on the sidebar, click `Users` and `Create user`.

Create a user with username "super" and any email.

Once it is created, click on the user and add it to the `SUPER` group.

Return to your terminal and run `amplify api console`, when prompted select `GraphQL`.

Select the API with your environnment name. Then `Run a query`.

Click the icon that looks like a key, then `Login with User Pools`. Log in with the super account created earlier. It might prompt you to create a new password, but you can use the same password you created earlier.

Once logged in, click the 3rd icon down that looks like a folder with a plus sign.

Replace the placeholder query with this:

```
mutation MyMutation {
  registerTenant(
    emailAddress: "<some-email>"
    name: "<some-name>"
    tenantName: "<some-tenant-name>"
  ) {
    id
  }
}
```

The email address must be different to the one used for the super account, but one you can access.

###### Public bucket with profile pictures

There is a public set of pictures for demo mode at `platelet-demo-profilepics` with region `eu-west-1`

## Development

When making changes to the graphql schema, you should run:

`amplify codegen models`

To generate new models for the DataStore.

Run:

`amplify push`

to push changes to an online AWS Amplify dev environment. This is optional because you can do most development using only the generated models.
