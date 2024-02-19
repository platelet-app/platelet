import ForwardBackButtons from "./ForwardBackButtons";
import userEvent from "@testing-library/user-event";
import { Router, RouterProps } from "react-router-dom";
import { render, screen } from "@testing-library/react";

describe("ForwardBackButtons", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    test("going back and forward through the history", async () => {
        const goBack = jest.fn();
        const goForward = jest.fn();
        const historyMock = {
            push: jest.fn(),
            listen: jest.fn(),
            location: { key: "test" },
            goBack,
            goForward,
        };
        render(
            <Router history={historyMock as unknown as RouterProps["history"]}>
                <ForwardBackButtons />
            </Router>
        );
        userEvent.click(screen.getByRole("button", { name: "go back" }));
        expect(goBack).toHaveBeenCalledTimes(1);
        userEvent.click(screen.getByRole("button", { name: "go forward" }));
        expect(goForward).toHaveBeenCalledTimes(1);
    });
    test("disable the buttons", async () => {
        // @ts-ignore
        window.navigation = {
            canGoForward: false,
        };
        const goBack = jest.fn();
        const goForward = jest.fn();
        const historyMock = {
            push: jest.fn(),
            listen: jest.fn(),
            location: { key: undefined },
            goBack,
            goForward,
        };
        render(
            <Router history={historyMock as unknown as RouterProps["history"]}>
                <ForwardBackButtons />
            </Router>
        );
        const backButton = screen.getByRole("button", { name: "go back" });
        expect(backButton).toBeDisabled();
        const forwardButton = screen.getByRole("button", {
            name: "go forward",
        });
        expect(forwardButton).toBeDisabled();
    });
});
