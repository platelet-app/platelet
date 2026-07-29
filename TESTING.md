# Testing

There are unit tests and E2E tests.

## Unit tests for the front-end

Make sure you are using node 20:

`nvm use 20`

Install all packages: `npm install`.

Then build local packages: `npm run build:packages`.

and run:

`npm test` to test in watch mode or `npm test -- --watchAll=false` to run all tests immediately.

If you get an error about "The module ... was compiled against a different Node.js version using ..." make sure you are using the same node version as you did when running `npm install`.

## Amplify lambda functions

Run `npm run test:lambda`. This runs the script `scripts/test-amplify-functions.sh`.

## CDK lambda functions

Run `npm run test:cdk-lambda`. This runs the script `scripts/test-cdk-functions.sh`.

## Cypress

You can run end to end tests with `npm run test:e2e`
