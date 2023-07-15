export const getTenant = /* GraphQL */ `
    query GetTenant($id: ID!) {
        getTenant(id: $id) {
            id
            name
            config
            version
            createdAt
            updatedAt
        }
    }
`;

type TenantQueryVariables = {
    id: string;
};

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

async function saveAmplifyConfig(tenantId: string): Promise<object> {
    console.log("Fetching tenant config", tenantId);
    try {
        const response: Response = await fetchData(getTenant, {
            id: tenantId,
        });
        const { data } = await response.json();
        const { config, version, name } = data.getTenant;
        const currentVersion: string | null =
            localStorage.getItem("tenantVersion");
        const amplifyConfig = JSON.parse(config);
        if (!currentVersion || version > parseInt(currentVersion)) {
            console.log("Updating tenant config");
            localStorage.setItem(
                "amplifyConfig",
                JSON.stringify(amplifyConfig)
            );
            localStorage.setItem("tenantVersion", version.toString());
            localStorage.setItem("tenantName", name);
        }
        return amplifyConfig;
    } catch (e) {
        console.log("could not get current config, using local storage");
        const config = localStorage.getItem("amplifyConfig");
        if (!config)
            throw new Error("Tenant config is not available in local storage");
        return JSON.parse(config);
    }
}

export default saveAmplifyConfig;
