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

## Environment Variables

###### REACT_APP_OFFLINE_ONLY

When set to `true` the app will not attempt to connect to any AWS Amplify deployment and will work offline only.

###### REACT_APP_POPULATE_FAKE_DATA

When set to `true` the app will populate itself with some fake data. Best used with REACT_APP_OFFLINE_ONLY.

Note: you should clear site data before connecting to an AWS amplify deployment, to save fake data from being synchronised to the server.

###### REACT_APP_DEMO_MODE

When set to `true` the app will clear saved data on each page reload. Good for a demonstration of the app combined with REACT_APP_POPULATE_FAKE_DATA.

###### REACT_APP_THROW_ERRORS

Set this to `true` if Redux should throw errors instead of handling them and showing a notification. This can be helpful when developing.

###### REACT_APP_RESIZE_BUCKET_NAME

This is the name of the bucket that should receive profile picture files to be resized with a lambda trigger to function `plateletImageResize`.

###### REACT_APP_DEMO_PROFILE_PICTURES_BUCKET_NAME

The name of the bucket that should contain profile pictures for demo mode.

It should contain two directorys:

`profilePictures`

`profilePictureThumbnails`

with files {001...0XX}.jpg and {001...0XX}\_thumbnail.jpg respectively.

###### REACT_APP_DEMO_PROFILE_PICTURES_BUCKET_REGION

The region for the demo profile pictures bucket.

###### Public bucket with profile pictures

There is a public set of pictures for demo mode at `platelet-demo-profilepics` with region `eu-west-1`

## Development

When making changes to the graphql schema, you should run:

`amplify codegen models`

To generate new models for the DataStore.

Run:

`amplify push`

to push changes to an online AWS Amplify dev environment. This is optional because you can do most development using only the generated models.

