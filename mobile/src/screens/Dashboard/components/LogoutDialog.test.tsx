import LogoutDialog from "./LogoutDialog";
import { fireEvent, render, screen, waitFor } from "../../../test-utils";
import { Auth, DataStore } from "aws-amplify";

describe("LogoutDialog", () => {
    it("logs the user out", async () => {
        const authSpy = jest.spyOn(Auth, "signOut");
        const dataStoreStopSpy = jest.spyOn(DataStore, "stop");
        const dataStoreClearSpy = jest.spyOn(DataStore, "clear");
        render(<LogoutDialog visible={true} onDismiss={() => {}} />);
        screen.getByText("Do you want to log out?");
        fireEvent.press(screen.getByRole("button", { name: "Log out" }));

        await waitFor(() => {
            expect(authSpy).toHaveBeenCalled();
            expect(dataStoreStopSpy).toHaveBeenCalled();
            expect(dataStoreClearSpy).toHaveBeenCalled();
        });
    });
});
