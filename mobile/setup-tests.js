import MockAsyncStorage from "mock-async-storage";

const mockImpl = new MockAsyncStorage();
jest.mock("@react-native-async-storage/async-storage", () => mockImpl);
jest.mock("expo-font");
jest.mock("expo-asset");
