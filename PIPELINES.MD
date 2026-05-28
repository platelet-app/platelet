# CI/CD Workflows

There are several workflows that keep platelet.app up to date.

Secrets and environment variables should be added to branches individually using the Environments feature on GitHub.

## deploy.yml

deploy.yml is the primary deployment for the backend. The Amplify deployment stage also builds the front-end for that specific Amplify environment.

### Steps

- Run tests for both CDK and Amplify back-end functions
- Gather details about the current deployment on Amplify
- Deploy the supporting CDK stack
- Write some of the outputs from CDK to custom-roles.json in some Amplify lambda functions
- Commit the changes
- Deploy Amplify
- Once Amplify is deployed update the tenant API with the contents of aws-exports.js

CDK deploys lambda functions that needs to be able to read and write to the GraphQL API that is being deployed by Amplify.

The roles for these functions are exported from the CDK build and placed in `./amplify/backend/api/platelet/custom-roles.json`.

Additionally some resources deployed by CDK need to be accessed from lambda functions deployed by Amplify. These policies are placed in `custom-policies.json` for the corresponding lambda function.

These changes are then committed to the branch so that they are picked up by the Amplify build.

TODO: Figure out how to deploy to Amplify from the GitHub action itself, so that committing these files is not needed.

The CDK stack will take the name of the git branch.

### Environment Variables and Secrets

#### Secrets

`AWS_ACCESS_KEY_ID`:
The AWS Access Key ID.

`AWS_SECRET_ACCESS_KEY`:
The AWS Secret Access Key.

#### Variables

`AWS_REGION`:
Should match the region the deployment is in.

`AMPLIFY_APP_ID`:
The Amplify APP ID. This can be acquired from the AWS console.

`AWS_ACCOUNT_NUMBER`:
The AWS account number where the CDK stack will be deployed. Used by CDK deployment.

`API_URL`:
The GraphQL endpoint for the tenant API. This can be acquired from the AWS console under AppSync.

`TENANT_NAME`:
The name of the current tenant being deployed to. This is what will be displayed to users when selecting their tenant at initial setup.

`ALERT_EMAIL`:
Optional email address to receive alerts on.

### Updating the tenant API

Attach this policy to the AWS account to give access to the tenant API:

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
                "<your tenant API ARN>/*"
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

TODO: Have the tenant API deployed with CDK and this automated.

### Manual invocation

There is a workflow `update_tenant_api.yaml` which can be invoked manually from the GitHub repository.

The configuration options are:

`Wait for Amplify build`: on manual invocation if set to `true`, the workflow will check and wait for the Amplify build to finish. Otherwise it will continue regardless.

If the Amplify build failed, then the workflow will still fail.

## deploy_to_cloudfront.yml

This workflow is for deploying a standalone front-end, to be used with a tenant API. It does not deploy any back-end resources.

### Steps

- Install dependencies
- Build needed packages in the @platelet-app workspace
- Build the front-end
- Run tests
- Upload the build to S3
- Invalidate the CloudFront distribution

### Environment Variables and Secrets

#### Secrets

`AWS_ACCESS_KEY_ID`:
The AWS Access Key ID.

`AWS_SECRET_ACCESS_KEY`:
The AWS Secret Access Key.

`GOOGLE_MAPS_API_KEY`:
 The Google Maps API key. This provides some functionality to the front-end, including showing maps and location search.

#### Variables

`AWS_REGION`:
Should match the region the deployment is in.

`AWS_S3_BUCKET`:
The S3 bucket the front-end build is saved in and connected to the CF distribution.

`DISTRIBUTION`:
The ID of the CloudFront distribution.

## manual_push.yml

If amplify/cli.json is changed, a normal build on Amplify will not make that change in production.

In this case a full Amplify push is needed.

This workflow can be ran manually when cli.json is change to propagate that change.

### Steps

- Get Amplify details from AWS
- Pull the Amplify project with `amplify pull`
- Checkout amplify/cli.json to undo any changes the amplify pull did to it (otherwise the intended changes will be wiped)
- Push to Amplify with `amplify push -y`

### Environment Variables and Secrets

#### Secrets

`AWS_ACCESS_KEY_ID`:
The AWS Access Key ID.

`AWS_SECRET_ACCESS_KEY`:
The AWS Secret Access Key.

#### Variables

`AWS_REGION`:
Should match the region the deployment is in.

`AMPLIFY_APP_ID`:
The Amplify APP ID. This can be acquired from the AWS console.

## update_tenant_paid_status.yml

This workflow will attach each user in the tenant to the PAID group.

### Environment Variables and Secrets

#### Secrets

`AWS_ACCESS_KEY_ID`:
The AWS Access Key ID.

`AWS_SECRET_ACCESS_KEY`:
The AWS Secret Access Key.

#### Variables

`AWS_REGION`:
Should match the region the deployment is in.

`POOL_ID`:
The user pool ID of the tenant. A link to the cognito group can be found from the Amplify console.

This workflow lets you select whether to add or remove the group from PAID status.
