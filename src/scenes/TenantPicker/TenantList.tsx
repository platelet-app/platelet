import React, { useEffect } from "react";
import { Stack, Typography } from "@mui/material";
import { TenantCard } from "./components/TenantCard";
import { PaddedPaper } from "../../styles/common";

export const getTenant = /* GraphQL */ `
    query GetTenant($id: ID!) {
        getTenant(id: $id) {
            id
            name
            config
            createdAt
            updatedAt
        }
    }
`;
export const listTenants = /* GraphQL */ `
    query ListTenants(
        $filter: ModelTenantFilterInput
        $limit: Int
        $nextToken: String
    ) {
        listTenants(filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                id
                name
            }
            nextToken
        }
    }
`;

interface TenantQueryVariables {
    id: string;
}

const fetchData = (
    query: string,
    variables: TenantQueryVariables | null = null
) => {
    const APPSYNC_API_URL = process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT;
    const credentialsAppSync = {
        "x-api-key": process.env.REACT_APP_TENANT_GRAPHQL_API_KEY,
    };
    return fetch(APPSYNC_API_URL, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...credentialsAppSync,
        },
        body: JSON.stringify({
            query,
            variables: variables || {},
        }),
        credentials: "omit",
    });
};

interface TenantListInterface {
    name: string;
    id: string;
    config: string;
}

function TenantList() {
    const [tenants, setTenants] = React.useState([]);

    const getTenantList = React.useCallback(() => {
        fetchData(listTenants).then((response) => {
            response.json().then((data) => {
                setTenants(data.data.listTenants.items);
            });
        });
    }, []);
    useEffect(() => {
        getTenantList();
    }, [getTenantList]);

    const onClickTenant = (id: string) => {
        fetchData(getTenant, { id }).then((response) => {
            response.json().then((data) => {
                console.log(data);
            });
        });
    };

    return (
        <PaddedPaper>
            <Stack>
                <Typography>Choose a tenant</Typography>
                {tenants.map((tenant: TenantListInterface) => (
                    <TenantCard
                        onClick={() => onClickTenant(tenant.id)}
                        key={tenant.id}
                        name={tenant.name}
                    />
                ))}
            </Stack>
        </PaddedPaper>
    );
}

export default TenantList;
