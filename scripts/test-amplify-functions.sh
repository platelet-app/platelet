#!/bin/bash

set -e

cd amplify/backend/function

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
            yarn --frozen-lockfile
        fi
        yarn run test --watchAll=false --passWithNoTests
        cd ..
    fi
    if [ -d 'opt' ];
    then
        if [ -f "package-lock.json" ];
        then
            npm ci
        else
            yarn --frozen-lockfile
        fi
        yarn run test --watchAll=false --passWithNoTests
    fi
    cd ..
done
