# Branches

Automated builds can be triggered by pushing a branch matching a certain pattern.

## DEV

To deploy a build into the dev environment, prefix the branch name with `dev/`.

e.g. `dev/ducks`.

## TEST

To deploy a build into the test environment, prefix the branch name with `test/`.

e.g. `test/cats`.

## PRODUCTION

`production/` does not serve any production environments in the main repository. It should not be used except in a production repository.

## Deleting an environment

Deleting a branch in dev or test and pushing it to the main repository will also delete that environment in AWS, however it will not delete the supporting CDK stack.

TODO?: create a GitHub action that cleans up the supporting CDK when a branch is deleted.

## Monitoring builds

If you have the GitHub CLI set up, you can monitor a build remotely with the `gh run watch` command.
