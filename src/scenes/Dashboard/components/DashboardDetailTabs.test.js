import DashboardDetailTabs from "./DashboardDetailTabs";
import { createMatchMedia, render } from "../../../test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as models from "../../../models";
import GuidedSetupDrawer from "./GuidedSetupDrawer";

describe("DashboardDetailTabs", () => {
    test("in progress and completed tabs", () => {
        const preloadedState = {
            dashboardTabIndex: 0,
        };
        render(<DashboardDetailTabs />, { preloadedState });
        const inProgressTab = screen.getByRole("button", {
            name: "Dashboard in Progress",
        });
        const completedTab = screen.getByRole("button", {
            name: "Dashboard Completed",
        });
        expect(inProgressTab).toHaveClass("MuiChip-colorPrimary");
        expect(completedTab).toHaveClass("MuiChip-colorDefault");
        userEvent.click(completedTab);
        expect(inProgressTab).toHaveClass("MuiChip-colorDefault");
        expect(completedTab).toHaveClass("MuiChip-colorPrimary");
    });

    test("role view menu", () => {
        const mockUser = new models.User({
            roles: [models.Role.COORDINATOR, models.Role.RIDER],
        });
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: mockUser },
        };

        render(<DashboardDetailTabs />, { preloadedState });
        expect(screen.getByText("ALL")).toBeInTheDocument();
        const roleViewMenu = screen.getByRole("button", {
            name: "Role Selection Menu",
        });
        userEvent.click(roleViewMenu);
        const roleViewMenuItems = screen.getAllByRole("menuitem");
        expect(roleViewMenuItems).toHaveLength(3);
        expect(roleViewMenuItems[0]).toHaveTextContent("All Tasks");
        expect(roleViewMenuItems[1]).toHaveTextContent("Coordinator");
        expect(roleViewMenuItems[2]).toHaveTextContent("Rider");
    });

    test("hide role menu if only a rider", () => {
        const mockUser = new models.User({
            roles: [models.Role.RIDER],
        });
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: mockUser },
        };

        render(<DashboardDetailTabs />, { preloadedState });
        expect(
            screen.queryByRole("button", {
                name: "Role Selection Menu",
            })
        ).toBeNull();
    });

    it("toggles between create new and clear if a search is in place", async () => {
        window.matchMedia = createMatchMedia(1280);
        const mockUser = new models.User({
            roles: [models.Role.COORDINATOR, models.Role.RIDER],
        });
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: mockUser },
        };
        render(<DashboardDetailTabs />, { preloadedState });

        const createNewButton = screen.getByRole("button", {
            name: "Create New",
        });
        expect(createNewButton).toBeInTheDocument();
        userEvent.type(
            screen.getByRole("textbox", { name: "Filter tasks" }),
            "test"
        );
        const clearSearchButton = await screen.findByRole("button", {
            name: "Clear Search",
        });
        expect(clearSearchButton).toBeInTheDocument();
        userEvent.click(clearSearchButton);
        expect(createNewButton).toBeInTheDocument();
    });

    test("disabled create new button if guided setup is open", () => {
        const preloadedState = {
            guidedSetupOpen: true,
        };
        render(<DashboardDetailTabs />, { preloadedState });
        const createNewButton = screen.getByRole("button", {
            name: "Create New",
        });
        expect(createNewButton).toBeDisabled();
    });

    test("click the create new button", async () => {
        const preloadedState = {
            guidedSetupOpen: false,
        };
        render(
            <>
                <GuidedSetupDrawer />
                <DashboardDetailTabs />
            </>,
            { preloadedState }
        );
        const createNewButton = screen.getByRole("button", {
            name: "Create New",
        });
        expect(
            screen.queryByRole("button", { name: "Save to dashboard" })
        ).toBeNull();
        userEvent.click(createNewButton);
        expect(
            await screen.findByRole("button", { name: "Save to dashboard" })
        ).toBeInTheDocument();
    });
});
