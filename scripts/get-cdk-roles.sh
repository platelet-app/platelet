#!/bin/bash

readarray -t <<<$(jq '.[] | to_entries[] | select(.key|contains("AdminRoleNames")).value' $1 |  awk -F"/" '{print (NF>1)? "        \"" $NF "," : ""}')

IFS=$'\n'

echo "
{
    \"adminRoleNames\": [
${MAPFILE[*]}
    ]
}
" > "./amplify/backend/api/platelet/custom-roles.json"

DELETE_USER_STATE_MACHINE_ARN=$(jq '.[] | to_entries[] | select(.key|contains("DeleteUserStateMachineArnOutput")).value' $1)

DELETE_USER_STATE_MACHINE_ARN_SSM_PARAM_ARN=$(jq '.[] | to_entries[] | select(.key|contains("DeleteUserStateMachineArnSSMParamArnOutput")).value' $1)

echo "
[
    {
        \"Action\": [
            \"states:StartExecution\",
            \"ssm:GetParameter\",
            \"ssm:GetParameters\",
            \"ssm:GetParametersByPath\"
        ],
        \"Resource\": [
            $DELETE_USER_STATE_MACHINE_ARN,
            $DELETE_USER_STATE_MACHINE_ARN_SSM_PARAM_ARN
        ]
    }
]" > "./amplify/backend/function/plateletAdminDeleteUser/custom-policies.json"

USER_TAKE_OUT_DATA_STATE_MACHINE_ARN=$(jq '.[] | to_entries[] | select(.key|contains("TakeOutUserDataStateMachineArnOutput")).value' $1)

USER_TAKE_OUT_DATA_STATE_MACHINE_ARN_SSM_PARAM_ARN=$(jq '.[] | to_entries[] | select(.key|contains("TakeOutUserDataStateMachineArnSSMParamArnOutput")).value' $1)


TENANT_NAME_PARAM_NAME=$(jq '.[] | to_entries[] | select(.key|contains("TenantNameSSMParamNameOutput")).value' $1)
TENANT_WEBSITE_PARAM_NAME=$(jq '.[] | to_entries[] | select(.key|contains("TenantWebsiteSSMParamNameOutput")).value' $1)

echo "
[
    {
        \"Action\": [
            \"states:StartExecution\",
            \"ssm:GetParameter\",
            \"ssm:GetParameters\",
            \"ssm:GetParametersByPath\"
        ],
        \"Resource\": [
            $USER_TAKE_OUT_DATA_STATE_MACHINE_ARN,
            $USER_TAKE_OUT_DATA_STATE_MACHINE_ARN_SSM_PARAM_ARN
        ]
    }
]" > "./amplify/backend/function/plateletUserTakeOutData/custom-policies.json"

# the tenant name and website should be accessible by the ddb stream function
# this means it can send that data as part of the SQS message
# and it can be retrieved through the tracking API

echo "
[
    {
        \"Action\": [
            \"ssm:GetParameter\",
            \"ssm:GetParameters\",
            \"ssm:GetParametersByPath\"
        ],
        \"Resource\": [
            $TENANT_NAME_PARAM_NAME,
            $TENANT_WEBSITE_PARAM_NAME
        ]
    }
]" > "./amplify/backend/function/plateletTaskDynamoDBStream/custom-policies.json"
