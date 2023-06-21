import SignInHeader from "./SignInHeader";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataStore } from "aws-amplify";

describe("SignInHeader", () => {
    const original = window.location;
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
    });
    afterAll(() => {
        Object.defineProperty(window, "location", {
            configurable: true,
            value: original,
        });
        process.env = OLD_ENV;
    });

    it("shows the team name", async () => {
        process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT = "something";
        process.env.REACT_APP_TENANT_GRAPHQL_API_KEY = "somekey";
        const windowReload = jest.fn();
        Object.defineProperty(window, "location", {
            configurable: true,
            value: { reload: windowReload },
        });

        jest.spyOn(Storage.prototype, "getItem").mockReturnValue("Team Name");
        const clearSpy = jest
            .spyOn(Storage.prototype, "clear")
            .mockReturnValue(null);
        const dataStoreClearSpy = jest
            .spyOn(DataStore, "clear")
            .mockResolvedValue(null);
        render(<SignInHeader />);
        expect(screen.getByText("TEAM NAME")).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "Change team" }));
        expect(clearSpy).toHaveBeenCalled();
        expect(dataStoreClearSpy).toHaveBeenCalled();
        await waitFor(() => expect(windowReload).toHaveBeenCalled());
    });
});
