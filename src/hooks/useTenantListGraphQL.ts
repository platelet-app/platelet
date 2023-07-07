import React from "react";
import { ModelIDInput, ModelIntInput, ModelStringInput } from "../API";

type Tenant = {
    __typename: "Tenant";
    id: string;
    awsEnvName: string;
    name: string;
    config: string;
    version: number;
    createdAt: string;
    updatedAt: string;
};

type ModelTenantFilterInput = {
    id?: ModelIDInput | null;
    awsEnvName?: ModelStringInput | null;
    name?: ModelStringInput | null;
    config?: ModelStringInput | null;
    version?: ModelIntInput | null;
    and?: Array<ModelTenantFilterInput | null> | null;
    or?: Array<ModelTenantFilterInput | null> | null;
    not?: ModelTenantFilterInput | null;
};

type ListTenantsQueryVariables = {
    filter?: ModelTenantFilterInput | null;
    limit?: number | null;
    nextToken?: string | null;
};

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

const fetchData = (
    query: string,
    variables: ListTenantsQueryVariables | null = null
) => {
    if (
        !process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT ||
        process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT === "undefined"
    ) {
        console.warn(
            "REACT_APP_TENANT_GRAPHQL_ENDPOINT is undefined, returning empty response"
        );
        return Promise.resolve({
            json: () =>
                Promise.resolve({ data: { listTenants: { items: [] } } }),
        });
    }
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

const useTenantListGraphQL = () => {
    const [state, setState] = React.useState<Tenant[]>([]);
    const [error, setError] = React.useState<null | Error>(null);
    const [isFetching, setIsFetching] = React.useState<boolean>(false);
    const getTenantList = React.useCallback(async () => {
        try {
            setIsFetching(true);
            const response = await fetchData(listTenants);
            const { data } = await response.json();
            setState(data.listTenants.items);
        } catch (error) {
            console.log("List tenant graphql error:", error);
            if (error instanceof Error) {
                setError(error);
            }
        } finally {
            setIsFetching(false);
        }
    }, []);

    React.useEffect(() => {
        getTenantList();
    }, [getTenantList]);

    return { state, error, isFetching };
};

export default useTenantListGraphQL;
