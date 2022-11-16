import { call, takeLatest } from "redux-saga/effects";
import * as actions from "./getAmplifyConfigActions";

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

function* getAmplifyConfigSaga() {
    const tenantId = localStorage.getItem("tenantId");
    if (!tenantId) return;
    try {
        const response: Response = yield call(fetchData, getTenant, {
            id: tenantId,
        });
        const { data } = yield call([response, "json"]);
        const { config, version } = data.getTenant;
        const currentVersion: string = yield call(
            [localStorage, "getItem"],
            "tenantVersion"
        );
        if (!currentVersion || version > parseInt(currentVersion)) {
            console.log("Updating tenant config");
            const amplifyConfig = JSON.parse(config);
            yield call(
                [localStorage, "setItem"],
                "amplifyConfig",
                JSON.stringify(amplifyConfig)
            );
            yield call(
                [localStorage, "setItem"],
                "tenantVersion",
                version.toString()
            );
        } else {
            console.log("Tenant config is up to date");
        }
    } catch (error) {
        console.log("Error getting the Amplify config:", error);
    }
}

export function* watchGetAmplifyConfig() {
    yield takeLatest(actions.GET_AMPLIFY_CONFIG, getAmplifyConfigSaga);
}
