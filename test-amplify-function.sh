#!/bin/bash

#set -e

cd amplify/backend/function

for dir in */ ; do
  cd "$dir"
  echo "Current working directory: $PWD"
    if [ -d 'src' ];
    then
        cd 'src'
        yarn
        yarn run test --watchAll=false
        cd ..
    fi
    if [ -d 'opt' ];
    then
        yarn
        yarn run test --watchAll=false
    fi
    cd ..
done
