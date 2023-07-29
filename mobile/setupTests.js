import MockAsyncStorage from "mock-async-storage";
import "@testing-library/jest-native/extend-expect";

const mockImpl = new MockAsyncStorage();
jest.mock("@react-native-async-storage/async-storage", () => mockImpl);
jest.mock("expo-font");
jest.mock("expo-asset");
