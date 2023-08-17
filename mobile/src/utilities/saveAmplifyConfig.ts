import AsyncStorage from "@react-native-async-storage/async-storage";

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

const fetchData = async (
    query: string,
    variables: TenantQueryVariables | null = null,
    timeout: number = 300000
) => {
    const APPSYNC_API_URL = process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT;
    const credentialsAppSync = {
        "x-api-key": process.env.REACT_APP_TENANT_GRAPHQL_API_KEY,
    };
    if (!APPSYNC_API_URL)
        throw new Error("Tenant GraphQL endpoint is not defined");
    if (!credentialsAppSync)
        throw new Error("Tenant GraphQL API key is not defined");
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(APPSYNC_API_URL, {
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
        signal: controller.signal,
    });
    clearTimeout(id);
    return response;
};

async function saveAmplifyConfig(
    tenantId: string,
    timeout: number
): Promise<object> {
    console.log("Fetching tenant config", tenantId);
    try {
        const response: Response = await fetchData(
            getTenant,
            {
                id: tenantId,
            },
            timeout
        );
        const { data } = await response.json();
        const { config, version, name } = data.getTenant;
        const currentVersion: string | null = await AsyncStorage.getItem(
            "tenantVersion"
        );
        const amplifyConfig = JSON.parse(config);
        if (!currentVersion || version > parseInt(currentVersion)) {
            console.log("Updating tenant config");
            await AsyncStorage.setItem(
                "amplifyConfig",
                JSON.stringify(amplifyConfig)
            );
            AsyncStorage.setItem("tenantVersion", version.toString());
            AsyncStorage.setItem("tenantName", name);
        }
        return amplifyConfig;
    } catch (e) {
        console.log("could not get current config, using async storage");
        console.log(e);
        const config = await AsyncStorage.getItem("amplifyConfig");
        if (!config)
            throw new Error("Tenant config is not available in async storage");
        return JSON.parse(config);
    }
}

export default saveAmplifyConfig;
