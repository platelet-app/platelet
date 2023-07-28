import {
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react-native";
//import { DataStore } from "aws-amplify";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Dashboard from "./Dashboard";

describe("Dashboard", () => {
    test("renders 'ACTIVE' when status is 'inProgress'", async () => {
        //const querySpy = jest.spyOn(DataStore, "query");
        render(
            <SafeAreaProvider>
                <Dashboard status="inProgress" />
            </SafeAreaProvider>
        );
        screen.debug();
        await waitFor(() => {
            expect(screen.getByText("ACTIVE")).toBeInTheDocument();
        });
    });
});
