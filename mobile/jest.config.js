module.exports = {
    setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
    preset: "jest-expo",
    transformIgnorePatterns: [
        "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
        "node_modules/(?!(@aws-amplify/ui-react|@aws-amplify/DataStore))/",
    ],
    moduleNameMapper: {
        // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
        uuid: require.resolve("uuid"),
    },
    globalSetup: "./global-setup.js",
};
