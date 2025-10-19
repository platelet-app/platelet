#!/bin/bash

readarray -t <<<$(jq '.[][]' $1 |  awk -F"/" '{print (NF>1)? "        \"" $NF "," : ""}')

IFS=$'\n'

echo "
{
    \"adminRoleNames\": [
${MAPFILE[*]}
    ]
}
"
