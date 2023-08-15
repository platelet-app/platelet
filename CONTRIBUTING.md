## Docker

You can run this using docker:

`docker-compose up`

or alternatively follow the setup instructions below.

## Setup

There is minimal setup required for running this project. On Ubuntu, install the package `npm`

`sudo apt install npm`

In the project directory run:

`npm install`

and

`npm start`

###### Public bucket with profile pictures

There is a public set of pictures for demo mode at `platelet-demo-profilepics` with region `eu-west-1`

## Development

When making changes to the graphql schema, you should run:

`amplify codegen models`

To generate new models for the DataStore.

Run:

`amplify push`

to push changes to an online AWS Amplify dev environment. This is optional because you can do most development using only the generated models.

