import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
    setupFiles: ["<rootDir>/setupTests.ts"],
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
        "^(\\.\\.?\\/.+)\\.js$": "$1",
    },
    globals: {
        "ts-jest": {
            useESM: true,
        },
    },
    transform: {
        ...tsJestTransformCfg,
    },
};
