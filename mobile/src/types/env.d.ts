declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production";
            EXPO_PUBLIC_DEMO_MODE: "true" | "false";
            EXPO_PUBLIC_OFFLINE_ONLY: "true" | "false";
            EXPO_PUBLIC_POPULATE_FAKE_DATA: "true" | "false";
            EXPO_PUBLIC_TENANT_GRAPHQL_ENDPOINT: URL | "undefined" | undefined;
            EXPO_PUBLIC_TENANT_GRAPHQL_API_KEY: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
