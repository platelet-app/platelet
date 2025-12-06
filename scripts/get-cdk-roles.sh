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
]" > "./amplify/backend/function/plateletUserTakeOutData/custom-policies.json"
