declare module "@env" {
    export const REACT_APP_OFFLINE_ONLY: "true" | "false" | undefined;
    export const REACT_APP_POPULATE_FAKE_DATA: "true" | "false" | undefined;
    export const REACT_APP_DEMO_MODE: "true" | "false" | undefined;
    export const REACT_APP_RESIZE_BUCKET_NAME: string | undefined;
    export const REACT_APP_DEMO_PROFILE_PICTURES_BUCKET_NAME:
        | string
        | undefined;
    export const REACT_APP_DEMO_PROFILE_PICTURES_BUCKET_REGION:
        | string
        | undefined;
    export const REACT_APP_GOOGLE_MAPS_API_KEY: string | undefined;
    export const REACT_APP_TENANT_GRAPHQL_ENDPOINT: string | undefined;
    export const REACT_APP_TENANT_GRAPHQL_API_KEY: string | undefined;
}
