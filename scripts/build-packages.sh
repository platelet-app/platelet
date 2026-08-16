#!/bin/bash

npm run build:simple --workspace @platelet-app/graphql
npm run build:simple --workspace @platelet-app/types
npm run build:simple --workspace @platelet-app/models
npm run build --workspace @platelet-app/lambda

