import React from "react";
import TaskActions from "./TaskActions";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as amplify from "aws-amplify";

jest.mock("aws-amplify");

jest.mock("../../../redux/Selectors", () => ({
    dataStoreReadyStatusSelector: () => true,
}));

describe("TaskActions", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    it("renders", async () => {
        amplify.DataStore.query.mockResolvedValue({});
        render(<TaskActions />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
    });
    test("all buttons are disabled when isFetching state is set", async () => {
        amplify.DataStore.query.mockResolvedValue({});
        render(<TaskActions />);
        expect(screen.getByRole("button", { name: "pickedUp" })).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "droppedOff" })
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "cancelled" })
        ).toBeDisabled();
        expect(screen.getByRole("button", { name: "rejected" })).toBeDisabled();
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
    });

    it("clicks the picked up button", async () => {
        const mockFunction = jest.fn();
        amplify.DataStore.query.mockResolvedValue({});
        render(<TaskActions onChangeTimePickedUp={mockFunction} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
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

    test("delivered button is disabled without timePickedUp set", async () => {
        amplify.DataStore.query.mockResolvedValue({ timePickedUp: null });
        render(<TaskActions />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "droppedOff" });
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it("clicks the delivered button when timePickedUp is set", async () => {
        const mockFunction = jest.fn();
        amplify.DataStore.query.mockResolvedValue({
            timePickedUp: new Date().toISOString(),
        });
        render(<TaskActions onChangeTimeDroppedOff={mockFunction} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "droppedOff" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        // expect the mock function to have been called with a Date object
        expect(mockFunction).toHaveBeenCalledWith(expect.any(Date));
        // expect button to be toggled
        expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("clicks the cancelled button", async () => {
        const mockFunction = jest.fn();
        amplify.DataStore.query.mockResolvedValue({});
        render(<TaskActions onChangeTimeCancelled={mockFunction} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
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

    it("clicks the rejected button", async () => {
        const mockFunction = jest.fn();
        amplify.DataStore.query.mockResolvedValue({});
        render(<TaskActions onChangeTimeRejected={mockFunction} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
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

    test("rejected and cancelled are disabled when timePickedUp and timeDroppedOff is set", async () => {
        amplify.DataStore.query.mockResolvedValue({
            timeDroppedOff: new Date().toISOString(),
            timePickedUp: new Date().toISOString(),
        });
        render(<TaskActions />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        expect(screen.getByRole("button", { name: "rejected" })).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "cancelled" })
        ).toBeDisabled();
    });

    test("untoggle timePickedUp", async () => {
        const mockFunction = jest.fn();
        amplify.DataStore.query.mockResolvedValue({
            timePickedUp: new Date().toISOString(),
        });
        render(<TaskActions onChangeTimePickedUp={mockFunction} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "pickedUp" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        // expect the mock function to have been called with null
        expect(mockFunction).toHaveBeenCalledWith(null);
    });

    test("untoggle timeDroppedOff", async () => {
        const mockFunction = jest.fn();
        amplify.DataStore.query.mockResolvedValue({
            timePickedUp: new Date().toISOString(),
            timeDroppedOff: new Date().toISOString(),
        });
        render(<TaskActions onChangeTimeDroppedOff={mockFunction} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "droppedOff" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        // expect the mock function to have been called with null
        expect(mockFunction).toHaveBeenCalledWith(null);
    });

    test("untoggle timeCancelled", async () => {
        const mockFunction = jest.fn();
        amplify.DataStore.query.mockResolvedValue({
            timeCancelled: new Date().toISOString(),
        });
        render(<TaskActions onChangeTimeCancelled={mockFunction} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "cancelled" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        // expect the mock function to have been called with null
        expect(mockFunction).toHaveBeenCalledWith(null);
    });

    test("untoggle timeRejected", async () => {
        const mockFunction = jest.fn();
        amplify.DataStore.query.mockResolvedValue({
            timeRejected: new Date().toISOString(),
        });
        render(<TaskActions onChangeTimeRejected={mockFunction} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "rejected" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        // expect the mock function to have been called with null
        expect(mockFunction).toHaveBeenCalledWith(null);
    });
});
