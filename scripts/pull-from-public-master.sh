#!/bin/bash

# Define the pattern for branches to pull (e.g., "feature-")
BRANCH_PATTERN="production/"

# Get the current branch to return to it later
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Fetch all remote changes first
git fetch --all

# Loop through all local branches
for branch in $(git branch --format="%(refname:short)"); do
  # Check if the branch name matches the pattern
  if [[ "$branch" == "$BRANCH_PATTERN"* ]]; then
    echo "Pulling branch: $branch"
    git checkout "$branch"
    git pull public master --no-edit
  fi
done

# Return to the original branch
git checkout "$CURRENT_BRANCH"
echo "Returned to original branch: $CURRENT_BRANCH"
