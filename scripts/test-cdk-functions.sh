#!/bin/bash

set -e

cd cdk/lib/lambda/node

for dir in */ ; do
  cd "$dir"
  echo "Current working directory: $PWD"
    if [ -d 'src' ];
    then
        cd 'src'
        if [ -f "package-lock.json" ];
        then
            npm ci
        else
            npm install --frozen-lockfile
        fi
        npm run test --watchAll=false
        cd ..
    fi
    if [ -d 'opt' ];
    then
        if [ -f "package-lock.json" ];
        then
            npm ci
        else
            npm install --frozen-lockfile
        fi
        npm run test --watchAll=false
    fi
    cd ..
done
