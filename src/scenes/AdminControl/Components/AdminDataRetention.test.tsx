import React from "react";
import AdminDataRetention from "./AdminDataRetention";
import { render } from "../../../test-utils";
import * as models from "../../../models";
import { userRoles } from "../../../apiConsts";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const preloadedState = {
    whoami: {
        user: new models.User({ roles: [userRoles.user, userRoles.admin] }),
    },
    loadingReducer: {
        GET_WHOAMI: false,
    },
    tenantId: "tenant-id",
};

describe("AdminDataRetention", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    test("renders the component with default values", async () => {
        render(<AdminDataRetention />, { preloadedState });

        expect(
            screen.getByText("Set data retention time")
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "Determine how long data should be retained before automatic deletion"
            )
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText(
                "Retain data indefinitely (no automatic deletion)"
            )
        ).toBeChecked();
        expect(screen.queryByLabelText("Retention Time")).toBeNull();
    });

    test("allows toggling indefinite retention", () => {
        render(<AdminDataRetention />, { preloadedState });

        const checkbox = screen.getByLabelText(
            "Retain data indefinitely (no automatic deletion)"
        );
        expect(checkbox).toBeChecked();

        userEvent.click(checkbox);

        expect(checkbox).not.toBeChecked();
        expect(screen.getByLabelText("Retention Time")).toBeInTheDocument();
        expect(screen.getByLabelText("Unit")).toBeInTheDocument();
    });

    test("allows changing retention time value", () => {
        render(<AdminDataRetention />, { preloadedState });

        // Uncheck indefinite retention first
        const checkbox = screen.getByLabelText(
            "Retain data indefinitely (no automatic deletion)"
        );
        userEvent.click(checkbox);

        const valueInput = screen.getByLabelText("Retention Time");
        userEvent.clear(valueInput);
        userEvent.type(valueInput, "60");

        expect(valueInput).toHaveValue(60);
    });

    test("allows changing time unit", () => {
        render(<AdminDataRetention />, { preloadedState });

        // Uncheck indefinite retention first
        const checkbox = screen.getByLabelText(
            "Retain data indefinitely (no automatic deletion)"
        );
        userEvent.click(checkbox);

        const unitSelect = screen.getByLabelText("Unit");
        userEvent.click(unitSelect);
        userEvent.click(screen.getByText("Weeks"));

        // Check that the unit field now displays "Weeks"
        expect(unitSelect).toHaveTextContent("Weeks");
    });

    test("save button is enabled and clickable", () => {
        render(<AdminDataRetention />, { preloadedState });

        const saveButton = screen.getByRole("button", {
            name: "Save retention settings",
        });
        expect(saveButton).not.toBeDisabled();

        userEvent.click(saveButton);
        // Button should be clickable without errors
    });

    test("shows warning dialog for short retention periods", async () => {
        render(<AdminDataRetention />, { preloadedState });

        // Uncheck indefinite retention
        const checkbox = screen.getByLabelText(
            "Retain data indefinitely (no automatic deletion)"
        );
        userEvent.click(checkbox);

        // Set a short retention period (5 days)
        const valueInput = screen.getByLabelText("Retention Time");
        userEvent.clear(valueInput);
        userEvent.type(valueInput, "5");

        // Click save
        const saveButton = screen.getByRole("button", {
            name: "Save retention settings",
        });
        userEvent.click(saveButton);

        // Warning dialog should appear
        await waitFor(() => {
            expect(
                screen.getByText("Short Retention Period Warning")
            ).toBeInTheDocument();
        });
    });

    test("displays forbidden message if user is not admin", () => {
        render(<AdminDataRetention />, {
            preloadedState: {
                ...preloadedState,
                whoami: { user: new models.User({ roles: [userRoles.user] }) },
            },
        });

        expect(screen.queryByText("Set data retention time")).toBeNull();
        expect(
            screen.getByText("You don't have permission to view this page.")
        ).toBeInTheDocument();
    });

    test("displays skeleton while loading", () => {
        render(<AdminDataRetention />, {
            preloadedState: {
                ...preloadedState,
                loadingReducer: {
                    GET_WHOAMI: true,
                },
            },
        });

        expect(screen.queryByText("Set data retention time")).toBeNull();
    });
});
