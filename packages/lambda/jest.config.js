import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset({ useESM: true }).transform;

/** @type {import("jest").Config} **/
export default {
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
        "^(\\.\\.?\\/.+)\\.js$": "$1",
    },
    transform: {
        ...tsJestTransformCfg,
    },
};
