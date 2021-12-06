import React from "react";
import TaskActions from "./TaskActions";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as amplify from "aws-amplify";
import * as models from "../../../models";
import { tasksStatus, userRoles } from "../../../apiConsts";

jest.mock("aws-amplify");

jest.mock("../../../redux/Selectors", () => ({
    dataStoreReadyStatusSelector: () => true,
}));

describe("TaskActions", () => {
    const RealDate = Date;
    const isoDate = "2021-11-29T23:24:58.987Z";

    function mockDate() {
        global.Date = class extends RealDate {
            constructor() {
                super();
                return new RealDate(isoDate);
            }
        };
    }

    afterEach(() => {
        global.Date = RealDate;
    });
    beforeEach(() => {
        jest.restoreAllMocks();
        mockDate();
    });
    it("renders", async () => {
        amplify.DataStore.query.mockResolvedValue({});
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TaskActions taskId={"test"} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
    });
    test("all buttons are disabled when isFetching state is set", async () => {
        amplify.DataStore.query.mockResolvedValue({});
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TaskActions taskId={"test"} />);
        expect(
            screen.getByRole("button", { name: "Picked up" })
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Delivered" })
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Cancelled" })
        ).toBeDisabled();
        expect(screen.getByRole("button", { name: "Rejected" })).toBeDisabled();
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
    });

    it("clicks the picked up button", async () => {
        const mockTask = new models.Task({});
        amplify.DataStore.query
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValue([]);
        amplify.DataStore.save.mockResolvedValue({
            ...mockTask,
            timePickedUp: isoDate,
            status: tasksStatus.new,
        });
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Picked up" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        // expect button to be toggled
        expect(button).toHaveAttribute("aria-pressed", "true");
        const buttonDroppedOff = screen.getByRole("button", {
            name: "Delivered",
        });
        expect(buttonDroppedOff).toBeEnabled();
        await waitFor(async () => {
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timePickedUp: isoDate,
                status: tasksStatus.new,
            });
        });
    });

    test("delivered button is disabled without timePickedUp set", async () => {
        amplify.DataStore.query.mockResolvedValue({ timePickedUp: null });
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TaskActions taskId={"test"} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Delivered" });
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it("clicks the delivered button when timePickedUp is set and there are assignees", async () => {
        const mockTask = new models.Task({ timePickedUp: isoDate });
        const mockAssignments = [
            new models.TaskAssignee({
                task: { id: mockTask.id },
                role: userRoles.rider,
            }),
        ];
        amplify.DataStore.query
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValue(mockAssignments);
        amplify.DataStore.save.mockResolvedValue({
            ...mockTask,
            timeDroppedOff: isoDate,
            status: tasksStatus.droppedOff,
        });
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Delivered" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        // expect the mock function to have been called with a Date object
        // expect button to be toggled
        expect(button).toHaveAttribute("aria-pressed", "true");
        await waitFor(async () => {
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timeDroppedOff: isoDate,
                status: tasksStatus.droppedOff,
            });
        });
    });

    it("clicks the cancelled button", async () => {
        const mockTask = new models.Task({});
        amplify.DataStore.query
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValue([]);
        amplify.DataStore.save.mockResolvedValue({
            ...mockTask,
            status: tasksStatus.new,
        });
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Cancelled" });
        userEvent.click(button);
        await waitFor(async () => {
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timeCancelled: isoDate,
                status: tasksStatus.cancelled,
            });
        });
        expect(button).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByRole("button", { name: "Cancelled" })).toBeEnabled();
        expect(screen.getByRole("button", { name: "Rejected" })).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Delivered" })
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Picked up" })
        ).toBeDisabled();
    });

    it("clicks the rejected button", async () => {
        const mockTask = new models.Task({});
        amplify.DataStore.query
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValue([]);
        amplify.DataStore.save.mockResolvedValue({
            ...mockTask,
            status: tasksStatus.new,
        });
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Rejected" });
        userEvent.click(button);
        await waitFor(async () => {
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timeRejected: isoDate,
                status: tasksStatus.rejected,
            });
        });
        // expect button to be toggled
        expect(button).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByRole("button", { name: "Rejected" })).toBeEnabled();
        expect(
            screen.getByRole("button", { name: "Cancelled" })
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Delivered" })
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Picked up" })
        ).toBeDisabled();
    });

    test("rejected and cancelled are disabled when timePickedUp and timeDroppedOff is set", async () => {
        amplify.DataStore.query.mockResolvedValue({
            timeDroppedOff: new Date().toISOString(),
            timePickedUp: new Date().toISOString(),
        });
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TaskActions taskId={"test"} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        expect(screen.getByRole("button", { name: "Rejected" })).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Cancelled" })
        ).toBeDisabled();
    });

    test("untoggle timePickedUp", async () => {
        const mockTask = new models.Task({ timePickedUp: isoDate });
        amplify.DataStore.query
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValue([]);
        amplify.DataStore.save.mockResolvedValue({});
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Picked up" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        await waitFor(async () => {
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timePickedUp: null,
                status: tasksStatus.new,
            });
        });
    });

    test("untoggle timeDroppedOff", async () => {
        const mockTask = new models.Task({
            timePickedUp: new Date().toISOString(),
            timeDroppedOff: new Date().toISOString(),
        });
        const mockAssignments = [
            new models.TaskAssignee({
                task: { id: mockTask.id },
                role: userRoles.rider,
            }),
        ];
        amplify.DataStore.query
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValue(mockAssignments);
        amplify.DataStore.save.mockResolvedValue({});
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Delivered" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        // expect the mock function to have been called with null
        await waitFor(async () => {
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timeDroppedOff: null,
                status: tasksStatus.pickedUp,
            });
        });
    });

    test("untoggle timeCancelled", async () => {
        const mockTask = new models.Task({
            timeCancelled: isoDate,
        });
        amplify.DataStore.query
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValue([]);
        amplify.DataStore.save.mockResolvedValue({});
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Cancelled" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        // expect the mock function to have been called with null
        await waitFor(async () => {
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timeCancelled: null,
                status: tasksStatus.new,
            });
        });
    });

    test("untoggle timeRejected", async () => {
        const mockTask = new models.Task({
            timeRejected: isoDate,
        });
        amplify.DataStore.query
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValue([]);
        amplify.DataStore.save.mockResolvedValue({});
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Rejected" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        // expect the mock function to have been called with null
        await waitFor(async () => {
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timeRejected: null,
                status: tasksStatus.new,
            });
        });
    });
    test("observer is unsubscribed on unmount", async () => {
        const mockTask = new models.Task({
            timePickedUp: new Date().toISOString(),
        });
        const unsubscribe = jest.fn();
        amplify.DataStore.query.mockResolvedValue(mockTask);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        const component = render(<TaskActions taskId={mockTask.id} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        expect(unsubscribe).toHaveBeenCalledTimes(0);
        component.unmount();
        await waitFor(async () => {
            expect(unsubscribe).toHaveBeenCalledTimes(1);
        });
    });
});
