#!/bin/sh -l

set -e

APP_ID=$1
ENV_NAME=$2
AWS_CLI_OUTPUT=

if [[ -z "$AWS_ACCESS_KEY_ID" ]]; then
  echo "You must provide the AWS_ACCESS_KEY_ID environment variable."
  exit 1
fi

if [[ -z "$AWS_SECRET_ACCESS_KEY" ]]; then
  echo "You must provide the AWS_SECRET_ACCESS_KEY environment variable."
  exit 1
fi

if [[ -z "$AWS_REGION" ]] ; then
  echo "You must provide the AWS_REGION environment variable."
  exit 1
fi

if [[ -z "$APP_ID" ]] ; then
  echo "You must provide the app-id."
  exit 1
fi

if [[ -z "$ENV_NAME" ]] ; then
  echo "You must provide the environment name."
  exit 1
fi

strip_white_space () {
    echo $1 | tr -d " \t\n\r"
}

get_cli_output () {
    local output;
    echo "Getting backend..."
    output=$(aws amplifybackend get-backend --app-id "$APP_ID" --backend-environment-name "$ENV_NAME")
    exit_status=$?
    AWS_CLI_OUTPUT="$output"
    return $exit_status
}

get_user_pool_id () {
    local userPoolId;
    userPoolId=$(echo "$AWS_CLI_OUTPUT" | jq -r ".AmplifyMetaConfig" | jq -r ".auth" | jq -r ".[keys[0]].output.UserPoolId")
    exit_status=$?
    echo $(strip_white_space "$userPoolId")
    return $exit_status
}

get_appsync_id () {
    local apiId;
    apiId=$(echo "$AWS_CLI_OUTPUT" | jq -r ".AmplifyMetaConfig" | jq -r ".api" | jq -r ".[keys[0]].output.GraphQLAPIIdOutput")
    exit_status=$?
    echo $(strip_white_space "$apiId")
    return $exit_status
}

get_user_pool_arn () {
    local userPoolArn;
    userPoolArn=$(echo "$AWS_CLI_OUTPUT" | jq -r ".AmplifyMetaConfig" | jq -r ".auth" | jq -r ".[keys[0]].output.UserPoolArn")
    exit_status=$?
    echo $(strip_white_space "$userPoolArn")
    return $exit_status
}

get_user_pool_client_id () {
    local clientId;
    clientId=$(echo "$AWS_CLI_OUTPUT" | jq -r ".AmplifyMetaConfig" | jq -r ".auth" | jq -r ".[keys[0]].output.AppClientID")
    exit_status=$?
    echo $(strip_white_space "$clientId")
    return $exit_status
}

get_bucket () {
    local bucket;
    bucket=$(echo "$AWS_CLI_OUTPUT" | jq -r ".AmplifyMetaConfig" | jq -r ".storage" | jq -r ".[keys[0]].output.BucketName")
    exit_status=$?
    echo $(strip_white_space "$bucket")
    return $exit_status
}

get_backend_graphql_endpoint () {
    local endpoint;
    local env_name;
    endpoint=$(echo "$AWS_CLI_OUTPUT" | jq -r ".AmplifyMetaConfig" | jq -r ".api.platelet.output.GraphQLAPIEndpointOutput")
    exit_status=$?
    echo $(strip_white_space "$endpoint")
    return $exit_status
}

get_stack_name () {
    local stackname;
    stackname=$(echo "$AWS_CLI_OUTPUT" | jq -r ".AmplifyMetaConfig" | jq -er ".providers.awscloudformation.StackName")
    exit_status=$?
    echo $(strip_white_space "$stackname")
    return $exit_status
}

get_deployment_bucket_name () {
    local deploymentbucket;
    deploymentbucket=$(echo "$AWS_CLI_OUTPUT" | jq -r ".AmplifyMetaConfig" | jq -er ".providers.awscloudformation.DeploymentBucketName")
    exit_status=$?
    echo $(strip_white_space "$deploymentbucket")
    return $exit_status
}

write_output () {
    local graphql_endpoint;
    local user_pool_id;
    local user_pool_arn
    graphql_endpoint=$(get_backend_graphql_endpoint)
    user_pool_id=$(get_user_pool_id)
    user_pool_arn=$(get_user_pool_arn)
    bucket=$(get_bucket)
    appsync_id=$(get_appsync_id)
    client_id=$(get_user_pool_client_id)
    stack_name=$(get_stack_name)
    deployment_bucket_name=$(get_deployment_bucket_name)
    echo "Found graphql endpoint: $graphql_endpoint"
    echo "Found user pool id: $user_pool_id"
    echo "Found user pool arn: $user_pool_arn"
    echo "Found user pool clientId: $client_id"
    echo "Found user bucket: $bucket"
    echo "Found appsync ID: $appsync_id"
    echo "Found stack name: $stack_name"
    echo "Found deployment bucket: $deployment_bucket_name"
}

get_cli_output
write_output
