declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production";
            REACT_APP_OFFLINE_ONLY: "true" | "false";
            REACT_APP_POPULATE_FAKE_DATA: "true" | "false";
            REACT_APP_DEMO_MODE: "true" | "false";
            REACT_APP_DEMO_PROFILE_PICTURES_BUCKET_NAME?: string;
            REACT_APP_DEMO_PROFILE_PICTURES_BUCKET_REGION?: string;
            REACT_APP_GOOGLE_MAPS_API_KEY: string;
            REACT_APP_TENANT_GRAPHQL_ENDPOINT: URL;
            REACT_APP_TENANT_GRAPHQL_API_KEY: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
