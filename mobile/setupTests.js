import MockAsyncStorage from "mock-async-storage";
import "@testing-library/jest-native/extend-expect";
import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";

const mockImpl = new MockAsyncStorage();
jest.mock("@react-native-async-storage/async-storage", () => mockImpl);
jest.mock("expo-font");
jest.mock("expo-asset");
global.__reanimatedWorkletInit = () => {};
jest.mock("react-native-reanimated", () =>
    require("react-native-reanimated/mock")
);
jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);
