import React from "react";
import TaskActions from "./TaskActions";
import { render } from "../../../test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("TaskActions", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    it("renders", () => {
        render(<TaskActions />);
    });
    test("all buttons are disabled when isFetching prop is set", () => {
        render(<TaskActions isFetching={true} />);
        expect(screen.getByRole("button", { name: "pickedUp" })).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "droppedOff" })
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "cancelled" })
        ).toBeDisabled();
        expect(screen.getByRole("button", { name: "rejected" })).toBeDisabled();
    });

    it("clicks the picked up button", () => {
        const mockFunction = jest.fn();
        render(<TaskActions onChangeTimePickedUp={mockFunction} />);
        const button = screen.getByRole("button", { name: "pickedUp" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        // expect the mock function to have been called with a Date object
        expect(mockFunction).toHaveBeenCalledWith(expect.any(Date));
        // expect button to be toggled
        expect(button).toHaveAttribute("aria-pressed", "true");
        const buttonDroppedOff = screen.getByRole("button", {
            name: "droppedOff",
        });
        expect(buttonDroppedOff).toBeEnabled();
    });

    test("delivered button is disabled without timePickedUp set", () => {
        render(<TaskActions />);
        const button = screen.getByRole("button", { name: "droppedOff" });
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it("clicks the delivered button when timePickedUp is set", () => {
        const mockFunction = jest.fn();
        render(
            <TaskActions
                task={{ timePickedUp: new Date().toISOString() }}
                onChangeTimeDroppedOff={mockFunction}
            />
        );
        const button = screen.getByRole("button", { name: "droppedOff" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        // expect the mock function to have been called with a Date object
        expect(mockFunction).toHaveBeenCalledWith(expect.any(Date));
        // expect button to be toggled
        expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("clicks the cancelled button", () => {
        const mockFunction = jest.fn();
        render(<TaskActions onChangeTimeCancelled={mockFunction} />);
        const button = screen.getByRole("button", { name: "cancelled" });
        userEvent.click(button);
        // expect the mock function to have been called with a Date object
        expect(mockFunction).toHaveBeenCalledWith(expect.any(Date));
        // expect button to be toggled
        expect(button).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByRole("button", { name: "cancelled" })).toBeEnabled();
        expect(screen.getByRole("button", { name: "rejected" })).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "droppedOff" })
        ).toBeDisabled();
        expect(screen.getByRole("button", { name: "pickedUp" })).toBeDisabled();
    });

    it("clicks the rejected button", () => {
        const mockFunction = jest.fn();
        render(<TaskActions onChangeTimeRejected={mockFunction} />);
        const button = screen.getByRole("button", { name: "rejected" });
        userEvent.click(button);
        // expect the mock function to have been called with a Date object
        expect(mockFunction).toHaveBeenCalledWith(expect.any(Date));
        // expect button to be toggled
        expect(button).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByRole("button", { name: "rejected" })).toBeEnabled();
        expect(
            screen.getByRole("button", { name: "cancelled" })
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "droppedOff" })
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "cancelled" })
        ).toBeDisabled();
    });

    test("rejected and cancelled are disabled when timePickedUp and timeDroppedOff is set", () => {
        render(
            <TaskActions
                task={{
                    timeDroppedOff: new Date().toISOString(),
                    timePickedUp: new Date().toISOString(),
                }}
            />
        );
        expect(screen.getByRole("button", { name: "rejected" })).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "cancelled" })
        ).toBeDisabled();
    });

    test("untoggle timePickedUp", () => {
        const mockFunction = jest.fn();
        render(
            <TaskActions
                onChangeTimePickedUp={mockFunction}
                task={{
                    timePickedUp: new Date().toISOString(),
                }}
            />
        );
        const button = screen.getByRole("button", { name: "pickedUp" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        // expect the mock function to have been called with null
        expect(mockFunction).toHaveBeenCalledWith(null);
    });

    test("untoggle timeDroppedOff", () => {
        const mockFunction = jest.fn();
        render(
            <TaskActions
                onChangeTimeDroppedOff={mockFunction}
                task={{
                    timePickedUp: new Date().toISOString(),
                    timeDroppedOff: new Date().toISOString(),
                }}
            />
        );
        const button = screen.getByRole("button", { name: "droppedOff" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        // expect the mock function to have been called with null
        expect(mockFunction).toHaveBeenCalledWith(null);
    });

    test("untoggle timeCancelled", () => {
        const mockFunction = jest.fn();
        render(
            <TaskActions
                onChangeTimeCancelled={mockFunction}
                task={{
                    timeCancelled: new Date().toISOString(),
                }}
            />
        );
        const button = screen.getByRole("button", { name: "cancelled" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        // expect the mock function to have been called with null
        expect(mockFunction).toHaveBeenCalledWith(null);
    });

    test("untoggle timeRejected", () => {
        const mockFunction = jest.fn();
        render(
            <TaskActions
                onChangeTimeRejected={mockFunction}
                task={{
                    timeRejected: new Date().toISOString(),
                }}
            />
        );
        const button = screen.getByRole("button", { name: "rejected" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        // expect the mock function to have been called with null
        expect(mockFunction).toHaveBeenCalledWith(null);
    });
});
