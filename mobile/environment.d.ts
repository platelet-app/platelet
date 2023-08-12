declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production";
            REACT_APP_TENANT_GRAPHQL_ENDPOINT: URL | "undefined" | undefined;
            REACT_APP_TENANT_GRAPHQL_API_KEY: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
